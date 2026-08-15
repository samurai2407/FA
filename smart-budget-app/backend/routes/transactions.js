// routes/transactions.js
import { Router } from 'express';
import Transaction from '../models/Transaction.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(protect);

// GET /api/transactions
// Query params: category, startDate, endDate, page (default 1), limit (default 50)
router.get('/', async (req, res, next) => {
  try {
    const { category, startDate, endDate, page = 1, limit = 50 } = req.query;

    const filter = { user: req.user._id };
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate)   filter.date.$lte = new Date(endDate);
    }

    const skip  = (Number(page) - 1) * Number(limit);
    const total = await Transaction.countDocuments(filter);
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
});

// POST /api/transactions
router.post('/', async (req, res, next) => {
  try {
    const { title, amount, category, date, note, icon } = req.body;

    if (!title || amount == null || !category || !date) {
      return res.status(400).json({ message: 'title, amount, category and date are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title, amount, category,
      date: new Date(date),
      note: note || '',
      icon: icon || '📋',
    });

    res.status(201).json(transaction);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
});

// PUT /api/transactions/:id
router.put('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,   // ensure ownership
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const { title, amount, category, date, note, icon } = req.body;
    if (title    !== undefined) transaction.title    = title;
    if (amount   !== undefined) transaction.amount   = amount;
    if (category !== undefined) transaction.category = category;
    if (date     !== undefined) transaction.date     = new Date(date);
    if (note     !== undefined) transaction.note     = note;
    if (icon     !== undefined) transaction.icon     = icon;

    await transaction.save();
    res.json(transaction);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message });
    }
    next(err);
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
