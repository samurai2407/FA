// src/pages/Analytics.jsx
import { formatAmount, currencySymbol } from '../utils/currency';
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
    <div className="bg-[#151515] rounded-[20px] p-5 border border-white/5">
      <p className="text-xs text-[#A3A3A3] font-medium uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold tracking-tight ${accent || 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-[#A3A3A3] mt-1">{sub}</p>}
    </div>
  );
}

export default function Analytics({ totalSpent, categories, monthlyTrend, user }) {
  const currency    = user?.currency || 'USD';
  const sym         = currencySymbol(currency);
  const budget      = user?.monthlyBudget || 4000;
  const remaining   = budget - totalSpent;
  const savingsRate = Math.max(0, Math.round((remaining / budget) * 100));
  const avgMonthly  = monthlyTrend?.length
    ? Math.round(monthlyTrend.reduce((s, m) => s + m.spent, 0) / monthlyTrend.length)
    : 0;
  const topCategory = categories?.slice().sort((a, b) => b.spent - a.spent)[0];

  const gridColor     = '#ffffff0d';
  const tickColor     = '#A3A3A3';
  const tooltipBg     = '#1C1C1E';
  const tooltipBorder = '#ffffff15';
  const cursorFill    = '#ffffff08';

  return (
    <div className="p-4 md:p-8 bg-black min-h-screen">

      <div className="mb-6 md:mb-8 mt-2 md:mt-0">
        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">Analytics</h2>
        <p className="text-[#A3A3A3] text-sm mt-1">Overview of your spending habits</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Spent"  value={formatAmount(totalSpent, currency)}    sub="This month" />
        <StatCard label="Remaining"    value={formatAmount(remaining, currency)}      sub={`of ${formatAmount(budget, currency, 0)}`} accent="text-[#75F97D]" />
        <StatCard label="Savings Rate" value={`${savingsRate}%`}                     sub="This month" />
        <StatCard label="Avg / Month"  value={formatAmount(avgMonthly, currency, 0)} sub="Last 6 months" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Bar chart */}
        <div className="bg-[#151515] rounded-[24px] p-6 border border-white/5">
          <h3 className="font-bold text-base text-white mb-1 tracking-tight">Monthly Spending</h3>
          <p className="text-xs text-[#A3A3A3] mb-5">Last 6 months</p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={monthlyTrend} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: tickColor }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `${sym}${(v / 1000).toFixed(1)}k`} />
              <Tooltip
                formatter={(v) => [`${sym}${v.toLocaleString()}`, 'Spent']}
                contentStyle={{ borderRadius: '14px', border: `1px solid ${tooltipBorder}`, fontSize: 13, background: tooltipBg, color: '#fff' }}
                cursor={{ fill: cursorFill }}
              />
              <Bar dataKey="spent" fill="#75F97D" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie chart */}
        <div className="bg-[#151515] rounded-[24px] p-6 border border-white/5">
          <h3 className="font-bold text-base text-white mb-1 tracking-tight">Spending by Category</h3>
          <p className="text-xs text-[#A3A3A3] mb-5">This month</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={categories} dataKey="spent" nameKey="name"
                cx="50%" cy="50%" outerRadius={90} labelLine={false} label={CustomPieLabel}>
                {categories?.map((cat) => <Cell key={cat.name} fill={cat.color} />)}
              </Pie>
              <Tooltip
                formatter={(v, name) => [`${sym}${v.toLocaleString()}`, name]}
                contentStyle={{ borderRadius: '14px', border: `1px solid ${tooltipBorder}`, fontSize: 13, background: tooltipBg, color: '#fff' }}
              />
              <Legend iconType="circle" iconSize={8}
                formatter={(value) => <span style={{ fontSize: 12, color: tickColor }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Breakdown table */}
        <div className="bg-[#151515] rounded-[24px] p-6 border border-white/5 lg:col-span-2">
          <div className="flex justify-between items-center mb-5">
            <h3 className="font-bold text-base text-white tracking-tight">Category Breakdown</h3>
            {topCategory && (
              <span className="text-xs bg-[#4B58FF]/20 text-[#4B58FF] border border-[#4B58FF]/30 rounded-full px-3 py-1 font-medium">
                Top: {topCategory.name}
              </span>
            )}
          </div>
          <div className="space-y-4">
            {categories?.slice().sort((a, b) => b.spent - a.spent).map((cat) => {
              const pct  = cat.limit ? Math.min(Math.round((cat.spent / cat.limit) * 100), 100) : 0;
              const over = cat.limit && cat.spent > cat.limit;
              return (
                <div key={cat.name}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: cat.color }} />
                      <span className="text-sm font-medium text-white/80">{cat.name}</span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-bold ${over ? 'text-red-400' : 'text-white'}`}>
                        {sym}{cat.spent.toLocaleString()}
                      </span>
                      {cat.limit && <span className="text-xs text-[#A3A3A3] ml-1">/ {sym}{cat.limit.toLocaleString()}</span>}
                    </div>
                  </div>
                  {cat.limit && (
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: over ? '#f87171' : cat.color }} />
                    </div>
                  )}
                  {over && <p className="text-red-400 text-xs mt-1">Over by {sym}{(cat.spent - cat.limit).toLocaleString()}</p>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
