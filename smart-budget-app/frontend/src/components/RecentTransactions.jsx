// src/components/RecentTransactions.jsx

export default function RecentTransactions() {
  // Hardcoded transaction data matching your Figma design.
  // Later, these will come straight from your MongoDB backend database!
  const transactions = [
    { id: 1, title: 'Whole Foods', category: 'Groceries', date: 'Aug 11', amount: -54.30, icon: '🛒' },
    { id: 2, title: 'Uber', category: 'Transport', date: 'Aug 10', amount: -18.75, icon: '🚗' },
    { id: 3, title: 'Netflix', category: 'Entertainment', date: 'Aug 9', amount: -15.99, icon: '🎬' },
    { id: 4, title: 'Target', category: 'Shopping', date: 'Aug 8', amount: -87.20, icon: '🛍️' },
  ];

  return (
    <div className="mt-6">
      <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        {/* We use .map() to loop through each transaction and render a row */}
        {transactions.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-none">
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                {tx.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm">{tx.title}</h4>
                <p className="text-xs text-gray-400">{tx.category} • {tx.date}</p>
              </div>
            </div>

            <span className="font-bold text-sm text-gray-800">
              -${Math.abs(tx.amount).toFixed(2)}
            </span>

          </div>
        ))}
      </div>
    </div>
  );
}