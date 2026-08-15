// server.js
import express    from 'express';
import cors       from 'cors';
import dotenv     from 'dotenv';
import mongoose   from 'mongoose';

import authRoutes         from './routes/auth.js';
import transactionRoutes  from './routes/transactions.js';
import budgetRoutes       from './routes/budget.js';
import analyticsRoutes    from './routes/analytics.js';
import profileRoutes      from './routes/profile.js';
import aiRoutes           from './routes/ai.js';
import errorHandler       from './middleware/errorHandler.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL            // set this in production .env
    : 'http://localhost:5173',          // Vite dev server
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

// 404 handler for unknown routes
app.use((_req, res) => res.status(404).json({ message: 'Route not found' }));

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

// ─── Database + Server ───────────────────────────────────────────────────────
async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

start();
