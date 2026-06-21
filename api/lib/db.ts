import { neon } from '@neondatabase/serverless';

let _sql: ReturnType<typeof neon> | null = null;

function getSql() {
  if (_sql) return _sql;
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  _sql = neon(url);
  return _sql;
}

export async function initSchema(): Promise<void> {
  const sql = getSql();
  await sql`
    CREATE TABLE IF NOT EXISTS reservations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      guests INTEGER NOT NULL CHECK(guests >= 1 AND guests <= 20),
      requests TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('confirmed', 'cancelled', 'completed')),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `;
}

export async function getReservations() {
  const sql = getSql();
  return sql`SELECT * FROM reservations ORDER BY date DESC, time DESC`;
}

export async function createReservation(id: string, name: string, email: string, phone: string, date: string, time: string, guests: number, requests: string) {
  const sql = getSql();
  return sql`
    INSERT INTO reservations (id, name, email, phone, date, time, guests, requests)
    VALUES (${id}, ${name}, ${email}, ${phone}, ${date}, ${time}, ${guests}, ${requests})
  `;
}

export async function cancelReservation(id: string) {
  const sql = getSql();
  const result = await sql`
    UPDATE reservations SET status = 'cancelled' WHERE id = ${id}
  `;
  return result;
}

export async function initializeDatabase(): Promise<void> {
  try {
    await initSchema();
    console.log('✅ Database schema initialized');
  } catch (err) {
    console.error('❌ Failed to initialize database schema:', err);
    throw err;
  }
}
