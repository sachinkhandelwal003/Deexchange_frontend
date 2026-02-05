import React, { useState } from 'react';

const CasinoReport = () => {
  const [entries, setEntries] = useState(25);

  return (
    // 'p-0' ensures it touches the very top and left of the screen
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      
      {/* Container - removed max-width and centering to keep it left-aligned */}
      <div className="w-full border-b border-gray-200">
        
        {/* Title Section */}
        <div className="p-4 bg-white">
          <h1 className="text-xl font-semibold text-slate-800">Casino Report</h1>
        </div>

        {/* Main Content Area */}
        <div className="p-4">
          {/* Filter Controls - Top Left aligned */}
          <div className="flex flex-wrap gap-2 mb-6">
            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 bg-white">
              <option>Select Casino Type</option>
            </select>
            
            <input 
              type="text" 
              placeholder="Select option" 
              className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-48"
            />
            
            <select className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 bg-white">
              <option>Select</option>
            </select>

            <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-5 py-1.5 rounded text-sm font-medium transition-colors">
              Submit
            </button>
          </div>

          {/* Table Controls (Show entries & Search) */}
          <div className="flex justify-between items-center mb-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select 
                value={entries} 
                onChange={(e) => setEntries(e.target.value)}
                className="border border-gray-300 rounded px-1 py-0.5 focus:outline-none bg-white"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label>Search:</label>
              <input 
                type="text" 
                className="border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
              />
            </div>
          </div>

          {/* Table - Full Width */}
          <div className="overflow-x-auto border border-gray-200 rounded-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[13px] font-bold">
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Game Name</th>
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Type</th>
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Amount</th>
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Total</th>
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Date</th>
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Round Id</th>
                  <th className="p-3">Transaction Id</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#F9F9F9]">
                  <td colSpan="7" className="p-4 text-center text-gray-600 text-[13px]">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination - Aligned to bottom right of the container */}
          <div className="flex justify-end mt-4">
            <div className="flex items-center space-x-0.5 text-[12px]">
              <button className="px-2 py-1 text-gray-400">«</button>
              <button className="px-2 py-1 text-gray-400 mr-2">‹</button>
              <button className="px-3 py-1 bg-[#0086C1] text-white rounded-[3px]">1</button>
              <button className="px-2 py-1 text-gray-400 ml-2">›</button>
              <button className="px-2 py-1 text-gray-400">»</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CasinoReport;