import React, { useState, useEffect } from "react";
import axios from "axios";

const AccountStatement = () => {
  const [statements, setStatements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  
  // API Query Params ke mutabiq default dates
  const [dateFrom, setDateFrom] = useState("2026-01-01");
  const [dateTo, setDateTo] = useState("2026-02-25");

  // API Fetch Function
  const fetchStatements = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
      
      // Updated API URL as per your request with all params
      const url = `http://localhost:3000/api/users/get-all-account-statements?page=1&limit=${entriesPerPage}&to=${dateTo}&from=${dateFrom}&search=${searchTerm}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setStatements(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching statements:", error);
      if (error.response?.status === 401) {
        alert("Invalid or expired token. Please login again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Initial load aur entries badalne par fetch karein
  useEffect(() => {
    fetchStatements();
  }, [entriesPerPage]);

  return (
    <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
      {/* HEADER */}
      <div className="bg-[#2C3E50] text-white px-4 py-2 text-lg font-medium">
        Account Statement
      </div>

      {/* FILTER BAR */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            From: 
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none font-normal"
            />
          </div>

          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            To: 
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none font-normal"
            />
          </div>

          <select className="border border-gray-300 rounded px-3 py-1 text-sm bg-white min-w-[220px] outline-none">
            <option>Deposit / Withdraw Reports</option>
            <option>sports Reports</option>
            <option>casino Reports</option>
            <option>third party casino Reports</option>
          </select>

          <button 
            onClick={fetchStatements}
            className="bg-[#008CBA] hover:bg-[#007ba8] text-white px-8 py-1 rounded text-sm font-medium transition active:scale-95 shadow-sm"
          >
            Submit
          </button>
        </div>

        {/* TABLE CONTROLS */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm flex items-center gap-2 font-medium text-gray-600">
            Show
            <select 
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="border border-gray-300 rounded px-1 py-1 outline-none cursor-pointer"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
            Entries
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
            Search:
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchStatements()}
              placeholder="Type and press Enter..."
              className="border border-gray-300 rounded px-2 py-1 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-sm font-semibold text-gray-700">
              <th className="px-4 py-3 border-r">Date</th>
              <th className="px-4 py-3 border-r">Sr no</th>
              <th className="px-4 py-3 border-r text-right">Credit</th>
              <th className="px-4 py-3 border-r text-right">Debit</th>
              <th className="px-4 py-3 border-r text-right">Pts</th>
              <th className="px-4 py-3">Remark</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-gray-800">
            {loading ? (
              <tr>
                <td colSpan="6" className="py-16 text-center text-gray-400 italic font-medium">
                  Loading account statements...
                </td>
              </tr>
            ) : statements.length > 0 ? (
              statements.map((item, index) => (
                <tr key={item._id} className="border-b hover:bg-blue-50/20 transition-colors">
                  <td className="px-4 py-2.5 border-r whitespace-nowrap text-gray-600">
                    {/* API ke raw date format ko hi use kiya hai (ISO string) */}
                    {item.createdAt}
                  </td>
                  <td className="px-4 py-2.5 border-r">{index + 1}</td>
                  <td className={`px-4 py-2.5 border-r text-right font-semibold ${item.credit > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                    {item.credit > 0 ? item.credit.toFixed(2) : '0.00'}
                  </td>
                  <td className={`px-4 py-2.5 border-r text-right font-semibold ${item.debit > 0 ? 'text-red-600' : 'text-gray-400'}`}>
                    {item.debit > 0 ? item.debit.toFixed(2) : '0.00'}
                  </td>
                  <td className="px-4 py-2.5 border-r text-right font-bold text-blue-800">
                    {item.pts.toFixed(2)}
                  </td>
                  <td className="px-4 py-2.5 font-medium uppercase text-[11px] tracking-wide text-gray-500">
                    {item.remark}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="text-center text-gray-400 italic">
                <td colSpan="6" className="py-20 text-base">
                  No records found for the given criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountStatement;