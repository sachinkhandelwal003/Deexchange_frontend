import React, { useState } from 'react';

const TotalProfitLoss = () => {
  const [entries, setEntries] = useState(25);

  // Reusable Table Component for the three sections
  const ReportTable = ({ title, columns }) => (
    <div className="mb-8">
      <h2 className="text-[#0056b3] font-bold text-base mb-2">{title}</h2>
      <div className="overflow-x-auto border border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-300 text-[13px] font-bold bg-white">
              {columns.map((col, idx) => (
                <th key={idx} className={`p-3 border-r border-gray-100 last:border-r-0 ${col === 'Profit/Loss' ? 'text-right' : ''}`}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td colSpan={columns.length} className="p-6 text-center text-gray-500 text-[13px] italic">
                There are no records to show
              </td>
            </tr>
            {/* Summary Row */}
            <tr className="bg-white border-t border-gray-200 font-bold text-[13px]">
              <td colSpan={columns.length - 1} className="p-3 text-right">Total Profit/Loss</td>
              <td className="p-3 text-right">0.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      
      {/* Header Section */}
      <div className="w-full border-b border-gray-200">
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">Total Profit Loss</h1>
        </div>

        {/* Content Area */}
        <div className="p-4">
          
          {/* Top Filter Bar */}
          <div className="flex flex-wrap items-end gap-3 mb-8">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Search By Client Name</label>
              <input 
                type="text" 
                placeholder="Select option"
                className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-60 h-10 shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Select Date Range</label>
              <div className="relative">
                <input 
                  type="text" 
                  defaultValue="23/01/2026 - 02/02/2026"
                  className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-64 h-10 bg-[#f8f9fa] shadow-sm"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">📅</span>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Type</label>
              <select className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-48 h-10 bg-white shadow-sm">
                <option>All</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-6 rounded-sm text-sm font-medium h-10 shadow-sm">
              Load
            </button>
            <button className="bg-[#E8F1F8] hover:bg-gray-200 text-[#0086C1] px-6 rounded-sm text-sm font-medium h-10 shadow-sm">
              Reset
            </button>
            <button className="bg-[#28A745] hover:bg-green-600 text-white w-10 h-10 rounded-sm flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold">XL</span>
            </button>
            <button className="bg-[#DC3545] hover:bg-red-600 text-white w-10 h-10 rounded-sm flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold">PDF</span>
            </button>
          </div>

          {/* Global Search Bar (Right Aligned) */}
          <div className="flex justify-end mb-4">
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                placeholder="Search..."
                className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-64 h-9"
              />
            </div>
          </div>

          {/* Individual Report Sections */}
          <ReportTable 
            title="Sports Report" 
            columns={['Event Name', 'Game Type', 'Opening', 'Closing', 'Profit/Loss']} 
          />
          
          <ReportTable 
            title="Casino Report" 
            columns={['Casino Name', 'Opening', 'Closing', 'Profit/Loss']} 
          />
          
          <ReportTable 
            title="Third Party Report" 
            columns={['Third Party Name', 'Opening', 'Closing', 'Profit/Loss']} 
          />

          {/* Large Arrows Pagination (Common for page) */}
          <div className="flex justify-end mt-8">
            <div className="flex items-center space-x-1">
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 rounded-sm text-xl transition-all">«</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-400 hover:bg-gray-50 rounded-sm text-xl transition-all">‹</button>
              <button className="w-10 h-10 flex items-center justify-center bg-[#0086C1] text-white rounded-sm font-bold text-base shadow-sm">1</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl transition-all">›</button>
              <button className="w-10 h-10 flex items-center justify-center border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl transition-all">»</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TotalProfitLoss;