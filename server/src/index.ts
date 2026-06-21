import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import reservationRouter from './routes/reservations.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:4173", "http://127.0.0.1:5173", "null", "file://"] }));
app.use(express.json());

// API routes
app.use('/api/reservations', reservationRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`☕ Brew & Bean server running at http://localhost:${PORT}`);
  console.log(`   API: http://localhost:${PORT}/api`);
});
