import type { VercelRequest, VercelResponse } from '@vercel/node';
import { v4 as uuid } from 'uuid';
import { getMenuItems, getMenuItemById, createMenuItem, updateMenuItem, toggleMenuItemStock, deleteMenuItem, initializeDatabase } from './lib/db.js';

let dbInitPromise: Promise<void> | null = null;

async function ensureDb() {
  if (!dbInitPromise) {
    dbInitPromise = initializeDatabase().catch((err) => {
      dbInitPromise = null;
      throw err;
    });
  }
  return dbInitPromise;
}

const DEFAULT_ITEMS = [
  { name: 'House Espresso', description: 'Our signature single-origin espresso blend — rich crema, notes of dark chocolate and toasted hazelnut, pulled to perfection.', price: '$4.50', category: 'Espresso', image: 'https://images.pexels.com/photos/12975714/pexels-photo-12975714.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', featured: true, sort: 1 },
  { name: 'Smoked Caramel Latte', description: 'Velvety steamed milk meets double espresso and house-made smoked caramel syrup, finished with a whisper of sea salt.', price: '$5.75', category: 'Signature', image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=800&q=80', featured: true, sort: 2 },
  { name: 'Ethiopian Pour Over', description: 'Single-origin Yirgacheffe beans — delicate floral aroma with bright citrus notes and a silky, tea-like body.', price: '$6.00', category: 'Pour Over', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80', featured: true, sort: 3 },
  { name: 'Nitro Cold Brew', description: 'Slow-steeped for 20 hours, infused with nitrogen for a cascading creamy texture — bold, smooth, naturally sweet.', price: '$5.50', category: 'Cold Brew', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&q=80', featured: true, sort: 4 },
  { name: 'Lavender Honey Cortado', description: 'A delicate balance of floral lavender, wild honey, and a short double shot cut with warm silky milk.', price: '$5.25', category: 'Signature', image: 'https://images.pexels.com/photos/30556589/pexels-photo-30556589.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', sort: 5 },
  { name: 'Classic Cappuccino', description: 'Perfectly frothed milk crowning a double espresso — simple, timeless, and utterly satisfying.', price: '$4.75', category: 'Espresso', image: 'https://images.pexels.com/photos/20777769/pexels-photo-20777769.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', sort: 6 },
  { name: 'Japanese Iced Coffee', description: 'Hot-brewed single-origin coffee dripped directly over ice — capturing vibrant aromatics that cold brew cannot.', price: '$5.00', category: 'Pour Over', image: 'https://images.pexels.com/photos/31621814/pexels-photo-31621814.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=600&w=800', sort: 7 },
  { name: 'Brew & Bean Mocha', description: 'Rich single-origin espresso meets velvety Belgian chocolate sauce, topped with house-made whipped cream.', price: '$5.50', category: 'Signature', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&q=80', sort: 8 },
  { name: 'Butter Croissant', description: 'French-style laminated pastry baked fresh throughout the day — golden, flaky, indulgent.', price: '$3.75', category: 'Pastries', image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=800&q=80', sort: 9 },
  { name: 'Honey Almond Scone', description: 'Buttery scone studded with toasted almonds and finished with a honey glaze — pairs perfectly with any brew.', price: '$4.00', category: 'Pastries', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&q=80', sort: 10 },
];

async function seedIfEmpty() {
  const items = await getMenuItems();
  if (items.length === 0) {
    for (const item of DEFAULT_ITEMS) {
      await createMenuItem(uuid(), item.name, item.description, item.price, item.category, item.image, !!item.featured, item.sort);
    }
    console.log('🌱 Seeded menu items');
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await ensureDb();
  } catch {
    return res.status(500).json({ error: 'Database initialization failed' });
  }

  try {
    switch (req.method) {
      case 'GET':
        return await handleList(req, res);
      case 'POST':
        return await handleCreate(req, res);
      case 'PATCH':
        return await handlePatch(req, res);
      case 'DELETE':
        return await handleDelete(req, res);
      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (err) {
    console.error('Menu error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function handleList(_req: VercelRequest, res: VercelResponse) {
  await seedIfEmpty();
  const items = await getMenuItems();
  return res.json({ items });
}

async function handleCreate(req: VercelRequest, res: VercelResponse) {
  const { name, description, price, category, image, featured } = req.body as {
    name: string;
    description: string;
    price: string;
    category: string;
    image?: string;
    featured?: boolean;
  };

  const errors: string[] = [];
  if (!name || name.trim().length < 1) errors.push('Name is required');
  if (!description || description.trim().length < 1) errors.push('Description is required');
  if (!price) errors.push('Price is required');
  if (!['Espresso', 'Pour Over', 'Cold Brew', 'Signature', 'Pastries'].includes(category)) {
    errors.push('Invalid category');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: 'Validation failed', details: errors });
  }

  const id = uuid();
  await createMenuItem(id, name.trim(), description.trim(), price, category, image?.trim() || '', !!featured);

  return res.status(201).json({
    message: 'Menu item created',
    item: { id, name: name.trim(), description: description.trim(), price, category, image: image?.trim() || '', featured: !!featured, in_stock: true },
  });
}

async function handlePatch(req: VercelRequest, res: VercelResponse) {
  const { id, action } = req.body as { id?: string; action?: string };

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  if (action === 'toggle_stock') {
    await toggleMenuItemStock(id);
    const item = await getMenuItemById(id);
    if (!item) {
      return res.status(404).json({ error: 'Menu item not found' });
    }
    return res.json({ message: 'Stock toggled', item });
  }

  // Update fields
  const { name, description, price, category, image, featured } = req.body as {
    name?: string;
    description?: string;
    price?: string;
    category?: string;
    image?: string;
    featured?: boolean;
  };

  const existing = await getMenuItemById(id);
  if (!existing) {
    return res.status(404).json({ error: 'Menu item not found' });
  }

  await updateMenuItem(
    id,
    name?.trim() ?? existing.name,
    description?.trim() ?? existing.description,
    price ?? existing.price,
    category ?? existing.category,
    image?.trim() ?? existing.image,
    featured ?? existing.featured === 1
  );

  const updated = await getMenuItemById(id);
  return res.json({ message: 'Menu item updated', item: updated });
}

async function handleDelete(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Item ID is required' });
  }

  await deleteMenuItem(id);
  return res.json({ message: 'Menu item deleted' });
}
