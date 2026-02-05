import React, { useState } from 'react';

const CasinoResultReport = () => {
  const [entries, setEntries] = useState(25);

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      
      {/* Main Wrapper */}
      <div className="w-full border-b border-gray-200">
        
        {/* Header Section */}
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">Casino Result Report</h1>
        </div>

        {/* Filters & Content Area */}
        <div className="p-4">
          
          {/* Top Filter Bar */}
          <div className="flex flex-wrap gap-2 mb-6">
            <input 
              type="date" 
              defaultValue="2026-02-02"
              className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none w-44 bg-[#f8f9fa] h-10"
            />
            
            <div className="relative">
              <select className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none w-56 bg-white appearance-none pr-10 h-10">
                <option value=""></option>
              </select>
              <span className="absolute right-8 top-1/2 -translate-y-1/2 text-red-500 text-xs font-bold pointer-events-none text-lg">✕</span>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
            </div>

            <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-6 rounded-sm text-sm font-medium transition-colors h-10">
              Submit
            </button>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select 
                value={entries} 
                onChange={(e) => setEntries(e.target.value)}
                className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none bg-white h-8"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-gray-600 font-medium">Search:</label>
              <input 
                type="text" 
                placeholder="Search..."
                className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 h-9"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-[13px] font-bold bg-white">
                  <th className="p-3 border-r border-gray-100 last:border-r-0">Market Id</th>
                  <th className="p-3">Winner</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-[#f2f2f2]/60">
                  <td colSpan="2" className="p-6 text-center text-gray-600 text-[14px] italic">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Increased Size Pagination */}
          <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-1">
              {/* First Page */}
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 rounded-sm text-xl transition-all">
                «
              </button>
              
              {/* Previous */}
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 rounded-sm text-xl transition-all">
                ‹
              </button>
              
              {/* Active Page Number */}
              <button className="w-10 h-10 flex items-center justify-center bg-[#0086C1] text-white rounded-sm font-bold text-base shadow-sm">
                1
              </button>
              
              {/* Next */}
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl transition-all">
                ›
              </button>
              
              {/* Last Page */}
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl transition-all">
                »
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CasinoResultReport;