// models/Category.js
import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    user:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name:  { type: String, required: true, trim: true },
    limit: { type: Number, default: 0, min: 0 },
    color: { type: String, default: '#6b7280' },
    icon:  { type: String, default: '📋' },
  },
  { timestamps: true }
);

// One category name per user
categorySchema.index({ user: 1, name: 1 }, { unique: true });

export default mongoose.model('Category', categorySchema);
