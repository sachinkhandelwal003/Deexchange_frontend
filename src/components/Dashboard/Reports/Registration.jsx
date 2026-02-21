import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const UserRegisterDetail = () => {
  const [entries, setEntries] = useState(25);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Helper: Data missing hone par Dash (-) dikhayega
  const displayValue = (val) => (val !== undefined && val !== null && val !== "" ? val : "-");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const response = await axios.get(`https://devexchangee.in/api/api/users/get-all-users`, {
        params: {
          page: page,
          limit: entries,
          search: searchTerm
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setUsers(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }, [page, entries, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- DOWNLOAD API LOGIC ---
  const handleDownload = async (type) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('adminToken');
      const endpoint = type === 'pdf' 
        ? 'https://devexchangee.in/api/api/admin/download-account-list-pdf'
        : 'https://devexchangee.in/api/api/admin/download-account-list-excel';

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob', // Important for file downloads
      });

      // Creating a download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `AccountList_${new Date().getTime()}.${type === 'pdf' ? 'pdf' : 'xlsx'}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download Error:", error);
      alert("File download failed!");
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setPage(1);
    setEntries(25);
  };

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      <div className="w-full border-b border-gray-200">
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">User Register Detail</h1>
        </div>

        <div className="p-4">
          {/* Top Filter Bar */}
          <div className="flex flex-wrap items-end gap-2 mb-8">
            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Search By Client Name</label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Select option"
                className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-52 h-10 shadow-sm"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[12px] font-semibold text-gray-600 mb-1">Type</label>
              <select className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-52 h-10 bg-white shadow-sm">
                <option>All</option>
              </select>
            </div>
            
            <button onClick={fetchUsers} className="bg-[#0086C1] hover:bg-blue-600 text-white px-5 rounded-sm text-sm font-medium transition-colors h-10 shadow-sm">
              {loading ? '...' : 'Load'}
            </button>

            <button onClick={resetFilters} className="bg-[#E8F1F8] hover:bg-gray-200 text-[#0086C1] px-5 rounded-sm text-sm font-medium transition-colors h-10 shadow-sm">
              Reset
            </button>

            {/* Excel Download Icon */}
            <button 
              onClick={() => handleDownload('excel')}
              className="bg-[#28A745] hover:bg-green-600 text-white w-10 h-10 rounded-sm flex items-center justify-center shadow-sm" 
              title="Export Excel"
            >
              <span className="text-xs font-bold">XL</span>
            </button>

            {/* PDF Download Icon */}
            <button 
              onClick={() => handleDownload('pdf')}
              className="bg-[#DC3545] hover:bg-red-600 text-white w-10 h-10 rounded-sm flex items-center justify-center shadow-sm" 
              title="Export PDF"
            >
              <span className="text-xs font-bold">PDF</span>
            </button>
          </div>

          {/* Table Controls */}
          <div className="flex justify-between items-center mb-4 text-[13px]">
            <div className="flex items-center gap-1.5">
              <span>Show</span>
              <select 
                value={entries} 
                onChange={(e) => {setEntries(Number(e.target.value)); setPage(1);}}
                className="border border-gray-300 rounded-sm px-2 py-1 focus:outline-none bg-white h-8"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
              </select>
              <span>entries</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-gray-600 font-medium">Search:</label>
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search..."
                className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-48 h-9"
              />
            </div>
          </div>

          {/* Detailed Table */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="border-b border-gray-300 text-[12px] font-bold bg-white text-gray-700 uppercase">
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap">User Name</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap">Agent Name</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap">Mobile</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap">Created Date</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap">Last Login</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap">First Deposit Date</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap">Last Deposit Date</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap text-right">Deposit</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap text-right">Sports Balance</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap text-right">Casino Balance</th>
                  <th className="p-2 border-r border-gray-100 whitespace-nowrap text-right">Third Party Credit Balance</th>
                  <th className="p-2 whitespace-nowrap text-right">Sport Book Balance</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="12" className="p-8 text-center text-blue-500 font-bold italic">Fetching data...</td></tr>
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id} className="bg-white border-b border-gray-50 text-[12px] hover:bg-gray-50">
                      <td className="p-2 border-r border-gray-100 font-medium">{displayValue(user.client_name)}</td>
                      <td className="p-2 border-r border-gray-100">{displayValue(user.agent_name)}</td>
                      <td className="p-2 border-r border-gray-100">{displayValue(user.phone_number)}</td>
                      <td className="p-2 border-r border-gray-100">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                      <td className="p-2 border-r border-gray-100">{displayValue(user.lastLogin)}</td>
                      <td className="p-2 border-r border-gray-100">{displayValue(user.firstDepoDate)}</td>
                      <td className="p-2 border-r border-gray-100">{displayValue(user.lastDepoDate)}</td>
                      <td className="p-2 border-r border-gray-100 text-right font-bold">{displayValue(user.current_balance)}</td>
                      <td className="p-2 border-r border-gray-100 text-right">{displayValue(user.sports_balance)}</td>
                      <td className="p-2 border-r border-gray-100 text-right font-semibold text-green-700">{displayValue(user.casino_balance)}</td>
                      <td className="p-2 border-r border-gray-100 text-right text-blue-600 font-bold">{displayValue(user.third_party_bal)}</td>
                      <td className="p-2 text-right">{displayValue(user.sport_book_bal)}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-white">
                    <td colSpan="12" className="p-8 text-center text-gray-500 text-[14px]">
                      There are no records to show
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Large Arrows Pagination */}
          <div className="flex justify-end mt-6">
            <div className="flex items-center space-x-1">
              <button disabled={page === 1} onClick={() => setPage(1)} className="w-10 h-10 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl disabled:opacity-40 transition-all">«</button>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="w-10 h-10 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl disabled:opacity-40 transition-all">‹</button>
              <button className="w-10 h-10 bg-[#0086C1] text-white rounded-sm font-bold text-base shadow-sm">{page}</button>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="w-10 h-10 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl disabled:opacity-40 transition-all">›</button>
              <button disabled={page === totalPages} onClick={() => setPage(totalPages)} className="w-10 h-10 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-sm text-xl disabled:opacity-40 transition-all">»</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegisterDetail;