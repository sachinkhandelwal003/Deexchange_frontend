import React from "react";

const AccountStatement = () => {
  return (
    <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
      {/* HEADER */}
      <div className="bg-[#2C3E50] text-white px-4 py-2 text-lg font-medium">
        Account Statement
      </div>

      {/* FILTER BAR */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3">
          {/* Date From */}
          <input
            type="date"
            defaultValue="2026-01-20"
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
          />

          {/* Date To */}
          <input
            type="date"
            defaultValue="2026-01-27"
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-1 focus:ring-blue-500"
          />

          {/* Report Type */}
          <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white min-w-[220px]">
            <option>Deposit / Withdraw Reports</option>
            <option>Game Reports</option>
          </select>

          {/* Submit Button */}
          <button className="bg-[#008CBA] hover:bg-[#007ba8] text-white px-8 py-1 rounded text-sm font-medium transition">
            Submit
          </button>
        </div>

        {/* TABLE CONTROLS */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm flex items-center gap-2">
            Show
            <select className="border border-gray-300 rounded px-1 py-1">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
            Entries
          </div>

          <div className="flex items-center gap-2 text-sm">
            Search:
            <input
              type="text"
              placeholder="0 records..."
              className="border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-sm font-semibold text-gray-700">
              <th className="px-4 py-2 border-r w-1/4">Date</th>
              <th className="px-4 py-2 border-r">Sr no</th>
              <th className="px-4 py-2 border-r">Credit</th>
              <th className="px-4 py-2 border-r">Debit</th>
              <th className="px-4 py-2 border-r">Pts</th>
              <th className="px-4 py-2">Remark</th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-center text-gray-400 italic">
              <td colSpan="6" className="py-10">
                No data available in table
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountStatement;