// server.js
import './env.js';           // must be first — loads .env before any other import reads process.env
import express   from 'express';
import cors      from 'cors';
import mongoose  from 'mongoose';

import authRoutes        from './routes/auth.js';
import transactionRoutes from './routes/transactions.js';
import budgetRoutes      from './routes/budget.js';
import analyticsRoutes   from './routes/analytics.js';
import profileRoutes     from './routes/profile.js';
import aiRoutes          from './routes/ai.js';
import errorHandler      from './middleware/errorHandler.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
// Validate CLIENT_URL looks like an actual URL, not a project ID
const rawClientUrl = process.env.CLIENT_URL;
const validClientUrl = rawClientUrl?.startsWith('http') ? rawClientUrl : null;
if (rawClientUrl && !validClientUrl) {
  console.warn(`⚠️  CLIENT_URL "${rawClientUrl}" is not a valid URL — ignoring it. Set it to your Vercel app URL.`);
}

const ALLOWED_ORIGINS = [
  'http://localhost:5173',                // Vite dev
  'http://localhost:4173',                // Vite preview
  validClientUrl,                         // e.g. https://your-app.vercel.app
].filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Render health checks, etc.)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (_req, res) => res.json({ message: 'SmartBudget API is running' }));

app.use('/api/auth',         authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budget',       budgetRoutes);
app.use('/api/analytics',    analyticsRoutes);
app.use('/api/profile',      profileRoutes);
app.use('/api/ai',           aiRoutes);

app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));
app.use(errorHandler);

// ─── Database + Server ───────────────────────────────────────────────────────
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} already in use. Kill the process or change PORT in .env`);
        process.exit(1);
      } else {
        throw err;
      }
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
