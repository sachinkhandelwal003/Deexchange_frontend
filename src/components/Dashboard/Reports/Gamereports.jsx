import React, { useState } from 'react';

const GameReport = () => {
  const [entries, setEntries] = useState(25);
  const tableData = []; // Empty state

  return (
    // 'p-0' ensures it touches the very top and left of the screen
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      
      {/* Container - removed rounding and max-width */}
      <div className="w-full border-b border-gray-200">
        
        {/* Title Section (Plain White like Casino Report) */}
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">Game Report</h1>
        </div>

        {/* Main Content Area */}
        <div className="p-4">
          {/* Filters - Top Left aligned, sharp corners */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">From</label>
              <input 
                type="date" 
                className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none w-44"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">To</label>
              <input 
                type="date" 
                className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none w-44"
              />
            </div>
            
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Type</label>
              <select className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none w-44 bg-white">
                <option>All</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-5 py-1.5 rounded-sm text-sm font-medium transition-colors h-[34px]">
                Submit
              </button>
              <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-5 py-1.5 rounded-sm text-sm font-medium transition-colors h-[34px]">
                Master Game Report
              </button>
            </div>
          </div>

          {/* Table Controls (Show entries & Search) */}
          <div className="flex justify-between items-center mb-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select 
                value={entries} 
                onChange={(e) => setEntries(e.target.value)}
                className="border border-gray-300 rounded-sm px-1 py-0.5 focus:outline-none bg-white"
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
                className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
              />
            </div>
          </div>

          {/* Table - Full Width with Sharp Edges */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[13px] font-bold">
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Sr.No</th>
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Name</th>
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Type</th>
                  <th className="p-3">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#F9F9F9]">
                  <td colSpan="4" className="p-6 text-center text-gray-600 text-[13px] italic">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pagination - Bottom Right */}
          <div className="flex justify-end mt-4">
            <div className="flex items-center space-x-0.5 text-[12px]">
              <button className="px-2 py-1 text-gray-400">«</button>
              <button className="px-2 py-1 text-gray-400 mr-2">‹</button>
              <button className="px-3 py-1 bg-[#0086C1] text-white rounded-[2px]">1</button>
              <button className="px-2 py-1 text-gray-400 ml-2">›</button>
              <button className="px-2 py-1 text-gray-400">»</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GameReport;