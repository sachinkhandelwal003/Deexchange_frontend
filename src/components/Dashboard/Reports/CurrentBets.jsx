import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CurrentBets = () => {
  const [activeTab, setActiveTab] = useState('Sports');
  const [betsData, setBetsData] = useState([]); // API data store karne ke liye
  const [loading, setLoading] = useState(false);
  
  // Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('matched'); // matched/deleted
  const [backLay, setBackLay] = useState('all'); // all/back/lay

  // API Fetch Function
  const fetchBets = async () => {
    setLoading(true);
    try {
      // Yahan aap apna full backend URL bhi daal sakte hain: http://localhost:5000/api/...
      const response = await axios.get('/api/admin/get-all-bets', {
        params: {
          page: page,
          limit: limit,
          search: search,
          filter: filter,
          back_lay: backLay
        }
      });

      if (response.data.success) {
        setBetsData(response.data.data); // data: [] wala part yahan set ho raha hai
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jab page load ho ya filters change hon, API hit hogi
  useEffect(() => {
    fetchBets();
  }, [page, limit, filter, backLay]);

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
                <input 
                  type="radio" 
                  name="status" 
                  checked={filter === 'matched'} 
                  onChange={() => setFilter('matched')}
                  className="accent-[#0088CC] w-4 h-4" 
                /> Matched
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer text-gray-600">
                <input 
                  type="radio" 
                  name="status" 
                  checked={filter === 'deleted'} 
                  onChange={() => setFilter('deleted')}
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
                    onChange={() => setBackLay(t)}
                    className="accent-[#0088CC] w-4 h-4" 
                  /> {t}
                </label>
              ))}
            </div>

            {/* Load Button */}
            <button 
              onClick={fetchBets}
              className="bg-[#0088CC] text-white px-5 py-1.5 rounded-[4px] text-[14px] font-bold hover:bg-[#0077B3] transition-colors shadow-sm"
            >
              {loading ? '...' : 'Load'}
            </button>
          </div>

          {/* Stats Info */}
          <div className="text-[14px] font-bold text-[#333]">
            Total Soda: {betsData.length} | Total Amount: {betsData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0).toFixed(2)}
          </div>
        </div>

        {/* Table Controls */}
        <div className="flex justify-between items-center mb-4 px-1">
          <div className="text-[13px]">
            Show 
            <select 
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
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
              onKeyDown={(e) => e.key === 'Enter' && fetchBets()}
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
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan="8" className="p-8 text-center text-blue-500">Loading Data...</td></tr>
              ) : betsData.length > 0 ? (
                betsData.map((bet, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="p-2 text-[13px] border-r border-gray-100">{bet.eventType || 'N/A'}</td>
                    <td className="p-2 text-[13px] border-r border-gray-100 text-center">{bet.eventName || 'N/A'}</td>
                    <td className="p-2 text-[13px] border-r border-gray-100 text-center">{bet.userName || 'N/A'}</td>
                    <td className="p-2 text-[13px] border-r border-gray-100 text-center">{bet.marketName || 'N/A'}</td>
                    <td className="p-2 text-[13px] border-r border-gray-100 text-center">{bet.nation || 'N/A'}</td>
                    <td className="p-2 text-[13px] border-r border-gray-100 text-center">{bet.rate || '0'}</td>
                    <td className={`p-2 text-[13px] border-r border-gray-100 text-center font-bold ${bet.type === 'back' ? 'text-blue-600' : 'text-pink-600'}`}>
                      {bet.amount || '0.00'}
                    </td>
                    <td className="p-2 text-[13px] text-center">
                      {bet.placeDate ? new Date(bet.placeDate).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="bg-[#f2f4f6]">
                  <td colSpan="8" className="p-4 text-center text-[13px] text-gray-500 italic">
                    No data available in table
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Section */}
        <div className="flex justify-end mt-4 items-center gap-[2px]">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className="px-3 py-1 border border-gray-200 text-gray-400 text-[11px] bg-white hover:bg-gray-100 disabled:opacity-50"
          >
            « Previous
          </button>
          <button className="px-4 py-1.5 bg-[#0088CC] text-white text-[13px] font-bold">{page}</button>
          <button 
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border border-gray-200 text-gray-400 text-[11px] bg-white hover:bg-gray-100"
          >
            Next »
          </button>
        </div>
      </div>
    </div>
  );
};

export default CurrentBets;