import React, { useState } from 'react';

const AccountStatement = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const tableData = []; // No data state

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      
      {/* Container */}
      <div className="w-full border-b border-gray-200">
        
        {/* Title Header */}
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">Account Statement</h1>
        </div>

        {/* Filter Section */}
        <div className="p-4">
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Account Type</label>
              <select className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-40 bg-white h-10">
                <option>All</option>
                <option>Demo</option>
                <option>Real</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Game Name</label>
              <select className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-44 bg-white h-10">
                <option>All</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Search By Client Name</label>
              <input 
                type="text" 
                placeholder="Select option"
                className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-44 h-10"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">From</label>
              <input type="date" className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-40 h-10" />
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">To</label>
              <input type="date" className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-40 h-10" />
            </div>

            <div className="flex items-end">
              <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-6 rounded-sm text-sm font-medium transition-colors h-10">
                Load
              </button>
            </div>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select 
                value={entriesPerPage} 
                onChange={(e) => setEntriesPerPage(e.target.value)}
                className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none bg-white h-8"
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
                className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 h-8"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[13px] font-bold bg-gray-50">
                  <th className="p-3 border-r border-gray-200 last:border-r-0 uppercase">Date</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0 uppercase">Credit</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0 uppercase">Debit</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0 uppercase">Closing</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0 uppercase">Description</th>
                  <th className="p-3 uppercase">FromTo</th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white">
                  <td colSpan="6" className="p-12 text-center text-gray-500 text-[14px] italic">
                    No data available in table
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Updated Pagination - Zyada Bada aur Clear Layout */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t border-gray-100 pt-4 px-2">
            <div className="text-sm text-gray-500 mb-4 sm:mb-0">
              Showing 0 to 0 of 0 entries
            </div>

            <div className="flex items-center -space-x-px">
              <button className="px-4 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-l-md text-sm font-medium">
                Previous
              </button>
              
              <button className="px-5 py-2 border border-gray-300 bg-[#0086C1] text-white font-bold text-sm z-10 shadow-sm">
                1
              </button>
              
              <button className="px-4 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-r-md text-sm font-medium">
                Next
              </button>
            </div>
          </div>

          {/* Bottom Branding */}
          <div className="text-center text-[10px] text-gray-400 mt-10 pb-4 tracking-widest">
            DEVEXPO
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatement;