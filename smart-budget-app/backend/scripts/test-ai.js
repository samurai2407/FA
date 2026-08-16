import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Transaction from '../models/Transaction.js';

await mongoose.connect(process.env.MONGO_URI);
console.log('✅ DB connected');

const user = await User.findOne().lean();
if (!user) { console.log('No users'); process.exit(0); }
console.log('User:', user.name, '| currency:', user.currency, '| budget:', user.monthlyBudget);

const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

const categories = await Category.find({ user: user._id }).lean();
const spending   = await Transaction.aggregate([
  { $match: { user: user._id, date: { $gte: startOfMonth, $lte: endOfMonth } } },
  { $group: { _id: '$category', total: { $sum: '$amount' } } },
]);

const totalSpent = spending.reduce((s, x) => s + x.total, 0);
const remaining  = (user.monthlyBudget || 0) - totalSpent;
console.log('Total spent:', totalSpent, '| Remaining:', remaining);
console.log('Categories:', categories.length, '| Spending entries:', spending.length);

const spendingMap = Object.fromEntries(spending.map(s => [s._id, s.total]));
const categoryLines = categories.map(cat => {
  const spent = spendingMap[cat.name] || 0;
  const limit = cat.limit || 0;
  const pct   = limit ? Math.round((spent / limit) * 100) : null;
  return `  - ${cat.name}: spent ${user.currency} ${spent.toFixed(2)}${limit ? ` / limit ${user.currency} ${limit.toFixed(2)} (${pct}%)` : ' (no limit set)'}`;
}).join('\n');

const systemPrompt = `You are a smart budget assistant for ${user.name}. Monthly budget: ${user.currency} ${(user.monthlyBudget||0).toFixed(2)}. Spent: ${user.currency} ${totalSpent.toFixed(2)}. Remaining: ${user.currency} ${remaining.toFixed(2)}.\nCategories:\n${categoryLines}`;
console.log('\nSystem prompt:\n', systemPrompt, '\n');

try {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model  = genAI.getGenerativeModel({
    model: 'gemini-flash-latest',
    systemInstruction: { parts: [{ text: systemPrompt }] },
  });
  const chat   = model.startChat({ history: [] });
  const result = await chat.sendMessage('Am I on track this month?');
  console.log('✅ REPLY:', result.response.text().slice(0, 300));
} catch (err) {
  console.error('❌ Gemini error:', err.message);
  if (err.errorDetails) console.error('Details:', JSON.stringify(err.errorDetails, null, 2));
}

await mongoose.disconnect();
