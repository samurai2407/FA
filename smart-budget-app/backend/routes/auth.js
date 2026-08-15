// routes/auth.js
import { Router } from 'express';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { signToken, protect } from '../middleware/auth.js';

const router = Router();

const DEFAULT_CATEGORIES = [
  { name: 'Food & Dining',    color: '#00d09c', icon: '🍽️', limit: 1000 },
  { name: 'Groceries',        color: '#eab308', icon: '🛒',  limit: 500  },
  { name: 'Transportation',   color: '#3b82f6', icon: '🚗',  limit: 500  },
  { name: 'Entertainment',    color: '#a855f7', icon: '🎬',  limit: 600  },
  { name: 'Shopping',         color: '#f97316', icon: '🛍️', limit: 800  },
  { name: 'Health',           color: '#ec4899', icon: '💪',  limit: 300  },
  { name: 'Bills & Utilities', color: '#64748b', icon: '🏠',  limit: 500  },
  { name: 'Travel',           color: '#06b6d4', icon: '✈️', limit: 1000 },
  { name: 'Other',            color: '#9ca3af', icon: '📋',  limit: 0   },
];

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password, monthlyBudget, currency } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const user = await User.create({ name, email, password, monthlyBudget, currency });

    // Seed default categories for new user
    await Category.insertMany(
      DEFAULT_CATEGORIES.map((c) => ({ ...c, user: user._id }))
    );

    const token = signToken(user._id);
    res.status(201).json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Explicitly select password (it's excluded by default in the schema)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken(user._id);
    res.json({ token, user: sanitize(user) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/logout  (stateless JWT — client just discards the token)
router.post('/logout', protect, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

function sanitize(user) {
  return {
    _id:           user._id,
    name:          user.name,
    email:         user.email,
    currency:      user.currency,
    monthlyBudget: user.monthlyBudget,
    avatar:        user.avatar,
  };
}

export default router;
