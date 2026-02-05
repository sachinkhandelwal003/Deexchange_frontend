import React, { useState } from 'react';

const CurrentBets = () => {
  const [activeTab, setActiveTab] = useState('Sports');

  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-[#333]">
      {/* Page Title */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-[22px] font-normal">Current Bets</h1>
      </div>

      <div className="p-4">
        {/* Tabs Section */}
        <div className="flex border-b border-gray-300 mb-4 bg-white w-fit rounded-t-md">
          <button 
            onClick={() => setActiveTab('Sports')}
            className={`px-6 py-2 text-[14px] font-bold border-r border-gray-300 transition-colors ${activeTab === 'Sports' ? 'text-[#333]' : 'text-gray-400 bg-[#f9f9f9]'}`}
          >
            Sports
          </button>
          <button 
            onClick={() => setActiveTab('Casino')}
            className={`px-6 py-2 text-[14px] font-bold transition-colors ${activeTab === 'Casino' ? 'text-[#333]' : 'text-gray-400 bg-[#f9f9f9]'}`}
          >
            Casino
          </button>
        </div>

        {/* Filters Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap items-center gap-6">
            {/* Status Selection */}
            <div className="flex items-center gap-4 text-[13px] font-bold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="status" defaultChecked className="accent-[#0088CC] w-4 h-4" /> Matched
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
                <input type="radio" name="status" className="accent-[#0088CC] w-4 h-4" /> Deleted
              </label>
            </div>

            {/* Type Selection */}
            <div className="flex items-center gap-4 text-[13px] font-bold">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="type" defaultChecked className="accent-[#0088CC] w-4 h-4" /> All
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
                <input type="radio" name="type" className="accent-[#0088CC] w-4 h-4" /> Back
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
                <input type="radio" name="type" className="accent-[#0088CC] w-4 h-4" /> Lay
              </label>
            </div>

            {/* Load Button */}
            <button className="bg-[#0088CC] text-white px-5 py-1.5 rounded-[4px] text-[14px] font-bold hover:bg-[#0077B3] transition-colors shadow-sm">
              Load
            </button>
          </div>

          {/* Stats Info */}
          <div className="text-[14px] font-bold text-[#333]">
            Total Soda: 0 | Total Amount: 0.00
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="text-[13px]">
            Show 
            <select className="mx-1 border border-gray-300 rounded px-1 py-0.5 outline-none">
              <option>25</option>
            </select> 
            entries
          </div>
          <div className="text-[13px]">
            Search: 
            <input 
              type="text" 
              placeholder="Search..." 
              className="ml-1 border border-gray-300 rounded px-2 py-1 outline-none w-[180px] md:w-[220px]" 
            />
          </div>
        </div>

        {/* Bets Table */}
        <div className="bg-white border border-gray-300 rounded-sm overflow-x-auto shadow-sm">
          <table className="w-full border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b-2 border-gray-800 text-left bg-[#fcfcfc]">
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Event Type</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200 text-center">Event Name</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200 text-center">User Name</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200 text-center">M Name</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200 text-center">Nation</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200 text-center">U Rate</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200 text-center">Amount</th>
                <th className="p-2 text-[13px] font-bold text-center">Place Date</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-[#f2f4f6]">
                <td colSpan="8" className="p-4 text-center text-[13px] text-gray-500 italic">
                  No data available in table
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end mt-4 items-center gap-[2px]">
          <button className="px-3 py-1 border border-gray-200 text-gray-300 text-[11px] cursor-not-allowed bg-white">«</button>
          <button className="px-3 py-1 border border-gray-200 text-gray-300 text-[11px] cursor-not-allowed bg-white">‹</button>
          <button className="px-4 py-1.5 bg-[#0088CC] text-white text-[13px] font-bold">1</button>
          <button className="px-3 py-1 border border-gray-200 text-gray-300 text-[11px] cursor-not-allowed bg-white">›</button>
          <button className="px-3 py-1 border border-gray-200 text-gray-300 text-[11px] cursor-not-allowed bg-white">»</button>
        </div>
      </div>
    </div>
  );
};

export default CurrentBets;