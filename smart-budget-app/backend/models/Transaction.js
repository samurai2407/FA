// models/Transaction.js
import mongoose from 'mongoose';

const CATEGORIES = [
  'Food & Dining', 'Groceries', 'Transportation', 'Entertainment',
  'Shopping', 'Health', 'Bills & Utilities', 'Travel', 'Other',
];

const transactionSchema = new mongoose.Schema(
  {
    user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title:    { type: String, required: true, trim: true },
    amount:   { type: Number, required: true, min: 0 },
    category: { type: String, required: true, enum: CATEGORIES },
    date:     { type: Date, required: true },
    note:     { type: String, default: '', trim: true },
    icon:     { type: String, default: '📋' },
  },
  { timestamps: true }
);

// Index for common query patterns
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });

export default mongoose.model('Transaction', transactionSchema);
