// routes/budget.js
import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import Category    from '../models/Category.js';
import User        from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

// GET /api/budget/summary
// Returns monthly budget, total spent this month, and remaining
router.get('/summary', async (req, res, next) => {
  try {
    const now        = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, totalSpent: { $sum: '$amount' } } },
    ]);

    const totalSpent   = result[0]?.totalSpent || 0;
    const remaining    = req.user.monthlyBudget - totalSpent;

    res.json({
      name:          req.user.name,
      email:         req.user.email,
      currency:      req.user.currency,
      monthlyBudget: req.user.monthlyBudget,
      totalSpent,
      remaining,
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/budget/categories
// Returns categories with their spending this month
router.get('/categories', async (req, res, next) => {
  try {
    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // Aggregate spending per category this month
    const spending = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);

    const spendingMap = Object.fromEntries(spending.map((s) => [s._id, s.spent]));

    const categories = await Category.find({ user: req.user._id });
    const result = categories.map((cat) => ({
      name:  cat.name,
      limit: cat.limit,
      color: cat.color,
      icon:  cat.icon,
      spent: spendingMap[cat.name] || 0,
    }));

    res.json(result);
  } catch (err) {
    next(err);
  }
});

// PUT /api/budget
// Update monthly budget amount and/or currency
router.put('/', async (req, res, next) => {
  try {
    const { monthlyBudget, currency } = req.body;

    if (monthlyBudget !== undefined && monthlyBudget < 0) {
      return res.status(400).json({ message: 'Budget must be a positive number' });
    }

    const updates = {};
    if (monthlyBudget !== undefined) updates.monthlyBudget = monthlyBudget;
    if (currency      !== undefined) updates.currency      = currency;

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ monthlyBudget: user.monthlyBudget, currency: user.currency });
  } catch (err) {
    next(err);
  }
});

// PUT /api/budget/categories
// Bulk-update the limit for one or more categories
// Body: { categories: [{ name, limit }, ...] }
router.put('/categories', async (req, res, next) => {
  try {
    const { categories } = req.body;

    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: 'categories array is required' });
    }

    // Run updates in parallel — one per category name
    await Promise.all(
      categories.map(({ name, limit }) =>
        Category.findOneAndUpdate(
          { user: req.user._id, name },
          { limit: Math.max(0, Number(limit) || 0) },
          { new: true }
        )
      )
    );

    // Return the fresh full list (same shape as GET /categories)
    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const spending = await Transaction.aggregate([
      { $match: { user: req.user._id, date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: '$category', spent: { $sum: '$amount' } } },
    ]);
    const spendingMap = Object.fromEntries(spending.map((s) => [s._id, s.spent]));

    const updated = await Category.find({ user: req.user._id });
    res.json(
      updated.map((cat) => ({
        name:  cat.name,
        limit: cat.limit,
        color: cat.color,
        icon:  cat.icon,
        spent: spendingMap[cat.name] || 0,
      }))
    );
  } catch (err) {
    next(err);
  }
});

export default router;
