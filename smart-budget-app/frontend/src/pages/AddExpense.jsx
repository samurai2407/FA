// src/pages/AddExpense.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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

export default function AddExpense({ addTransaction }) {
  const navigate = useNavigate();
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

  function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    const meta = CATEGORIES.find((c) => c.label === form.category);
    addTransaction({
      title: form.title.trim(), category: form.category,
      date: form.date, amount: parseFloat(form.amount),
      note: form.note.trim(), icon: meta?.icon || '📋',
    });
    setSuccess(true);
    setTimeout(() => navigate('/'), 1000);
  }

  const inputBase = 'w-full p-4 rounded-xl outline-none transition-colors bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500';
  const inputBorder = (err) => err
    ? 'border border-red-400'
    : 'border border-gray-100 dark:border-gray-700 focus:border-[#00d09c] dark:focus:border-[#00d09c]';

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="flex items-center mb-8 mt-4 md:mt-0">
          <Link to="/"
            className="w-10 h-10 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shadow-sm shrink-0"
          >←</Link>
          <h2 className="text-xl font-bold ml-4 text-gray-900 dark:text-white">Add New Expense</h2>
        </div>

        {success && (
          <div className="mb-6 bg-[#00d09c]/10 border border-[#00d09c]/30 text-[#00874f] dark:text-[#00d09c] rounded-xl px-4 py-3 text-sm font-medium">
            ✅ Expense saved! Redirecting…
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8 space-y-6">

            {/* Amount */}
            <div className="text-center flex flex-col items-center">
              <label className="text-xs text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-3">
                Expense Amount
              </label>
              <div className={`flex justify-center items-center text-6xl font-bold text-gray-900 dark:text-white border-b-2 pb-1 transition-colors
                ${errors.amount ? 'border-red-400' : 'border-gray-200 dark:border-gray-700 focus-within:border-[#00d09c]'}`}>
                <span>$</span>
                <input type="number" name="amount" value={form.amount} onChange={handleChange}
                  placeholder="0.00" min="0" step="0.01"
                  className="w-44 bg-transparent border-none outline-none text-center p-0 text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600" />
              </div>
              {errors.amount && <p className="text-red-500 text-xs mt-2">{errors.amount}</p>}
            </div>

            {/* Category grid */}
            <div>
              <label className="block text-sm font-bold mb-3 text-gray-900 dark:text-white">Category</label>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map(({ label, icon }) => (
                  <button type="button" key={label}
                    onClick={() => { setForm((p) => ({ ...p, category: label })); setErrors((p) => ({ ...p, category: '' })); }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border text-xs font-medium transition-all
                      ${form.category === label
                        ? 'border-[#00d09c] bg-[#00d09c]/10 text-[#00874f] dark:text-[#00d09c]'
                        : 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'}`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span className="leading-tight text-center">{label}</span>
                  </button>
                ))}
              </div>
              {errors.category && <p className="text-red-500 text-xs mt-2">{errors.category}</p>}
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Title</label>
              <input type="text" name="title" value={form.title} onChange={handleChange}
                placeholder="e.g., Lunch at cafe"
                className={`${inputBase} ${inputBorder(errors.title)}`} />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">Date</label>
              <input type="date" name="date" value={form.date} onChange={handleChange}
                className={`${inputBase} ${inputBorder(errors.date)}`} />
              {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
            </div>

            {/* Note */}
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-900 dark:text-white">
                Note <span className="font-normal text-gray-400 dark:text-gray-500">(optional)</span>
              </label>
              <textarea name="note" value={form.note} onChange={handleChange}
                placeholder="Any additional details..."
                className={`${inputBase} ${inputBorder(null)} h-24 resize-none`} />
            </div>

            <button type="submit" disabled={success}
              className="w-full bg-[#1a202c] dark:bg-[#00d09c] hover:bg-[#2d3748] dark:hover:bg-[#00b386] disabled:opacity-60 text-white py-4 rounded-xl font-bold shadow-md transition-colors">
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
