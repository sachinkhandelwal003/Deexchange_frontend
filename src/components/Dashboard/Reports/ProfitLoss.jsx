import React, { useState } from 'react';

const ProfitLossReport = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(25);

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      
      {/* Main Container */}
      <div className="w-full border-b border-gray-200">
        
        {/* Title Header */}
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">Profit Loss</h1>
        </div>

        {/* Filter Section */}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-8">
            <select className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-64 bg-white h-10">
              <option>All</option>
              <option>Casino</option>
              <option>Sports</option>
            </select>
            
            <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-6 rounded-sm text-sm font-medium transition-colors h-10">
              Load
            </button>
          </div>

          {/* Table Controls (Search on the Right) */}
          <div className="flex justify-end items-center mb-4 text-[13px]">
            <div className="flex items-center gap-2">
              <label className="font-semibold">Search:</label>
              <input 
                type="text" 
                placeholder="Search..."
                className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56 h-9"
              />
            </div>
          </div>

          {/* Table - Sharp Edges & Dividers */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[13px] font-bold bg-white">
                  <th className="p-3 border-r border-gray-200 last:border-r-0">No</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0">User Name</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0">Level</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0">Casino Pts</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0">Sport Pts</th>
                  <th className="p-3 border-r border-gray-200 last:border-r-0">Third Party Pts</th>
                  <th className="p-3">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {/* Empty State Row */}
                <tr className="bg-gray-50/50 border-b border-gray-200">
                  <td colSpan="7" className="p-3 text-center text-gray-600 text-[13px]">
                    No data available in table
                  </td>
                </tr>
                {/* Placeholder Footer Row (As seen in image) */}
                <tr className="bg-white h-10">
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td className="border-r border-gray-200"></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Badi Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t border-gray-100 pt-4 px-2">
            <div className="text-sm text-gray-500 mb-4 sm:mb-0">
              Showing 0 to 0 of 0 entries
            </div>

            <div className="flex items-center -space-x-px">
              <button className="px-5 py-2.5 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-l-md text-sm font-medium">
                Previous
              </button>
              
              <button className="px-6 py-2.5 border border-gray-300 bg-[#0086C1] text-white font-bold text-sm z-10">
                1
              </button>
              
              <button className="px-5 py-2.5 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-r-md text-sm font-medium">
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfitLossReport;