import React, { useState } from 'react';

const UserRegisterDetail = () => {
  const [entries, setEntries] = useState(25);

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      
      {/* Main Container - Full Flush */}
      <div className="w-full border-b border-gray-200">
        
        {/* Header Section */}
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">User Register Detail</h1>
        </div>

        {/* Filters & Content */}
        <div className="p-4">
          
          {/* Top Filter Bar with Action Buttons */}
          <div className="flex flex-wrap items-end gap-2 mb-8">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Search By Client Name</label>
              <input 
                type="text" 
                placeholder="Select option"
                className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-52 h-10 shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Type</label>
              <select className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-52 h-10 bg-white shadow-sm">
                <option>All</option>
              </select>
            </div>
            
            <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-5 rounded-sm text-sm font-medium transition-colors h-10 shadow-sm">
              Load
            </button>

            <button className="bg-[#E8F1F8] hover:bg-gray-200 text-[#0086C1] px-5 rounded-sm text-sm font-medium transition-colors h-10 shadow-sm">
              Reset
            </button>

            {/* Excel & PDF Icons Placeholders */}
            <button className="bg-[#28A745] hover:bg-green-600 text-white w-10 h-10 rounded-sm flex items-center justify-center shadow-sm" title="Export Excel">
              <span className="text-xs font-bold">XL</span>
            </button>

            <button className="bg-[#DC3545] hover:bg-red-600 text-white w-10 h-10 rounded-sm flex items-center justify-center shadow-sm" title="Export PDF">
              <span className="text-xs font-bold">PDF</span>
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

          {/* Detailed Table */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-gray-300 text-[12px] font-bold bg-white">
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">User Name</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Agent Name</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Mobile</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Created Date</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Last Login</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">First Deposit Date</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Last Deposit Date</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Deposit</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Sports Balance</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Casino Balance</th>
                  <th className="p-2 border-r border-gray-100 last:border-r-0 whitespace-nowrap">Third Party Credit Balance</th>
                  <th className="p-2 whitespace-nowrap">Sport Book Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td colSpan="12" className="p-8 text-center text-gray-500 text-[14px]">
                    There are no records to show
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Large Arrows Pagination (As requested) */}
          <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-1">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 rounded-sm text-xl transition-all">
                «
              </button>
              
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 rounded-sm text-xl transition-all">
                ‹
              </button>
              
              <button className="w-10 h-10 flex items-center justify-center bg-[#0086C1] text-white rounded-sm font-bold text-base shadow-sm">
                1
              </button>
              
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl transition-all">
                ›
              </button>
              
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

export default UserRegisterDetail;