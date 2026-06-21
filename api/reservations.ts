import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuid } from 'uuid';
import { getReservations, createReservation, cancelReservation, initializeDatabase } from './lib/db.js';
import { sendConfirmationEmail } from './email.js';

interface ReservationBody {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  requests?: string;
}

// Initialize database at cold start (runs once, not on every request)
let dbInitPromise: Promise<void> | null = null;

async function ensureDb() {
  if (!dbInitPromise) {
    dbInitPromise = initializeDatabase().catch((err) => {
      dbInitPromise = null; // Reset so we retry on cold start
      throw err;
    });
  }
  return dbInitPromise;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Ensure database schema exists (lazy init at cold start)
  try {
    await ensureDb();
  } catch {
    return res.status(500).json({ error: 'Database initialization failed' });
  }

  try {
    switch (req.method) {
      case 'POST':
        return await handleCreate(req, res);
      case 'GET':
        return await handleList(req, res);
      case 'DELETE':
        return await handleCancel(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Reservation error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleCreate(req: VercelRequest, res: VercelResponse) {
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

  const id = uuid();

  await createReservation(
    id,
    name.trim(),
    email.trim().toLowerCase(),
    phone.trim(),
    date,
    time,
    guests,
    requests?.trim() || ''
  );

  // Send confirmation email (non-blocking)
  sendConfirmationEmail({ id, name, email, date, time, guests, requests }).catch(() => {});

  return res.status(201).json({
    message: 'Reservation confirmed!',
    reservation: { id, name, email, date, time, guests, status: 'confirmed' },
  });
}

async function handleList(_req: VercelRequest, res: VercelResponse) {
  const reservations = await getReservations();
  return res.json({ reservations });
}

async function handleCancel(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Reservation ID is required' });
  }

  const result = await cancelReservation(id);

  // Postgres.js returns { count: number } for UPDATE queries
  const rowCount = result && typeof result === 'object' && 'count' in result ? Number(result.count) : 0;
  if (rowCount === 0) {
    return res.status(404).json({ error: 'Reservation not found' });
  }

  return res.json({ message: 'Reservation cancelled' });
}
