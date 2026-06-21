import { Router, Request, Response } from 'express';
import { getDb } from '../db.js';
import { sendConfirmationEmail } from '../email.js';
import { v4 as uuid } from 'uuid';

const router = Router();

interface ReservationBody {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  requests?: string;
}

// POST /api/reservations - Create a new reservation
router.post('/', (req: Request, res: Response) => {
  try {
    const { name, email, phone, date, time, guests, requests } = req.body as ReservationBody;

    // Validation
    const errors: string[] = [];
    if (!name || name.trim().length < 2) errors.push('Name is required (min 2 characters)');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
    if (!phone || !/^[\d\s\-+()]{7,20}$/.test(phone)) errors.push('Valid phone number is required');
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) errors.push('Valid date is required (YYYY-MM-DD)');
    if (!time || !/^\d{2}:\d{2}$/.test(time)) errors.push('Valid time is required (HH:MM)');
    if (!guests || guests < 1 || guests > 20) errors.push('Number of guests must be between 1 and 20');

    if (errors.length > 0) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }

    const db = getDb();
    const id = uuid();

    const stmt = db.prepare(`
      INSERT INTO reservations (id, name, email, phone, date, time, guests, requests)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(id, name.trim(), email.trim().toLowerCase(), phone.trim(), date, time, guests, requests?.trim() || '');

    // Send confirmation email (non-blocking)
    sendConfirmationEmail({ id, name, email, date, time, guests, requests }).catch(() => {});

    res.status(201).json({
      message: 'Reservation confirmed!',
      reservation: { id, name, email, date, time, guests, status: 'confirmed' }
    });
  } catch (err) {
    console.error('Reservation error:', err);
    res.status(500).json({ error: 'Failed to create reservation' });
  }
});

// GET /api/reservations - List all reservations (admin)
router.get('/', (_req: Request, res: Response) => {
  try {
    const db = getDb();
    const reservations = db.prepare('SELECT * FROM reservations ORDER BY date DESC, time DESC').all();
    res.json({ reservations });
  } catch (err) {
    console.error('List error:', err);
    res.status(500).json({ error: 'Failed to fetch reservations' });
  }
});

// DELETE /api/reservations/:id - Cancel a reservation
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const db = getDb();
    const result = db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run('cancelled', req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    res.json({ message: 'Reservation cancelled' });
  } catch (err) {
    console.error('Cancel error:', err);
    res.status(500).json({ error: 'Failed to cancel reservation' });
  }
});

export default router;
