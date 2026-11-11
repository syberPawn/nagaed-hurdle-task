import 'dotenv/config';
import express from 'express';
import { verifyDatabaseConnection } from './db.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// Parse JSON request bodies into req.body.
app.use(express.json());

// Lightweight liveness check.
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// These must come after all routes: notFound catches anything unmatched,
// errorHandler catches anything thrown.
app.use(notFound);
app.use(errorHandler);

async function start() {
  try {
    await verifyDatabaseConnection();
    console.log('Connected to MySQL');
  } catch (err) {
    console.error('Could not connect to MySQL:', err.message);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`user-api listening on http://localhost:${PORT}`);
  });
}

start();
