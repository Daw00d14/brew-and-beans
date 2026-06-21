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
  await sql`
    CREATE TABLE IF NOT EXISTS menu_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
      category TEXT NOT NULL CHECK(category IN ('Espresso', 'Pour Over', 'Cold Brew', 'Signature', 'Pastries')),
      image TEXT NOT NULL DEFAULT '',
      in_stock INTEGER NOT NULL DEFAULT 1,
      featured INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
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

// Menu items CRUD

export async function getMenuItems() {
  const sql = getSql();
  return sql`SELECT * FROM menu_items ORDER BY sort_order ASC, name ASC`;
}

export async function getMenuItemById(id: string) {
  const sql = getSql();
  const rows = await sql`SELECT * FROM menu_items WHERE id = ${id}`;
  return rows.length > 0 ? rows[0] : null;
}

export async function createMenuItem(id: string, name: string, description: string, price: string, category: string, image: string, featured: boolean, sortOrder?: number) {
  const sql = getSql();
  if (sortOrder !== undefined) {
    return sql`
      INSERT INTO menu_items (id, name, description, price, category, image, featured, sort_order)
      VALUES (${id}, ${name}, ${description}, ${price}, ${category}, ${image}, ${featured ? 1 : 0}, ${sortOrder})
    `;
  }
  return sql`
    INSERT INTO menu_items (id, name, description, price, category, image, featured)
    VALUES (${id}, ${name}, ${description}, ${price}, ${category}, ${image}, ${featured ? 1 : 0})
  `;
}

export async function updateMenuItem(id: string, name: string, description: string, price: string, category: string, image: string, featured: boolean) {
  const sql = getSql();
  return sql`
    UPDATE menu_items SET name = ${name}, description = ${description}, price = ${price}, category = ${category}, image = ${image}, featured = ${featured ? 1 : 0}
    WHERE id = ${id}
  `;
}

export async function toggleMenuItemStock(id: string) {
  const sql = getSql();
  return sql`
    UPDATE menu_items SET in_stock = CASE WHEN in_stock = 1 THEN 0 ELSE 1 END WHERE id = ${id}
  `;
}

export async function deleteMenuItem(id: string) {
  const sql = getSql();
  return sql`DELETE FROM menu_items WHERE id = ${id}`;
}
