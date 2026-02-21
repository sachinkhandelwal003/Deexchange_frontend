import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
const CurrentBets = () => {
  const [activeTab, setActiveTab] = useState('Sports');
  const [betsData, setBetsData] = useState([]); // API data store karne ke liye
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    count: 0
  });
  
  // Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('matched'); // matched/deleted
  const [backLay, setBackLay] = useState('all'); // all/back/lay
const navigate = useNavigate();
  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem('adminToken') || ''; // Adjust this based on your token key name
  };

  // API Fetch Function
  const fetchBets = async () => {
    setLoading(true);
    try {
      const token = getToken();
      
      const response = await axios.get('http://localhost:3000/api/admin/get-all-bets', {
        params: {
          page: page,
          limit: limit,
          search: search,
          filter: filter,
          back_lay: backLay
        },
        headers: {
          'Authorization': `Bearer ${token}` // Add token to headers
        }
      });

      if (response.data.success) {
        setBetsData(response.data.data);
        setPagination({
          total: response.data.total || 0,
          totalPages: response.data.totalPages || 0,
          count: response.data.count || 0
        });
      }
    } catch (error) {
      console.error("API Error:", error);
      if (error.response?.status === 401) {
        // Handle unauthorized - redirect to login or refresh token
        console.log("Unauthorized access");
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        setPage(1); // Reset to first page on search
        fetchBets();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Jab page load ho ya filters change hon, API hit hogi
  useEffect(() => {
    fetchBets();
  }, [page, limit, filter, backLay]);

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Get user name from nested object
  const getUserName = (user) => {
    if (!user) return 'N/A';
    return user.client_name || user.full_name || 'N/A';
  };

  // Calculate total amount
  const totalAmount = betsData.reduce((acc, curr) => {
    return acc + (Number(curr.stake) || 0);
  }, 0);

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
            className={`px-6 py-2 text-[14px] font-bold border-r border-gray-300 transition-colors ${
              activeTab === 'Sports' 
                ? 'text-[#333] bg-white' 
                : 'text-gray-400 bg-[#f9f9f9]'
            }`}
          >
            Sports
          </button>
          <button 
            onClick={() => setActiveTab('Casino')}
            className={`px-6 py-2 text-[14px] font-bold transition-colors ${
              activeTab === 'Casino' 
                ? 'text-[#333] bg-white' 
                : 'text-gray-400 bg-[#f9f9f9]'
            }`}
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
                <input 
                  type="radio" 
                  name="status" 
                  checked={filter === 'matched'} 
                  onChange={() => {
                    setFilter('matched');
                    setPage(1);
                  }}
                  className="accent-[#0088CC] w-4 h-4" 
                /> Matched
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input 
                  type="radio" 
                  name="status" 
                  checked={filter === 'deleted'} 
                  onChange={() => {
                    setFilter('deleted');
                    setPage(1);
                  }}
                  className="accent-[#0088CC] w-4 h-4" 
                /> Deleted
              </label>
            </div>

            {/* Type Selection */}
            <div className="flex items-center gap-4 text-[13px] font-bold">
              {['all', 'back', 'lay'].map((t) => (
                <label key={t} className="flex items-center gap-1.5 cursor-pointer capitalize">
                  <input 
                    type="radio" 
                    name="type" 
                    checked={backLay === t} 
                    onChange={() => {
                      setBackLay(t);
                      setPage(1);
                    }}
                    className="accent-[#0088CC] w-4 h-4" 
                  /> {t}
                </label>
              ))}
            </div>

            {/* Load Button */}
            <button 
              onClick={() => {
                setPage(1);
                fetchBets();
              }}
              className="bg-[#0088CC] text-white px-5 py-1.5 rounded-[4px] text-[14px] font-bold hover:bg-[#0077B3] transition-colors shadow-sm"
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>

          {/* Stats Info */}
          <div className="text-[14px] font-bold text-[#333]">
            Total Bets: {pagination.total} | Total Amount: ₹{totalAmount.toFixed(2)}
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="text-[13px]">
            Show 
            <select 
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="mx-1 border border-gray-300 rounded px-1 py-0.5 outline-none"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select> 
            entries
          </div>
          <div className="text-[13px]">
            Search: 
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..." 
              className="ml-1 border border-gray-300 rounded px-2 py-1 outline-none w-[180px] md:w-[220px]" 
            />
          </div>
        </div>

        {/* Bets Table */}
        <div className="bg-white border border-gray-300 rounded-sm overflow-x-auto shadow-sm">
          <table className="w-full border-collapse min-w-[1200px]">
            <thead>
              <tr className="border-b-2 border-gray-800 text-left bg-[#fcfcfc]">
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Bet Type</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">User Name</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Event ID</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Market ID</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Selection</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Odds</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Stake</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Liability</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Status</th>
                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Result</th>
                <th className="p-2 text-[13px] font-bold">Placed At</th>
                                <th className="p-2 text-[13px] font-bold border-r border-gray-200">Action</th>

              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-blue-500">
                    Loading Data...
                  </td>
                </tr>
              ) : betsData.length > 0 ? (
                betsData.map((bet, index) => (
                  <tr key={bet._id || index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 text-[13px] border-r border-gray-100">
                      <span className={`px-2 py-1 rounded font-bold ${
                        bet.bet_type === 'back' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-pink-100 text-pink-700'
                      }`}>
                        {bet.bet_type?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="p-2 text-[13px] border-r border-gray-100">
                      {getUserName(bet.user_id)}
                    </td>
                    <td className="p-2 text-[13px] border-r border-gray-100">
                      {bet.event_id || 'N/A'}
                    </td>
                    <td className="p-2 text-[13px] border-r border-gray-100">
                      {bet.market_id || 'N/A'}
                    </td>
                    <td className="p-2 text-[13px] border-r border-gray-100">
                      {bet.selection_name || 'N/A'}
                    </td>
                    <td className="p-2 text-[13px] border-r border-gray-100 font-bold">
                      {bet.odds || '0'}
                    </td>
                    <td className={`p-2 text-[13px] border-r border-gray-100 text-center font-bold ${
                      bet.bet_type === 'back' ? 'text-blue-600' : 'text-pink-600'
                    }`}>
                      ₹{bet.stake?.toFixed(2) || '0.00'}
                    </td>
                    <td className="p-2 text-[13px] border-r border-gray-100 text-center">
                      ₹{bet.liability?.toFixed(2) || '0.00'}
                    </td>
                    <td className="p-2 text-[13px] border-r border-gray-100 text-center">
                      <span className={`px-2 py-1 rounded ${
                        bet.bet_status === 'matched' 
                          ? 'bg-green-100 text-green-700' 
                          : bet.bet_status === 'unmatched'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {bet.bet_status || 'N/A'}
                      </span>
                    </td>
                    <td className="p-2 text-[13px] border-r border-gray-100 text-center">
                      <span className={`px-2 py-1 rounded ${
                        bet.result === 'won' 
                          ? 'bg-green-100 text-green-700' 
                          : bet.result === 'lost'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {bet.result || 'pending'}
                      </span>
                    </td>
                    <td className="p-2 text-[13px] text-center">
                      {formatDate(bet.placed_at)}
                    </td>
                     <td className="p-2 text-[13px] text-center">
  <button
    onClick={() => navigate(`/current-bets/${bet._id}`)}
    className="text-blue-600 underline"
  >
    View
  </button>
</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="p-8 text-center text-[13px] text-gray-500 italic">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        {pagination.totalPages > 0 && (
          <div className="flex justify-end mt-4 items-center gap-[2px]">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-200 text-gray-600 text-[11px] bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              « Previous
            </button>
            
            {/* Page Numbers */}
            <div className="flex gap-[2px]">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-3 py-1 text-[13px] font-bold ${
                      page === pageNum
                        ? 'bg-[#0088CC] text-white'
                        : 'border border-gray-200 text-gray-600 bg-white hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button 
              disabled={page === pagination.totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-gray-200 text-gray-600 text-[11px] bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next »
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentBets;