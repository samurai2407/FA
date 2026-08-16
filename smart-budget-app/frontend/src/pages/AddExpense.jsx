// src/pages/AddExpense.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { currencySymbol } from '../utils/currency';

const CATEGORIES = [
  { label: 'Food & Dining',    icon: '🍽️' },
  { label: 'Groceries',        icon: '🛒' },
  { label: 'Transportation',   icon: '🚗' },
  { label: 'Entertainment',    icon: '🎬' },
  { label: 'Shopping',         icon: '🛍️' },
  { label: 'Health',           icon: '💪' },
  { label: 'Bills & Utilities', icon: '🏠' },
  { label: 'Travel',           icon: '✈️' },
  { label: 'Other',            icon: '📋' },
];

const today = new Date().toISOString().split('T')[0];
const EMPTY_FORM = { amount: '', category: '', title: '', date: today, note: '' };

export default function AddExpense({ addTransaction, user }) {
  const navigate = useNavigate();
  const sym = currencySymbol(user?.currency);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [errors, setErrors]   = useState({});
  const [success, setSuccess] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: '' }));
  }

  function validate() {
    const e = {};
    if (!form.amount || parseFloat(form.amount) <= 0) e.amount   = 'Enter a valid amount';
    if (!form.category)                                e.category = 'Select a category';
    if (!form.title.trim())                            e.title    = 'Enter a title';
    if (!form.date)                                    e.date     = 'Pick a date';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const meta = CATEGORIES.find((c) => c.label === form.category);
    try {
      await addTransaction({
        title: form.title.trim(), category: form.category,
        date: form.date, amount: parseFloat(form.amount),
        note: form.note.trim(), icon: meta?.icon || '📋',
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to save expense' });
    }
  }

  const inputBase = 'w-full p-4 rounded-2xl outline-none transition-colors bg-[#1C1C1E] text-white placeholder-[#A3A3A3] text-sm font-medium';
  const inputBorder = (err) => err
    ? 'border border-red-500'
    : 'border border-white/10 focus:border-[#4B58FF]';

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center mb-8 mt-2 md:mt-0">
          <Link to="/"
            className="w-10 h-10 bg-[#151515] border border-white/10 rounded-2xl flex items-center justify-center text-[#A3A3A3] hover:bg-white/10 hover:text-white transition-colors shrink-0"
          >←</Link>
          <h2 className="text-xl font-bold ml-4 text-white tracking-tight">Add New Expense</h2>
        </div>

        {success && (
          <div className="mb-6 bg-[#75F97D]/10 border border-[#75F97D]/30 text-[#75F97D] rounded-2xl px-4 py-3 text-sm font-medium">
            ✅ Expense saved! Redirecting…
          </div>
        )}
        {errors.submit && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-4 py-3 text-sm">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-[#151515] rounded-[28px] border border-white/5 p-6 md:p-8 space-y-6">

            {/* Amount */}
            <div className="text-center flex flex-col items-center">
              <label className="text-xs text-[#A3A3A3] font-bold uppercase tracking-widest mb-3">
                Expense Amount
              </label>
              <div className={`flex justify-center items-center text-6xl font-bold text-white border-b-2 pb-1 transition-colors
                ${errors.amount ? 'border-red-500' : 'border-white/10 focus-within:border-[#4B58FF]'}`}>
                <span>{sym}</span>
                <input type="number" name="amount" value={form.amount} onChange={handleChange}
                  placeholder="0.00" min="0" step="0.01"
                  className="w-44 bg-transparent border-none outline-none text-center p-0 text-white placeholder-white/20" />
              </div>
              {errors.amount && <p className="text-red-400 text-xs mt-2">{errors.amount}</p>}
            </div>

            {/* Category grid */}
            <div>
              <label className="block text-sm font-bold mb-3 text-white">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(({ label, icon }) => (
                  <button type="button" key={label}
                    onClick={() => { setForm((p) => ({ ...p, category: label })); setErrors((p) => ({ ...p, category: '' })); }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-medium transition-all
                      ${form.category === label
                        ? 'border-[#4B58FF] bg-[#4B58FF]/20 text-[#4B58FF]'
                        : 'border-white/10 bg-[#1C1C1E] text-[#A3A3A3] hover:border-white/20 hover:text-white'}`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-400 text-xs mt-2">{errors.category}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-2 text-white">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                placeholder="e.g., Lunch at cafe"
                className={`${inputBase} ${inputBorder(errors.title)}`} />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-bold mb-2 text-white">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange}
                className={`${inputBase} ${inputBorder(errors.date)}`} />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-bold mb-2 text-white">
                Note <span className="font-normal text-[#A3A3A3]">(optional)</span>
              </label>
              <textarea name="note" value={form.note} onChange={handleChange}
                placeholder="Any additional details..."
                className={`${inputBase} ${inputBorder(null)} h-24 resize-none`} />
            </div>

            <button type="submit" disabled={success}
              className="w-full bg-[#4B58FF] hover:bg-[#3a46e0] disabled:opacity-50 text-white py-4 rounded-2xl font-bold shadow-lg shadow-[#4B58FF]/20 transition-colors">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
