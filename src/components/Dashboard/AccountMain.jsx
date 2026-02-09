import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AccountList() {
  const navigate = useNavigate();
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  // --- States ---
  const [modalType, setModalType] = useState(null); 
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [adminProfile, setAdminProfile] = useState({ client_name: 'Admin', pts: 0 });

  // --- API Data States ---
  const [apiBalances, setApiBalances] = useState({ admin_current_balance: 0, user_current_balance: 0 });
  const [exposureData, setExposureData] = useState({ exposure_limit: 0 });

  // --- Form States ---
  const [formData, setFormData] = useState({
    amount: '', remark: '', password: '', 
    newLimit: '', newCredit: '', newPass: '', confirmPass: '',
    userActive: true, betActive: true
  });

  // Real-time Search
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => { fetchUsers(); }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, entriesPerPage, searchTerm]);

  useEffect(() => { fetchAdminProfile(); }, []);

  const fetchAdminProfile = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/users/get-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) setAdminProfile(response.data.data);
    } catch (err) { console.error("Profile Fetch Error:", err); }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const url = `http://localhost:3000/api/users/get-all-users?page=${currentPage}&limit=${entriesPerPage}&search=${searchTerm}`;
      const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success) {
        setAccounts(response.data.data);
        setTotalEntries(response.data.total);
      }
    } catch (error) { console.error("Error fetching users:", error); } finally { setLoading(false); }
  };

  // --- API CALLS FOR MODALS ---
  const fetchBalanceData = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/admin/get-admin-user-balance?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === "success") setApiBalances(response.data.data);
    } catch (err) { console.error("Balance API Error:", err); }
  };

  const fetchExposureLimit = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/admin/get-user-exposure-limit?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === "success") setExposureData({ exposure_limit: response.data.data.exposure_limit });
    } catch (err) { console.error("Exposure API Error:", err); }
  };

  const fetchUserStatus = async (userId) => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/admin/get-user-statuses?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.status === "success") {
        setFormData(prev => ({
          ...prev,
          userActive: response.data.data.is_active,
          betActive: response.data.data.can_bet
        }));
      }
    } catch (err) { console.error("Status API Error:", err); }
  };

  // --- UPDATED SUBMIT LOGIC ---
  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      let url = '';
      let payload = { user_id: selectedAccount._id };

      if (modalType === 'D' || modalType === 'W') {
        url = modalType === 'D' 
          ? 'http://localhost:3000/api/admin/make-deposit-transaction' 
          : 'http://localhost:3000/api/admin/make-withdraw-transaction';
        payload.password = formData.password;
        payload.amount = Number(formData.amount);
        payload.remark = formData.remark;
      } 
      else if (modalType === 'L') {
        url = 'http://localhost:3000/api/admin/set-exposure-limit';
        payload.transaction_password = formData.password;
        payload.old_exposure_limit = Number(exposureData.exposure_limit);
        payload.new_exposure_limit = Number(formData.newLimit);
      }
      else if (modalType === 'C') {
        url = 'http://localhost:3000/api/admin/update-credit-reference';
        payload.transaction_password = formData.password;
        payload.old_credit = Number(selectedAccount.credit_ref || 0);
        payload.new_credit = Number(formData.newCredit);
      }
      else if (modalType === 'P') {
        url = 'http://localhost:3000/api/admin/change-users-password';
        payload.transaction_password = formData.password;
        payload.new_password = formData.newPass;
      }

      if(!url) return;

      const response = await axios.post(url, payload, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data.success || response.data.status === 'success') {
        alert("Updated Successfully");
        closeModal();
        fetchUsers();
      }
    } catch (err) { alert(err.response?.data?.message || "Submit Failed"); }
  };

  const openModal = (type, acc) => {
    setSelectedAccount(acc);
    setModalType(type);
    setFormData({
      amount: '', remark: '', password: '', 
      newLimit: '', newCredit: '', newPass: '', confirmPass: '',
      userActive: true, betActive: true 
    });

    if (type === 'D' || type === 'W') fetchBalanceData(acc._id);
    else if (type === 'L') fetchExposureLimit(acc._id);
    else if (type === 'S') fetchUserStatus(acc._id);
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedAccount(null);
    setApiBalances({ admin_current_balance: 0, user_current_balance: 0 });
    setExposureData({ exposure_limit: 0 });
  };

  // --- CALCULATION LOGIC ---
  const inputAmt = parseFloat(formData.amount) || 0;
  const CONSTANT_VAL = 0.62;
  
  // Admin calculation: Admin Balance - 0.62 - Input
  let adminFinal = apiBalances.admin_current_balance - CONSTANT_VAL - inputAmt;
  // User calculation: 0.62 + Input
  let userFinal = CONSTANT_VAL + inputAmt;

  return (
    <div className="w-full pt-0 px-0 bg-white font-sans relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 p-2">
        <h1 className="text-2xl font-bold text-[#222]">Account List</h1>
        <Link to="/add-account" className="bg-[#0088CC] text-white px-6 py-2 rounded-md font-bold text-xs shadow-md">+ Add Account</Link>
      </div>

      <div className="bg-white border border-gray-300 overflow-hidden mx-2 shadow-sm">
        <div className="p-4 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-6">
          <div className="flex gap-4">
            <button className="bg-[#E11D48] text-white px-10 py-3 rounded text-sm font-black uppercase shadow-lg">PDF</button>
            <button className="bg-[#16A34A] text-white px-10 py-3 rounded text-sm font-black uppercase shadow-lg">Excel</button>
          </div>
          <div className="flex items-center gap-8">
            <div className="text-sm font-bold text-gray-800 flex items-center gap-3">
              Show <select value={entriesPerPage} onChange={(e) => {setEntriesPerPage(Number(e.target.value)); setCurrentPage(1);}} className="border-2 border-gray-400 rounded-lg px-4 py-2 outline-none cursor-pointer">
                <option value="10">10</option><option value="25">25</option><option value="50">50</option>
              </select> 
            </div>
            <div className="flex gap-3">
              <input type="text" value={searchTerm} onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}} className="border-2 border-gray-400 rounded-lg px-6 py-2.5 text-sm outline-none w-72 focus:border-[#0088CC] font-medium" placeholder="Search Client Name..." />
              <button onClick={fetchUsers} className="bg-[#0088CC] text-white px-8 py-2.5 rounded-lg text-sm font-black shadow-lg">LOAD</button>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <table className="w-full text-[13px] text-left border-collapse">
            <thead className="bg-[#f0f0f0] border-b-2 border-gray-300">
              <tr className="text-black uppercase font-bold">
                <th className="px-4 py-3 border-r border-gray-300">User Name</th>
                <th className="px-4 py-3 border-r border-gray-300 text-right">Credit Reference</th>
                <th className="px-2 py-3 border-r border-gray-300 text-center">U st</th>
                <th className="px-2 py-3 border-r border-gray-300 text-center">B st</th>
                <th className="px-4 py-3 border-r border-gray-300 text-center">Exposure</th>
                <th className="px-4 py-3 border-r border-gray-300 text-center">Default (%)</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="py-12 text-center text-gray-500 font-black">SEARCHING...</td></tr>
              ) : (
                accounts.map((acc) => (
                  <tr key={acc._id} className="hover:bg-blue-50/40 border-b border-gray-200 transition-colors">
                    <td className="px-4 py-2 border-r border-gray-300">
                      <span className="bg-[#111] text-white px-3 py-1.5 rounded-[4px] text-[11px] font-black uppercase inline-block shadow-md tracking-tighter">{acc.client_name}</span>
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300 text-right font-black text-gray-900">{(acc.credit_ref || 0).toLocaleString()}</td>
                    <td className="px-2 py-2 border-r border-gray-300 text-center">
                      <div className="w-6 h-6 bg-black flex items-center justify-center rounded-[3px] mx-auto shadow-inner border border-gray-700">
                        <span className="text-[#00FF00] text-[14px] font-black">✔</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 border-r border-gray-300 text-center">
                      <div className="w-6 h-6 bg-black flex items-center justify-center rounded-[3px] mx-auto shadow-inner border border-gray-700">
                        <span className="text-[#00FF00] text-[14px] font-black">✔</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300 text-center font-bold">
                      {acc.exposure_limit || 0}
                    </td>
                    <td className="px-4 py-2 border-r border-gray-300 text-center font-bold">{acc.defaultPercent || 0}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                        <div className="flex gap-1.5">
                            {['D', 'W', 'L', 'C', 'P', 'S'].map(btn => (
                              <button key={btn} onClick={() => openModal(btn, acc)} className="w-8 h-7 bg-[#111] text-white rounded-[3px] text-[12px] font-black uppercase shadow-md active:bg-black transition-all">{btn}</button>
                            ))}
                        </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[999] p-4 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-[550px] relative overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-xl font-medium text-gray-700">
                {modalType === 'D' && 'Deposit'} {modalType === 'W' && 'Withdraw'} 
                {modalType === 'L' && 'Exposure Limit'} {modalType === 'C' && 'Credit Reference'} 
                {modalType === 'P' && 'Password'} {modalType === 'S' && 'Change Status'}
              </h2>
              <button onClick={closeModal} className="bg-[#0088CC] rounded-full p-1 shadow-md hover:bg-red-500 transition-colors">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="px-10 py-6 space-y-5">
              {(modalType === 'D' || modalType === 'W') && (
                <>
                  <div className="flex items-center gap-10">
                    <label className="w-24 text-[15px] text-gray-800 capitalize font-medium">{adminProfile.client_name}</label>
                    <div className="flex-1 flex gap-4">
                      <input disabled value={apiBalances.admin_current_balance} className="w-full bg-[#E5E7EB] border border-gray-400 p-2 text-right font-bold text-gray-600" />
                      <input disabled value={adminFinal.toFixed(2)} className="w-full bg-[#E5E7EB] border border-gray-400 p-2 text-right font-bold text-red-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <label className="w-24 text-[15px] text-gray-800 capitalize font-medium">{selectedAccount?.client_name}</label>
                    <div className="flex-1 flex gap-4">
                      <input disabled value={CONSTANT_VAL} className="w-full bg-[#E5E7EB] border border-gray-400 p-2 text-right font-bold text-gray-600" />
                      <input disabled value={userFinal.toFixed(2)} className="w-full bg-[#E5E7EB] border border-gray-400 p-2 text-right font-bold text-green-600" />
                    </div>
                  </div>
                  <div className="flex items-center gap-10">
                    <label className="w-24 text-[15px] text-gray-800">Amount</label>
                    <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="flex-1 bg-[#F0F7FF] border border-[#B8D1F3] p-2 outline-none font-bold text-blue-700" />
                  </div>
                </>
              )}

              {modalType === 'L' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-10"><label className="w-24 text-[15px] text-gray-800">Old Limit</label><input disabled value={exposureData.exposure_limit} className="flex-1 bg-[#E5E7EB] border border-gray-400 p-2 text-right font-bold" /></div>
                  <div className="flex items-center gap-10"><label className="w-24 text-[15px] text-gray-800">New Limit</label><input type="number" value={formData.newLimit} onChange={(e) => setFormData({...formData, newLimit: e.target.value})} className="flex-1 bg-[#F0F7FF] border border-[#B8D1F3] p-2 outline-none font-bold" /></div>
                </div>
              )}

              {modalType === 'C' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-10"><label className="w-24 text-[15px] text-gray-800">Old Credit</label><input disabled value={selectedAccount?.credit_ref || 0} className="flex-1 bg-[#E5E7EB] border border-gray-400 p-2 text-right font-bold" /></div>
                  <div className="flex items-center gap-10"><label className="w-24 text-[15px] text-gray-800">New Credit</label><input type="number" value={formData.newCredit} onChange={(e) => setFormData({...formData, newCredit: e.target.value})} className="flex-1 bg-[#F0F7FF] border border-[#B8D1F3] p-2 outline-none font-bold" /></div>
                </div>
              )}

              {modalType === 'P' && (
                <div className="flex items-center gap-10">
                  <label className="w-24 text-[15px] text-gray-800">New Pass</label>
                  <input type="password" value={formData.newPass} onChange={(e) => setFormData({...formData, newPass: e.target.value})} className="flex-1 border border-gray-300 p-2 outline-none" placeholder="Enter New Password" />
                </div>
              )}

              {modalType === 'S' && (
                <div className="text-center space-y-8 py-4">
                  <div className="text-left text-[#E67E22] font-bold text-lg mb-4">{selectedAccount?.client_name}</div>
                  <div className="flex justify-around items-center">
                    <div className="space-y-2 text-center">
                      <div className="text-gray-700 font-medium mb-1">User Active</div>
                      <button onClick={() => setFormData({...formData, userActive: !formData.userActive})} className={`w-16 h-7 rounded-full relative transition-colors ${formData.userActive ? 'bg-[#0088CC]' : 'bg-gray-400'}`}>
                        <span className={`absolute top-1 left-2 text-[10px] font-bold text-white transition-opacity ${formData.userActive ? 'opacity-100' : 'opacity-0'}`}>ON</span>
                        <div className={`absolute top-1 bg-[#333] w-5 h-5 rounded-full transition-transform ${formData.userActive ? 'translate-x-9' : 'translate-x-1'}`}></div>
                      </button>
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="text-gray-700 font-medium mb-1">Bet Active</div>
                      <button onClick={() => setFormData({...formData, betActive: !formData.betActive})} className={`w-16 h-7 rounded-full relative transition-colors ${formData.betActive ? 'bg-[#0088CC]' : 'bg-gray-400'}`}>
                        <span className={`absolute top-1 left-2 text-[10px] font-bold text-white transition-opacity ${formData.betActive ? 'opacity-100' : 'opacity-0'}`}>ON</span>
                        <div className={`absolute top-1 bg-[#333] w-5 h-5 rounded-full transition-transform ${formData.betActive ? 'translate-x-9' : 'translate-x-1'}`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {modalType !== 'P' && modalType !== 'S' && (
                <div className="flex items-center gap-10">
                  <label className="w-24 text-[15px] text-gray-800">Remark</label>
                  <textarea rows="3" value={formData.remark} onChange={(e) => setFormData({...formData, remark: e.target.value})} className="flex-1 border border-gray-300 p-2 outline-none resize-none" />
                </div>
              )}
              <div className="flex items-center gap-10">
                <label className="w-24 text-[15px] text-gray-800">Transaction Password</label>
                <input type="password" placeholder="********" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="flex-1 border border-gray-300 p-2 outline-none" />
              </div>
            </div>

            <div className="p-6 flex justify-end gap-3 border-t bg-gray-50">
              <button onClick={closeModal} className="bg-[#2C3E50] text-white px-5 py-2 flex items-center gap-2 rounded text-[14px] font-medium uppercase shadow-md transition hover:bg-black">BACK</button>
              <button onClick={handleSubmit} className="bg-[#0088CC] text-white px-5 py-2 rounded text-[14px] font-medium uppercase shadow-md transition hover:bg-[#0070b0]">submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}