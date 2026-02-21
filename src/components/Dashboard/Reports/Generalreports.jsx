import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GeneralReport = () => {
  const [reportType, setReportType] = useState('General Report');
  const [entries, setEntries] = useState(20);
  const [page, setPage] = useState(1);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const reportOptions = [
    'General Report',
    'Profit/Loss Report',
    'Client Wise Report',
    'Game Wise Report',
  ];

  // API Function
  const fetchReport = async () => {
    setLoading(true);
    try {
      // Aapki exact API URL params ke saath
      const response = await axios.get(`https://devexchangee.in/api/api/admin/admin-account-statement`, {
        params: {
          limit: entries,
          page: page,
          account_type: 'set_credit_reference_to_user', // Jo aapne batayi thi
          search: search // Agar backend search support karta hai
        }
      });

      // Maan lete hain data 'data' key mein aa raha hai
      if (response.data && response.data.data) {
        setTableData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jab entries ya page badle, API call ho
  useEffect(() => {
    fetchReport();
  }, [entries, page]);

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      <div className="w-full border-b border-gray-200">
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">General Report</h1>
        </div>

        <div className="p-4">
          {/* Filters */}
          <div className="flex items-end gap-3 mb-6">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">
                Select Type Report
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none w-56 bg-white"
              >
                {reportOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={fetchReport}
              disabled={loading}
              className="bg-[#0086C1] hover:bg-blue-600 text-white px-6 py-1.5 rounded-sm text-sm font-medium transition-colors h-[34px]"
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select 
                value={entries} 
                onChange={(e) => {
                  setEntries(e.target.value);
                  setPage(1); // Reset to page 1 on limit change
                }}
                className="border border-gray-300 rounded-sm px-1 py-0.5 focus:outline-none bg-white"
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label>Search:</label>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-40"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[13px] font-bold bg-gray-50">
                  <th className="p-3 border-r border-gray-100">SR.NO</th>
                  <th className="p-3 border-r border-gray-100">NAME</th>
                  <th className="p-3 border-r border-gray-100">DATE/TIME</th>
                  <th className="p-3">AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-500 text-[13px]">
                      Loading data...
                    </td>
                  </tr>
                ) : tableData.length > 0 ? (
                  tableData.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 text-[13px] hover:bg-gray-50">
                      <td className="p-3 border-r border-gray-100">{(page - 1) * entries + index + 1}</td>
                      <td className="p-3 border-r border-gray-100">{item.userName || item.name || 'N/A'}</td>
                      <td className="p-3 border-r border-gray-100">{new Date(item.createdAt).toLocaleString()}</td>
                      <td className={`p-3 font-semibold ${item.amount < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-[#F9F9F9]">
                    <td colSpan="4" className="p-8 text-center text-gray-500 text-[13px] italic">
                      No data available in table
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-end mt-4">
            <div className="flex items-center space-x-0.5 text-[12px]">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              >«</button>
              <button className="px-3 py-1 bg-[#0086C1] text-white rounded-[2px]">{page}</button>
              <button 
                onClick={() => setPage(p => p + 1)}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
              >»</button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GeneralReport;