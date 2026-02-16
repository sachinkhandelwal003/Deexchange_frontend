import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserWinLoss = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [totals, setTotals] = useState({
    casino: 0,
    sport: 0,
    thirdParty: 0,
    profitLoss: 0
  });

  // Filter States
  const [clientId, setClientId] = useState('');
  const [fromDate, setFromDate] = useState('2026-02-01');
  const [toDate, setToDate] = useState('2026-02-11');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await axios.get(`https://devexchangee.in/api/api/admin/user-win-loss`, {
        params: {
          page: 1,
          limit: 100,
          status: 'all',
          from: fromDate,
          to: toDate,
          search: clientId || undefined
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const result = response.data.data;
        setTableData(result.all_users || []);
        setTotals({
          casino: result.overall_casino_amount,
          sport: result.overall_sport_amount,
          thirdParty: result.overall_third_party_amount,
          profitLoss: result.overall_profit_loss
        });
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  }, [clientId, fromDate, toDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- DOWNLOAD FUNCTION ---
  const handleDownload = async (type) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const endpoint = type === 'pdf' 
        ? 'https://devexchangee.in/api/api/admin/user-win-loss-download-pdf'
        : 'https://devexchangee.in/api/api/admin/user-win-loss-download-csv';

      const response = await axios.get(endpoint, {
        params: {
          from: fromDate,
          to: toDate,
          search: clientId || undefined
        },
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob' // File download ke liye zaroori hai
      });

      // File download logic
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `UserWinLoss.${type === 'pdf' ? 'pdf' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download Error:", error);
      alert("Download failed!");
    }
  };

  const formatNum = (num) => (num !== undefined ? parseFloat(num).toFixed(2) : '0.00');

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      <div className="p-4 bg-white">
        <h1 className="text-xl font-medium text-slate-800">User Win Loss</h1>
      </div>

      <div className="px-4">
        {/* Filter Bar */}
        <div className="flex flex-wrap items-end gap-3 mb-6">
          <div className="flex flex-col">
            <label className="text-[12px] font-bold text-gray-600 mb-1">Search By Client Name</label>
            <input 
              type="text" 
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              placeholder="Select option"
              className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm focus:outline-none w-52 h-9 shadow-sm"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-[12px] font-bold text-gray-600 mb-1">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm h-9 shadow-sm" />
          </div>

          <div className="flex flex-col">
            <label className="text-[12px] font-bold text-gray-600 mb-1">To Date</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-gray-300 rounded-sm px-3 py-1.5 text-sm h-9 shadow-sm" />
          </div>
          
          <div className="flex gap-1.5">
            <button onClick={fetchData} className="bg-[#0086C1] hover:bg-blue-600 text-white px-5 rounded-sm text-sm font-medium h-9 shadow-sm">
              {loading ? '...' : 'Load'}
            </button>
            <button onClick={() => {setClientId(''); setFromDate('2026-02-01'); setToDate('2026-02-11');}} className="bg-[#E8F1F8] hover:bg-gray-200 text-gray-600 px-5 rounded-sm text-sm font-medium h-9 shadow-sm">Reset</button>
            
            {/* Excel Button */}
            <button onClick={() => handleDownload('csv')} className="bg-[#78D9B1] hover:bg-green-400 text-white w-9 h-9 rounded-sm flex items-center justify-center shadow-sm" title="Export CSV">
              <span className="text-[10px] font-bold">XL</span>
            </button>

            {/* PDF Button */}
            <button onClick={() => handleDownload('pdf')} className="bg-[#F89999] hover:bg-red-400 text-white w-9 h-9 rounded-sm flex items-center justify-center shadow-sm" title="Export PDF">
              <span className="text-[10px] font-bold">PDF</span>
            </button>
          </div>
        </div>

        {/* Global Search UI */}
        <div className="flex justify-end items-center gap-2 mb-2">
          <span className="text-[13px]">Search:</span>
          <input type="text" className="border border-gray-300 rounded-sm px-2 py-1 text-sm outline-none w-44 h-8" />
        </div>

        {/* Main Table */}
        <div className="overflow-x-auto border border-gray-200 shadow-sm mb-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-[13px] font-bold text-gray-700 bg-gray-50 uppercase">
                <th className="p-2 border-r border-gray-200 w-12 text-center">No</th>
                <th className="p-2 border-r border-gray-200">User Name</th>
                <th className="p-2 border-r border-gray-200 text-center text-orange-600">Casino</th>
                <th className="p-2 border-r border-gray-200 text-center text-blue-600">Sport</th>
                <th className="p-2 border-r border-gray-200 text-center text-purple-600">Third Party</th>
                <th className="p-2 text-right">Profit/Loss</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((user, index) => (
                  <tr key={user._id} className="border-b border-gray-100 text-[13px] hover:bg-gray-50 transition-colors">
                    <td className="p-2 border-r border-gray-200 text-center font-medium">{index + 1}</td>
                    <td className="p-2 border-r border-gray-200 font-semibold text-slate-700">{user.client_name}</td>
                    <td className="p-2 border-r border-gray-200 text-center">{formatNum(user.casino_amount)}</td>
                    <td className="p-2 border-r border-gray-200 text-center">{formatNum(user.sport_amount)}</td>
                    <td className="p-2 border-r border-gray-200 text-center">{formatNum(user.third_party_amount)}</td>
                    <td className={`p-2 text-right font-bold ${user.users_profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {formatNum(user.users_profit_loss)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-400 text-[13px] italic">
                    {loading ? 'Fetching data...' : 'There are no records to show'}
                  </td>
                </tr>
              )}
              {/* Overall Totals Footer */}
              <tr className="bg-gray-100 font-black text-[13px] border-t-2 border-gray-300">
                <td className="p-2 border-r border-gray-200 uppercase" colSpan="2">Total</td>
                <td className="p-2 border-r border-gray-200 text-center">{formatNum(totals.casino)}</td>
                <td className="p-2 border-r border-gray-200 text-center">{formatNum(totals.sport)}</td>
                <td className="p-2 border-r border-gray-200 text-center">{formatNum(totals.thirdParty)}</td>
                <td className={`p-2 text-right ${totals.profitLoss >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {formatNum(totals.profitLoss)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom Overview Table */}
        <div className="w-full lg:w-[50%] border border-gray-200 shadow-sm rounded-sm">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-[11px] font-bold text-gray-700 uppercase">
              <tr className="border-b border-gray-200">
                <th className="p-2 border-r border-gray-200 w-12 text-center">No</th>
                <th className="p-2 border-r border-gray-200">OVERVIEW</th>
                <th className="p-2 border-r border-gray-200">CASINO</th>
                <th className="p-2 border-r border-gray-200">SPORT</th>
                <th className="p-2">PROFIT/LOSS</th>
              </tr>
            </thead>
            <tbody className="text-[12px]">
              <tr className="border-b border-gray-100 font-bold">
                <td className="p-2 border-r border-gray-200 text-center">1</td>
                <td className="p-2 border-r border-gray-200">Overall Summary</td>
                <td className="p-2 border-r border-gray-200 text-center">{formatNum(totals.casino)}</td>
                <td className="p-2 border-r border-gray-200 text-center">{formatNum(totals.sport)}</td>
                <td className="p-2 text-center text-blue-700 font-black">{formatNum(totals.profitLoss)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserWinLoss;