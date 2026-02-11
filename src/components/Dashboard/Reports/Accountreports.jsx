import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AccountStatement = () => {
  const [entriesPerPage, setEntriesPerPage] = useState(25);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filter States
  const [accountType, setAccountType] = useState('ALL');
  const [clientId, setClientId] = useState(''); 
  // Dates ko thoda peeche rakha hai taaki purana data bhi cover ho jaye
  const [fromDate, setFromDate] = useState('2026-01-01'); 
  const [toDate, setToDate] = useState('2026-02-15');

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      
      // Exact backend mapping based on your provided JSON
      let apiType = '';
      if (accountType === 'Deposit Reports') apiType = 'deposit_to_user_from_admin';
      else if (accountType === 'Withdraw Reports') apiType = 'withdraw_from_user_send_to_admin';
      else if (accountType === 'Credit Reports') apiType = 'set_credit_reference_to_user';

      const response = await axios.get(`http://localhost:3000/api/admin/admin-account-statement`, {
        params: {
          limit: entriesPerPage,
          client_id: clientId || undefined,
          from: fromDate,
          to: toDate,
          page: 1,
          account_type: apiType || undefined 
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.status === "success" || response.data.success) {
        // Data path check
        setTableData(response.data.data || []);
      }
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Page load hote hi data fetch karega
  useEffect(() => {
    fetchData();
  }, []);

  const formatNum = (num) => (num !== undefined ? parseFloat(num).toFixed(2) : '0.00');

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      <div className="w-full border-b border-gray-200">
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">Account Statement</h1>
        </div>

        <div className="p-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Account Type</label>
              <select 
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm bg-white min-w-[220px] h-10 outline-none"
              >
                <option value="ALL">ALL Transactions</option>
                <option value="Deposit Reports">Deposit Reports</option>
                <option value="Withdraw Reports">Withdraw Reports</option>
                <option value="Credit Reports">Credit Reports</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Client ID Search</label>
              <input 
                type="text" 
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="ID (Leave blank for all)"
                className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-64 h-10"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">From</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-gray-300 rounded-sm px-3 py-2 text-sm h-10" />
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">To</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-gray-300 rounded-sm px-3 py-2 text-sm h-10" />
            </div>

            <div className="flex items-end">
              <button 
                onClick={fetchData}
                className="bg-[#0086C1] hover:bg-blue-600 text-white px-10 rounded-sm text-sm font-bold h-10 uppercase shadow-md transition-all active:scale-95"
              >
                {loading ? 'Wait...' : 'Load'}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[13px] font-bold bg-gray-50">
                  <th className="p-3 border-r border-gray-200 uppercase">Date</th>
                  <th className="p-3 border-r border-gray-200 uppercase text-green-700">Credit</th>
                  <th className="p-3 border-r border-gray-200 uppercase text-red-700">Debit</th>
                  <th className="p-3 border-r border-gray-200 uppercase">Closing</th>
                  <th className="p-3 border-r border-gray-200 uppercase">Description</th>
                  <th className="p-3 uppercase">Details</th>
                </tr>
              </thead>
              <tbody>
                {tableData.length > 0 ? (
                  tableData.map((row, index) => {
                    const isDepo = row.transaction_type?.includes('deposit');
                    const isWith = row.transaction_type?.includes('withdraw');
                    const isCred = row.transaction_type === 'set_credit_reference_to_user';

                    return (
                      <tr key={index} className="bg-white border-b border-gray-100 text-[13px] hover:bg-gray-50">
                        <td className="p-3 border-r border-gray-200">
                          {new Date(row.createdAt).toLocaleString()}
                        </td>
                        
                        {/* Credit Logic */}
                        <td className="p-3 border-r border-gray-200 text-green-600 font-bold text-right">
                          {isDepo ? formatNum(row.amount) : isCred && row.new_credit > row.old_credit ? formatNum(row.new_credit - row.old_credit) : '0.00'}
                        </td>

                        {/* Debit Logic */}
                        <td className="p-3 border-r border-gray-200 text-red-600 font-bold text-right">
                          {isWith ? formatNum(row.amount) : isCred && row.new_credit < row.old_credit ? formatNum(row.old_credit - row.new_credit) : '0.00'}
                        </td>

                        {/* Closing Logic */}
                        <td className="p-3 border-r border-gray-200 font-bold text-right">
                          {isCred ? formatNum(row.new_credit) : formatNum(row.users_final_amount || row.admins_final_amount)}
                        </td>

                        <td className="p-3 border-r border-gray-200 text-gray-500 italic">
                          {row.remark || (isCred ? `Limit: ${row.old_credit} → ${row.new_credit}` : "Transaction")}
                        </td>
                        
                        <td className="p-3">
                          <span className="text-[10px] font-bold uppercase bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
                            {row.transaction_type?.replace(/_/g, ' ')}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="p-20 text-center text-gray-400">
                      {loading ? 'Record not fetched': 'No records found for the selected filters.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountStatement;