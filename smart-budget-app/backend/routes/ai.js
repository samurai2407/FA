// routes/ai.js
import { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { protect } from '../middleware/auth.js';
import Transaction from '../models/Transaction.js';
import Category    from '../models/Category.js';
import User        from '../models/User.js';

const router = Router();
router.use(protect);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// POST /api/ai/chat
// Body: { message: string, history: [{ role, text }] }
router.post('/chat', async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ message: 'message is required' });
    }

    // ── Gather user's real financial context ──────────────────────────────
    const now          = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    const [user, categories, spending] = await Promise.all([
      User.findById(req.user._id).lean(),
      Category.find({ user: req.user._id }).lean(),
      Transaction.aggregate([
        { $match: { user: req.user._id, date: { $gte: startOfMonth, $lte: endOfMonth } } },
        { $group: { _id: '$category', total: { $sum: '$amount' } } },
      ]),
    ]);

    const spendingMap = Object.fromEntries(spending.map((s) => [s._id, s.total]));
    const totalSpent  = spending.reduce((sum, s) => sum + s.total, 0);
    const remaining   = (user.monthlyBudget || 0) - totalSpent;

    const categoryLines = categories.map((cat) => {
      const spent = spendingMap[cat.name] || 0;
      const limit = cat.limit || 0;
      const pct   = limit ? Math.round((spent / limit) * 100) : null;
      return `  - ${cat.name}: spent ${user.currency} ${spent.toFixed(2)}${limit ? ` / limit ${user.currency} ${limit.toFixed(2)} (${pct}%)` : ' (no limit set)'}`;
    }).join('\n');

    const systemPrompt = `You are a smart, friendly personal finance assistant inside the SmartBudget app.
The user's name is ${user.name}. Their currency is ${user.currency}.

Current month financial snapshot:
- Monthly budget: ${user.currency} ${(user.monthlyBudget || 0).toFixed(2)}
- Total spent this month: ${user.currency} ${totalSpent.toFixed(2)}
- Remaining: ${user.currency} ${remaining.toFixed(2)}
- Budget used: ${user.monthlyBudget ? Math.round((totalSpent / user.monthlyBudget) * 100) : 0}%

Category breakdown this month:
${categoryLines || '  (no transactions yet)'}

Guidelines:
- Be concise, warm, and practical. Use bullet points when listing things.
- Reference the user's actual numbers above when answering — don't make up values.
- Give actionable advice, not just observations.
- Keep replies under 120 words unless the user asks for detail.`;

    // ── Build Gemini conversation history ────────────────────────────────
    const geminiHistory = history.map((msg) => ({
      role:  msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }],
    }));

    const model = genAI.getGenerativeModel({
      model: 'gemini-flash-latest',
      systemInstruction: { parts: [{ text: systemPrompt }] },
    });
    const chat = model.startChat({ history: geminiHistory });

    const result = await chat.sendMessage(message);
    const reply  = result.response.text();

    res.json({ reply });
  } catch (err) {
    next(err);
  }
});

export default router;
