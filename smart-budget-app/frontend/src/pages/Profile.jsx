// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth }  from '../context/AuthContext';
import { currencySymbol, CURRENCIES } from '../utils/currency';

function Section({ title, children }) {
  return (
    <div className="bg-[#151515] rounded-[20px] border border-white/5 overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5">
        <h3 className="font-bold text-xs text-[#A3A3A3] uppercase tracking-widest">{title}</h3>
      </div>
      <div className="divide-y divide-white/5">{children}</div>
    </div>
  );
}

function Row({ icon, label, value, onClick, destructive }) {
  return (
    <button type="button" onClick={onClick}
      className={`w-full flex items-center justify-between px-6 py-4 transition-colors text-left
        hover:bg-white/5
        ${destructive ? 'text-red-400' : 'text-white'}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-sm text-[#A3A3A3]">{value}</span>}
        {!destructive && <span className="text-white/20 text-xs">›</span>}
      </div>
    </button>
  );
}

export default function Profile({ user, categories = [], updateUser, updateCategoryLimits }) {
  const { logout, updateStoredUser } = useAuth();
  const sym = currencySymbol(user?.currency);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name:          user?.name          || '',
    email:         user?.email         || '',
    monthlyBudget: user?.monthlyBudget || 4000,
    currency:      user?.currency      || 'USD',
  });
  const [saved,     setSaved]     = useState(false);
  const [saveError, setSaveError] = useState('');
  const [catLimits, setCatLimits] = useState({});

  useEffect(() => {
    const map = {};
    categories.forEach((c) => { map[c.name] = c.limit ?? 0; });
    setCatLimits(map);
  }, [categories]);

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
      const updated = await updateUser({ ...form, monthlyBudget: parseFloat(form.monthlyBudget) });
      updateStoredUser(updated);
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

  const inputCls = 'w-full p-3 bg-black/40 border border-white/10 text-white rounded-xl outline-none focus:border-[#4B58FF] transition-colors placeholder-[#A3A3A3] text-sm';

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen">

      <div className="mb-6 md:mb-8 mt-2 md:mt-0">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Profile</h2>
        <p className="text-[#A3A3A3] text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Avatar card */}
      <div className="bg-[#4B58FF] rounded-[24px] p-6 mb-5 flex items-center gap-5">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0">
          {user?.name?.charAt(0) || 'A'}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">{user?.name}</h3>
          <p className="text-white/60 text-sm">{user?.email}</p>
        </div>
        <button onClick={handleOpenEdit}
          className="ml-auto text-xs bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl transition-colors font-medium">
          Edit
        </button>
      </div>

      {saved && (
        <div className="mb-4 bg-[#75F97D]/10 border border-[#75F97D]/30 text-[#75F97D] rounded-2xl px-4 py-3 text-sm font-medium">
          ✅ Settings saved
        </div>
      )}

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
          <div className="bg-[#151515] rounded-[28px] shadow-xl w-full max-w-lg my-4 border border-white/10">

            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="font-bold text-lg text-white tracking-tight">Budget Settings</h3>
              <button onClick={() => setEditing(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-[#A3A3A3] text-sm transition-colors">
                ✕
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="px-6 pt-5 pb-4 space-y-5 max-h-[70vh] overflow-y-auto">

                {saveError && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-4 py-3 text-sm">
                    {saveError}
                  </div>
                )}

                <div>
                  <p className="text-xs font-bold text-[#A3A3A3] uppercase tracking-widest mb-3">Account</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-white">Full Name</label>
                      <input name="name" value={form.name} onChange={handleChange} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-white">Email</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} className={inputCls} />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-4">
                  <p className="text-xs font-bold text-[#A3A3A3] uppercase tracking-widest mb-3">Budget</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-white">Monthly Budget</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] text-sm font-medium">{sym}</span>
                        <input name="monthlyBudget" type="number" min="0" value={form.monthlyBudget}
                          onChange={handleChange} className={`${inputCls} pl-7`} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1 text-white">Currency</label>
                      <select name="currency" value={form.currency} onChange={handleChange} className={inputCls}>
                        {CURRENCIES.map(({ code, label }) => (
                          <option key={code} value={code}>{label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {categories.length > 0 && (
                  <div className="border-t border-white/5 pt-4">
                    <p className="text-xs font-bold text-[#A3A3A3] uppercase tracking-widest mb-1">Category Budgets</p>
                    <p className="text-xs text-[#A3A3A3] mb-3">Set {sym}0 to remove the limit for a category.</p>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <div key={cat.name} className="flex items-center gap-3">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                          <span className="text-sm text-white/70 w-36 shrink-0 truncate">{cat.icon} {cat.name}</span>
                          <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A3A3A3] text-sm">{sym}</span>
                            <input type="number" min="0"
                              value={catLimits[cat.name] ?? cat.limit ?? 0}
                              onChange={(e) => handleCatLimitChange(cat.name, e.target.value)}
                              className={`${inputCls} pl-7 py-2`} />
                          </div>
                          <span className="text-xs text-[#A3A3A3] shrink-0 w-20 text-right">
                            spent {sym}{cat.spent?.toLocaleString() ?? 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              <div className="flex gap-3 px-6 py-4 border-t border-white/5">
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 py-3 rounded-2xl border border-white/10 text-sm font-medium text-[#A3A3A3] hover:bg-white/5 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-3 rounded-2xl bg-[#4B58FF] hover:bg-[#3a46e0] text-white text-sm font-bold transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Section title="Account">
          <Row icon="🔔" label="Notifications" value="On" onClick={() => {}} />
          <Row icon="🔒" label="Change Password"           onClick={() => {}} />
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
          <Row icon="🚪" label="Sign Out"       onClick={logout}   destructive />
          <Row icon="🗑️" label="Delete Account" onClick={() => {}} destructive />
        </Section>
      </div>

      <p className="text-center text-xs text-white/10 mt-8">SmartBudget v1.0.0</p>
    </div>
  );
}
