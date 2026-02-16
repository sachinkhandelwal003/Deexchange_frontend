import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfitLossReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // API Filters State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('profit'); // Default as per your API
  const [totalEntries, setTotalEntries] = useState(0);

  // Fetch API Function
  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://devexchangee.in/api/api/admin/get-profit-loss-reports`, {
        params: {
          page: page,
          limit: limit,
          status: status,
          search: search
        }
      });
      
      // Maan lete hain backend se response.data.data mein array hai
      if (response.data) {
        setData(response.data.data || []);
        setTotalEntries(response.data.total || 0);
      }
    } catch (error) {
      console.error("Error fetching Profit Loss data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Jab page load ho ya filters change hon
  useEffect(() => {
    fetchReports();
  }, [page, status, limit]);

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      <div className="w-full border-b border-gray-200">
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">Profit Loss</h1>
        </div>

        <div className="p-4">
          {/* Filter Section */}
          <div className="flex items-center gap-2 mb-8">
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-64 bg-white h-10"
            >
              <option value="all">All Status</option>
              <option value="profit">Profit Only</option>
              <option value="loss">Loss Only</option>
            </select>
            
            <button 
              onClick={fetchReports}
              className="bg-[#0086C1] hover:bg-blue-600 text-white px-6 rounded-sm text-sm font-medium transition-colors h-10"
            >
              {loading ? 'Loading...' : 'Load'}
            </button>
          </div>

          {/* Search Controls */}
          <div className="flex justify-between items-center mb-4 text-[13px]">
             <div className="flex items-center gap-1">
                <span>Show</span>
                <select 
                  value={limit} 
                  onChange={(e) => setLimit(e.target.value)}
                  className="border border-gray-300 rounded-sm px-1 py-1"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span>entries</span>
             </div>

            <div className="flex items-center gap-2">
              <label className="font-semibold">Search:</label>
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchReports()}
                placeholder="Search user..."
                className="border border-gray-300 rounded-sm px-3 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 w-56 h-9"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto border border-gray-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-[13px] font-bold bg-gray-50 uppercase">
                  <th className="p-3 border-r border-gray-200">No</th>
                  <th className="p-3 border-r border-gray-200">User Name</th>
                  <th className="p-3 border-r border-gray-200 text-center">Level</th>
                  <th className="p-3 border-r border-gray-200 text-center">Casino Pts</th>
                  <th className="p-3 border-r border-gray-200 text-center">Sport Pts</th>
                  <th className="p-3 border-r border-gray-200 text-center">Third Party</th>
                  <th className="p-3 text-center">Profit/Loss</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" className="p-10 text-center">Data fetch ho raha hai...</td></tr>
                ) : data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 text-[13px]">
                      <td className="p-3 border-r border-gray-200">{(page - 1) * limit + index + 1}</td>
                      <td className="p-3 border-r border-gray-200 font-medium">{item.userName || item.username}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.level || 'User'}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.casino_pts || 0}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.sport_pts || 0}</td>
                      <td className="p-3 border-r border-gray-200 text-center">{item.third_party_pts || 0}</td>
                      <td className={`p-3 text-center font-bold ${item.total_pl < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {item.total_pl || 0}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-gray-50/50">
                    <td colSpan="7" className="p-8 text-center text-gray-500 italic">
                      No data found for "{search}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-6 border-t border-gray-100 pt-4 px-2">
            <div className="text-sm text-gray-500 mb-4 sm:mb-0">
              Showing {(page-1)*limit + 1} to {Math.min(page*limit, totalEntries)} of {totalEntries} entries
            </div>

            <div className="flex items-center -space-x-px">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="px-5 py-2.5 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-l-md text-sm disabled:opacity-50"
              >
                Previous
              </button>
              
              <button className="px-6 py-2.5 border border-gray-300 bg-[#0086C1] text-white font-bold text-sm z-10">
                {page}
              </button>
              
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={data.length < limit}
                className="px-5 py-2.5 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 rounded-r-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfitLossReport;