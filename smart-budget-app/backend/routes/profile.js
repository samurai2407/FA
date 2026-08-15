// routes/profile.js
import { Router } from 'express';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

// GET /api/profile
router.get('/', (req, res) => {
  // req.user is already attached by the protect middleware
  res.json({
    _id:           req.user._id,
    name:          req.user.name,
    email:         req.user.email,
    currency:      req.user.currency,
    monthlyBudget: req.user.monthlyBudget,
    avatar:        req.user.avatar,
  });
});

// PUT /api/profile
router.put('/', async (req, res, next) => {
  try {
    const { name, email, currency, monthlyBudget, password } = req.body;

    // Check if new email is already taken by another user
    if (email && email !== req.user.email) {
      const taken = await User.findOne({ email });
      if (taken) return res.status(409).json({ message: 'Email already in use' });
    }

    // Collect field updates (avoid mass-assignment of protected fields)
    const updates = {};
    if (name          !== undefined) updates.name          = name;
    if (email         !== undefined) updates.email         = email;
    if (currency      !== undefined) updates.currency      = currency;
    if (monthlyBudget !== undefined) updates.monthlyBudget = Number(monthlyBudget);

    // Password change: load with password field, update, and save
    // (We use save() so the pre-save hook re-hashes)
    if (password) {
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }
      const user = await User.findById(req.user._id).select('+password');
      Object.assign(user, updates);
      user.password = password;
      await user.save();
      return res.json(sanitize(user));
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
    res.json(sanitize(user));
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
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
