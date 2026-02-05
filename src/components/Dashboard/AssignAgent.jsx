import { useState } from 'react';
import Navbar from '../Dashboard/Navbar'; 

export default function AssignAgentPage() {
  const [fromDate, setFromDate] = useState('2026-01-26');
  const [toDate, setToDate] = useState('2026-02-02');
  const [entries, setEntries] = useState(25);
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-white font-sans text-[#333]">
      {/* Assuming Navbar is fixed or at the top */}
      {/* <Navbar /> */}

      {/* Added pt-10 to create a clear gap from the Navbar/Top */}
      <div className="max-w-full mx-auto px-8 ">
        
        {/* Section 1: Assign Agent List */}
        <div className="mb-10">
          {/* Exact Heading Style */}
          <h2 className="text-[24px] mb-8 text-[#212529] font-bold leading-tight">
            Assign Agent List
          </h2>
          
          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-[14px] flex items-center gap-1">
              Show 
              <select
                value={entries}
                onChange={(e) => setEntries(Number(e.target.value))}
                className="border border-[#ccc] rounded px-1 py-1 outline-none bg-white text-sm"
              >
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select> 
              entries
            </div>
            <div className="text-[14px] flex items-center gap-2">
              Search: 
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-[#ccc] rounded px-2 py-1 outline-none w-[180px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border-t border-[#ddd]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#ddd]">
                  <th className="py-2.5 px-3 text-[13px] font-bold text-[#444] border-r border-[#ddd]">S.No.</th>
                  <th className="py-2.5 px-3 text-[13px] font-bold text-[#444] border-r border-[#ddd]">User Name</th>
                  <th className="py-2.5 px-3 text-[13px] font-bold text-[#444] border-r border-[#ddd]">Assign Agent Settings</th>
                  <th className="py-2.5 px-3 text-[13px] font-bold text-[#444] border-r border-[#ddd]">Mobile Number</th>
                  <th className="py-2.5 px-3 text-[13px] font-bold text-[#444] border-r border-[#ddd]">Depo Mobile Number</th>
                  <th className="py-2.5 px-3 text-[13px] font-bold text-[#444]">First Bonus Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan="6" className="py-12 text-center text-[14px] text-[#777]">
                    There are <span className="text-[#337ab7] cursor-pointer hover:underline">no records</span> to show
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="border-b border-[#ddd] w-full"></div>
          </div>
        </div>

        {/* Section 2: User Creation */}
        <div className="mt-16 pb-10">
          <h2 className="text-[24px] mb-8 text-[#212529] font-normal">
            User Creation
          </h2>
          
          <div className="flex flex-wrap items-end gap-5">
            {/* From Date */}
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-[#212529] mb-1.5">From Date:</label>
              <div className="relative">
                <input
                  type="text"
                  value="26/01/2026"
                  readOnly
                  className="bg-[#eee] border border-[#ccc] rounded px-3 py-1.5 w-[210px] text-sm text-[#555] outline-none"
                />
                <div className="absolute right-2 top-2 text-gray-400">
                  <svg className="w-4 h-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* To Date */}
            <div className="flex flex-col">
              <label className="text-[13px] font-bold text-[#212529] mb-1.5">To Date:</label>
              <div className="relative">
                <input
                  type="text"
                  value="02/02/2026"
                  readOnly
                  className="bg-[#eee] border border-[#ccc] rounded px-3 py-1.5 w-[210px] text-sm text-[#555] outline-none"
                />
                <div className="absolute right-2 top-2 text-gray-400">
                  <svg className="w-4 h-4 opacity-60" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button className="bg-[#008cba] hover:bg-[#007ba5] text-white px-4 py-2 rounded-[4px] text-[14px] font-medium transition-colors shadow-sm">
              Download CSV
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}