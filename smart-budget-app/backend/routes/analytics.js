// routes/analytics.js
import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.use(protect);

// GET /api/analytics/monthly
// Returns spending totals for the last 6 months
router.get('/monthly', async (req, res, next) => {
  try {
    const now   = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1); // 6 months back

    const result = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start },
        },
      },
      {
        $group: {
          _id:   { year: { $year: '$date' }, month: { $month: '$date' } },
          spent: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    // Build all 6 months including zeros for months with no data
    const trend = [];
    for (let i = 5; i >= 0; i--) {
      const d     = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year  = d.getFullYear();
      const month = d.getMonth() + 1; // 1-based
      const found = result.find((r) => r._id.year === year && r._id.month === month);
      trend.push({ month: MONTHS[month - 1], year, spent: found?.spent || 0 });
    }

    res.json(trend);
  } catch (err) {
    next(err);
  }
});

// GET /api/analytics/categories
// Returns per-category spending + limit for current month
router.get('/categories', async (req, res, next) => {
  try {
    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const result = await Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id:   '$category',
          spent: { $sum: '$amount' },
        },
      },
      { $sort: { spent: -1 } },
    ]);

    res.json(result.map((r) => ({ name: r._id, spent: r.spent })));
  } catch (err) {
    next(err);
  }
});

export default router;
