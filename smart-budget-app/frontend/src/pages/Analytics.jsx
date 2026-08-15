// src/pages/Analytics.jsx
import { useTheme } from '../context/ThemeContext';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const RADIAN = Math.PI / 180;

function CustomPieLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight="bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
      <p className="text-xs text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent || 'text-gray-900 dark:text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export default function Analytics({ totalSpent, categories, monthlyTrend, user }) {
  const { dark } = useTheme();
  const budget      = user?.monthlyBudget || 4000;
  const remaining   = budget - totalSpent;
  const savingsRate = Math.max(0, Math.round((remaining / budget) * 100));
  const avgMonthly  = monthlyTrend?.length
    ? Math.round(monthlyTrend.reduce((s, m) => s + m.spent, 0) / monthlyTrend.length)
    : 0;
  const topCategory = categories?.slice().sort((a, b) => b.spent - a.spent)[0];

  // Dynamic colors for recharts (can't use Tailwind classes inside SVG props)
  const gridColor   = dark ? '#374151' : '#f3f4f6';
  const tickColor   = dark ? '#6b7280' : '#9ca3af';
  const tooltipBg   = dark ? '#1f2937' : '#ffffff';
  const tooltipBorder = dark ? '#374151' : '#e5e7eb';
  const cursorFill  = dark ? '#374151' : '#f3f4f6';

  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-950 min-h-screen">

      <div className="mb-6 md:mb-8 mt-4 md:mt-0">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Analytics</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of your spending habits</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Spent"  value={`$${totalSpent?.toFixed(2)}`} sub="This month" />
        <StatCard label="Remaining"    value={`$${remaining?.toFixed(2)}`}  sub={`of $${budget}`} accent="text-[#00d09c]" />
        <StatCard label="Savings Rate" value={`${savingsRate}%`}            sub="This month" />
        <StatCard label="Avg / Month"  value={`$${avgMonthly}`}             sub="Last 6 months" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">Monthly Spending</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">Last 6 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyTrend} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                formatter={(v) => [`$${v.toLocaleString()}`, 'Spent']}
                contentStyle={{ borderRadius: '12px', border: `1px solid ${tooltipBorder}`, fontSize: 13, background: tooltipBg, color: dark ? '#fff' : '#111' }}
                cursor={{ fill: cursorFill }}
              />
              <Bar dataKey="spent" fill="#00d09c" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="font-bold text-base text-gray-900 dark:text-white mb-1">Spending by Category</h3>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-5">This month</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categories} dataKey="spent" nameKey="name"
                cx="50%" cy="50%" outerRadius={90} labelLine={false} label={CustomPieLabel}>
                {categories?.map((cat) => <Cell key={cat.name} fill={cat.color} />)}
              </Pie>
              <Tooltip
                formatter={(v, name) => [`$${v.toLocaleString()}`, name]}
                contentStyle={{ borderRadius: '12px', border: `1px solid ${tooltipBorder}`, fontSize: 13, background: tooltipBg, color: dark ? '#fff' : '#111' }}
              />
              <Legend iconType="circle" iconSize={8}
                formatter={(value) => <span style={{ fontSize: 12, color: tickColor }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown table */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-base text-gray-900 dark:text-white">Category Breakdown</h3>
            {topCategory && (
              <span className="text-xs bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-100 dark:border-orange-800 rounded-full px-3 py-1 font-medium">
                Top: {topCategory.name}
              </span>
            )}
          </div>
          <div className="space-y-4">
            {categories?.slice().sort((a, b) => b.spent - a.spent).map((cat) => {
              const pct = cat.limit ? Math.min(Math.round((cat.spent / cat.limit) * 100), 100) : 0;
              const over = cat.limit && cat.spent > cat.limit;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${over ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                        ${cat.spent.toLocaleString()}
                      </span>
                      {cat.limit && <span className="text-xs text-gray-400 dark:text-gray-500 ml-1">/ ${cat.limit.toLocaleString()}</span>}
                    </div>
                  </div>
                  {cat.limit && (
                    <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: over ? '#ef4444' : cat.color }} />
                    </div>
                  )}
                  {over && <p className="text-red-400 text-xs mt-1">Over by ${(cat.spent - cat.limit).toLocaleString()}</p>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
