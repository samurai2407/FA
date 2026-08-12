 // src/pages/AddExpense.jsx
import { Link } from 'react-router-dom';

export default function AddExpense() {
  return (
    <div className="p-4 font-sans bg-white min-h-screen">
      
      {/* 1. Header with Back Button */}
      <div className="flex items-center mb-10 mt-2">
        {/* The Link tag acts as our back button, returning us to "/" (Home) */}
        <Link to="/" className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-100">
          ←
        </Link>
        <h2 className="text-xl font-bold ml-12">Add New Expense</h2>
      </div>

      {/* 2. The large Expense Amount input */}
      <div className="text-center mb-8 flex flex-col items-center">
        <label className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">Expense Amount</label>
        <div className="flex justify-center items-center text-6xl font-bold text-[#1a202c]">
          <span>$</span>
          <input 
            type="number" 
            placeholder="0.00"
            className="w-40 bg-transparent border-none outline-none text-center focus:ring-0 p-0"
          />
        </div>
      </div>

      {/* 3. The Form Fields */}
      <div className="space-y-4">
        
        <div>
          <label className="block text-sm font-bold mb-2">Category</label>
          <select className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#00d09c] text-gray-600">
            <option>Select category</option>
            <option>Food & Dining</option>
            <option>Transportation</option>
            <option>Entertainment</option>
            <option>Shopping</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Title</label>
          <input 
            type="text" 
            placeholder="✏️ e.g., Lunch at cafe" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#00d09c]"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Date</label>
          <input 
            type="date" 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#00d09c] text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-bold mb-2">Add Note (Optional)</label>
          <textarea 
            placeholder="Enter additional details here..." 
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#00d09c] h-24 resize-none"
          ></textarea>
        </div>

        {/* Save Button */}
        <button className="w-full bg-[#1a202c] text-white py-4 rounded-xl font-bold mt-8 shadow-md">
          Save Expense
        </button>

      </div>
    </div>
  );
}