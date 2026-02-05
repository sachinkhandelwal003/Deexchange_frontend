import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function AccountList() {
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination States (Backend values se sync karne ke liye)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);

  // Jab page, limit ya search badle, tab API call ho
  useEffect(() => {
    fetchUsers();
  }, [currentPage, entriesPerPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      // API URL with Query Parameters
      const url = `http://localhost:3000/api/users/get-all-users?page=${currentPage}&limit=${entriesPerPage}&search=${searchTerm}`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setAccounts(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalEntries(response.data.total); // Backend ke total entries
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Search Load handler
  const handleSearchLoad = () => {
    setCurrentPage(1); // Search par hamesha page 1 se start karein
    fetchUsers();
  };

  const handleReset = () => {
    setSearchTerm('');
    setCurrentPage(1);
    // setTimeout isliye taaki state update ho jaye reset button click par
    setTimeout(() => fetchUsers(), 10); 
  };

  return (
    <div className="w-full pt-0 px-0 bg-white-gray-100 ">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 ">
        <h1 className="text-3xl font-bold text-gray-800">Account List</h1>
        <Link
          to="/add-account"
          className="w-full sm:w-auto text-center bg-[#0088CC] hover:bg-[#0070b0] text-white px-6 py-2.5 rounded-md font-medium shadow transition"
        >
          + Add Account
        </Link>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Controls row */}
        <div className="p-4 border-b flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex gap-2 w-full lg:w-auto">
            <button className="flex-1 lg:flex-none justify-center flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm font-medium transition">
              PDF
            </button>
            <button className="flex-1 lg:flex-none justify-center flex items-center gap-1.5 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm font-medium transition">
              Excel
            </button>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Show</span>
              <select
                value={entriesPerPage}
                onChange={(e) => {
                  setEntriesPerPage(Number(e.target.value));
                  setCurrentPage(1); // Limit badalne par page 1 par jayein
                }}
                className="border border-gray-300 rounded px-2 py-1 outline-none"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
              <span>entries</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchLoad()} // Enter press par bhi search ho
                className="w-full sm:w-64 border border-gray-300 rounded px-3 py-1.5 text-sm outline-none"
              />
              <div className="flex gap-2 w-full sm:w-auto">
                <button onClick={handleSearchLoad} className="flex-1 bg-[#0088CC] text-white px-4 py-1.5 rounded text-sm font-medium">
                  Load
                </button>
                <button onClick={handleReset} className="flex-1 bg-gray-200 text-gray-700 px-4 py-1.5 rounded text-sm font-medium">
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {["User Name", "Credit Ref", "Full Name", "City", "Phone", "A/C Type", "Partnership (%)", "Action"].map((head) => (
                  <th key={head} className="px-4 py-3 font-semibold text-gray-600 uppercase text-[11px] tracking-wider whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 bg-white italic">
                    Loading account data...
                  </td>
                </tr>
              ) : accounts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 italic bg-white">
                    No records found in the system.
                  </td>
                </tr>
              ) : (
                accounts.map((acc, i) => (
                  <tr key={acc._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {acc.client_name || acc.username}
                    </td>
                    <td className="px-4 py-3">{acc.credit_ref ?? acc.creditRef ?? 0}</td>
                    <td className="px-4 py-3">{acc.full_name || "---"}</td>
                    <td className="px-4 py-3">{acc.city || "---"}</td>
                    <td className="px-4 py-3">{acc.phone_number || "---"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${acc.account_type === 'agent' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {acc.account_type || acc.accountType}
                      </span>
                    </td>
                    <td className="px-4 py-3">{acc.partnership_our || 0}%</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                       <button className="bg-gray-100 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded text-xs transition-colors font-medium border border-blue-200">
                         Edit
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Updated Pagination Section */}
        <div className="px-5 py-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50 border-t">
          <div className="text-gray-500 text-xs sm:text-sm order-2 md:order-1">
            Showing <span className="font-semibold text-gray-800">{(currentPage - 1) * entriesPerPage + (accounts.length > 0 ? 1 : 0)}</span> to <span className="font-semibold text-gray-800">{(currentPage - 1) * entriesPerPage + accounts.length}</span> of{' '}
            <span className="font-semibold text-gray-800">{totalEntries}</span> entries
          </div>

          <div className="flex items-center gap-1 order-1 md:order-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40" 
              disabled={currentPage === 1}
            >
              «
            </button>
            <span className="px-4 py-1.5 bg-[#0088CC] text-white rounded-md font-medium shadow-sm">
              {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 border border-gray-300 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-40" 
              disabled={currentPage === totalPages || totalPages === 0}
            >
              »
            </button>
          </div>
        </div>
      </div>
    </div>  
  );
}