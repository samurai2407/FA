// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth }  from '../context/AuthContext';
import { currencySymbol } from '../utils/currency';

function Section({ title, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-50 dark:border-gray-800">
        <h3 className="font-bold text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-800">{children}</div>
    </div>
  );
}

function Row({ icon, label, value, onClick, destructive }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 transition-colors text-left
        hover:bg-gray-50 dark:hover:bg-gray-800
        ${destructive ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-gray-400 dark:text-gray-500">{value}</span>}
        {!destructive && <span className="text-gray-300 dark:text-gray-600 text-xs">›</span>}
      </div>
    </button>
  );
}

export default function Profile({ user, categories = [], updateUser, updateCategoryLimits }) {
  const { dark, toggle } = useTheme();
  const { logout, updateStoredUser } = useAuth();
  const sym = currencySymbol(user?.currency);

  // ── Profile form state ───────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:          user?.name          || '',
    email:         user?.email         || '',
    monthlyBudget: user?.monthlyBudget || 4000,
    currency:      user?.currency      || 'USD',
  });
  const [saved,     setSaved]     = useState(false);
  const [saveError, setSaveError] = useState('');

  // ── Category limits state ────────────────────────────────────────────────
  // Local editable copy; keyed by category name
  const [catLimits, setCatLimits] = useState({});

  // Sync catLimits whenever categories prop changes (e.g. after fetch)
  useEffect(() => {
    const map = {};
    categories.forEach((c) => { map[c.name] = c.limit ?? 0; });
    setCatLimits(map);
  }, [categories]);

  // Also re-sync form when user prop changes (e.g. after profile update)
  useEffect(() => {
    if (user) {
      setForm({
        name:          user.name          || '',
        email:         user.email         || '',
        monthlyBudget: user.monthlyBudget || 4000,
        currency:      user.currency      || 'USD',
      });
    }
  }, [user]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function handleCatLimitChange(name, value) {
    setCatLimits((p) => ({ ...p, [name]: value }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveError('');
    try {
      // Save profile fields
      const updated = await updateUser({ ...form, monthlyBudget: parseFloat(form.monthlyBudget) });
      updateStoredUser(updated);

      // Save category limits
      const payload = categories.map((c) => ({
        name:  c.name,
        limit: parseFloat(catLimits[c.name]) || 0,
      }));
      await updateCategoryLimits(payload);

      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setSaveError(err.message || 'Failed to save');
    }
  }

  function handleOpenEdit() {
    // Re-sync form + catLimits from latest props before opening
    setForm({
      name:          user?.name          || '',
      email:         user?.email         || '',
      monthlyBudget: user?.monthlyBudget || 4000,
      currency:      user?.currency      || 'USD',
    });
    const map = {};
    categories.forEach((c) => { map[c.name] = c.limit ?? 0; });
    setCatLimits(map);
    setSaveError('');
    setEditing(true);
  }

  const inputCls = 'w-full p-3 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl outline-none focus:border-[#00d09c] transition-colors placeholder-gray-400 dark:placeholder-gray-500 text-sm';

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">

      <div className="mb-6 md:mb-8 mt-4 md:mt-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Profile</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Avatar card */}
      <div className="bg-[#1a202c] dark:bg-gray-900 dark:border dark:border-gray-800 text-white rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-[#00d09c] rounded-full flex items-center justify-center text-2xl font-bold shrink-0">
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div>
          <h3 className="text-lg font-bold">{user?.name}</h3>
          <p className="text-gray-400 text-sm">{user?.email}</p>
        </div>
        <button onClick={handleOpenEdit}
          className="ml-auto text-xs bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors">
          Edit
        </button>
      </div>

      {saved && (
        <div className="mb-4 bg-[#00d09c]/10 border border-[#00d09c]/30 text-[#00874f] dark:text-[#00d09c] rounded-xl px-4 py-3 text-sm font-medium">
          ✅ Settings saved
        </div>
      )}

      {/* ── Edit modal ───────────────────────────────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-lg my-4 border border-transparent dark:border-gray-800">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Budget Settings</h3>
              <button onClick={() => setEditing(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="px-6 pt-5 pb-4 space-y-5 max-h-[70vh] overflow-y-auto">

                {saveError && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl px-4 py-3 text-sm">
                    {saveError}
                  </div>
                )}

                {/* ── Profile fields ──────────────────────────────────────── */}
                <div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Account</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Full Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Budget</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Monthly Budget</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{sym}</span>
                        <input name="monthlyBudget" type="number" min="0" value={form.monthlyBudget}
                          onChange={handleChange}
                          className={`${inputCls} pl-7`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-gray-900 dark:text-white">Currency</label>
                      <select name="currency" value={form.currency} onChange={handleChange} className={inputCls}>
                        <option value="USD">USD ($)</option>
                        <option value="EUR">EUR (€)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="CAD">CAD (CA$)</option>
                        <option value="AUD">AUD (A$)</option>
                        <option value="INR">INR (₹)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* ── Category limits ─────────────────────────────────────── */}
                {categories.length > 0 && (
                  <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                      Category Budgets
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">
                      Set {sym}0 to remove the limit for a category.
                    </p>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <div key={cat.name} className="flex items-center gap-3">
                          {/* Color dot + icon + name */}
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                          <span className="text-sm text-gray-700 dark:text-gray-300 w-36 shrink-0 truncate">
                            {cat.icon} {cat.name}
                          </span>
                          {/* Limit input */}
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{sym}</span>
                            <input
                              type="number" min="0"
                              value={catLimits[cat.name] ?? cat.limit ?? 0}
                              onChange={(e) => handleCatLimitChange(cat.name, e.target.value)}
                              className={`${inputCls} pl-7 py-2`}
                            />
                          </div>
                          {/* Spent badge */}
                          <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0 w-20 text-right">
                            spent {sym}{cat.spent?.toLocaleString() ?? 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal footer */}
              <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-xl bg-[#1a202c] dark:bg-[#00d09c] text-white dark:text-gray-900 text-sm font-bold hover:bg-[#2d3748] dark:hover:bg-[#00b386] transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">

        <Section title="Account">
          <Row icon="🔔" label="Notifications" value="On"  onClick={() => {}} />
          <Row icon="🔒" label="Change Password"            onClick={() => {}} />
        </Section>

        <Section title="Appearance">
          <button type="button" onClick={toggle}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left text-gray-900 dark:text-white">
            <div className="flex items-center gap-3">
              <span className="text-lg">{dark ? '☀️' : '🌙'}</span>
              <span className="text-sm font-medium">{dark ? 'Light Mode' : 'Dark Mode'}</span>
            </div>
            <div className={`w-10 h-6 rounded-full transition-colors relative ${dark ? 'bg-[#00d09c]' : 'bg-gray-200 dark:bg-gray-700'}`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${dark ? 'left-5' : 'left-1'}`} />
            </div>
          </button>
        </Section>

        <Section title="Budget Settings">
          <Row icon="💰" label="Budget & Currency"
            value={`${sym}${user?.monthlyBudget?.toLocaleString()} · ${user?.currency}`}
            onClick={handleOpenEdit} />
        </Section>

        <Section title="Data">
          <Row icon="📤" label="Export as CSV" onClick={() => {}} />
          <Row icon="🔄" label="Sync & Backup" onClick={() => {}} />
        </Section>

        <Section title="Danger Zone">
          <Row icon="🚪" label="Sign Out"       onClick={logout}      destructive />
          <Row icon="🗑️" label="Delete Account" onClick={() => {}} destructive />
        </Section>

      </div>

      <p className="text-center text-xs text-gray-300 dark:text-gray-700 mt-8">SmartBudget v1.0.0</p>
    </div>
  );
}
