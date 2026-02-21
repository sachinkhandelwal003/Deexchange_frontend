import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/UserContext";
// Professional SVG Icons (No more monkeys 🙈)
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);

const EyeSlashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
);

export default function AddAccountPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [showPwd, setShowPwd] = useState(false);
  const [showRetypePwd, setShowRetypePwd] = useState(false);
  const [showTxnPwd, setShowTxnPwd] = useState(false);
const { user } = useAuth();
  const [formData, setFormData] = useState({
    clientName: '',
    userPassword: '',
    retypePassword: '',
    fullName: '',
    city: '',
    phone: '',
    accountType: 'user',
    creditReference: '',
    transactionPassword: '',
    commUpline: 0,
    commDownline: 0,
    commOur: 0,
    partUpline: 0,
    partDownline: 0,
    partOur: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.userPassword !== formData.retypePassword) {
      setError("Passwords do not match!");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        client_name: formData.clientName,
        password: formData.userPassword,
        full_name: formData.fullName,
        city: formData.city,
        phone_number: formData.phone,
        account_type: formData.accountType,
        credit_ref: Number(formData.creditReference),
        comission_setting_upline: Number(formData.commUpline),
        comission_setting_downline: Number(formData.commDownline),
        comission_setting_our: Number(formData.commOur),
        partnership_upline: Number(formData.partUpline),
        partnership_downline: Number(formData.partDownline),
        partnership_our: Number(formData.partOur),
        transaction_password: formData.transactionPassword,
          created_by_id: user?._id

      };
      const response = await axios.post('https://devexchangee.in/api/api/users/create-user', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) alert("Account Created Successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Server Error: Check unique username");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-4 px-4 pb-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg border border-gray-300 shadow-sm overflow-hidden">
        
        {/* Header - Compact */}
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
          <h1 className="text-xl font-bold text-gray-800 uppercase tracking-tight">Add Account</h1>
          {error && <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded border border-red-200 animate-pulse">⚠️ {error}</span>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-x divide-gray-200 border-b border-gray-200">
            
            {/* LEFT: Personal Detail */}
            <div className="p-4">
              <h2 className="bg-[#003366] text-white px-3 py-1.5 text-xs font-bold uppercase mb-4 -mx-4 -mt-4">Personal Detail</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Client Name</label>
                  <input type="text" name="clientName" required value={formData.clientName} onChange={handleChange} placeholder="Username" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#0088CC]" />
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">User Password</label>
                  <input type={showPwd ? "text" : "password"} name="userPassword" required value={formData.userPassword} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600 transition-colors">{showPwd ? <EyeSlashIcon /> : <EyeIcon />}</button>
                </div>

                <div className="relative">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Retype Password</label>
                  <input type={showRetypePwd ? "text" : "password"} name="retypePassword" required value={formData.retypePassword} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                  <button type="button" onClick={() => setShowRetypePwd(!showRetypePwd)} className="absolute right-2 bottom-2 text-gray-400 hover:text-gray-600 transition-colors">{showRetypePwd ? <EyeSlashIcon /> : <EyeIcon />}</button>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter Full Name" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                </div>
              </div>
            </div>

            {/* RIGHT: Account Detail */}
            <div className="p-4 bg-gray-50/30">
              <h2 className="bg-[#003366] text-white px-3 py-1.5 text-xs font-bold uppercase mb-4 -mx-4 -mt-4">Account Detail</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Account Type</label>
                  <select name="accountType" value={formData.accountType} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm bg-white font-medium">
{user?.account_type === "admin" && (
    <option value="agent">Agent</option>
  )}               
       <option value="user">User</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Credit Reference</label>
                  <input type="number" name="creditReference" value={formData.creditReference} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* COMMISSION & PARTNERSHIP - Compact Row */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4 border-r border-gray-200">
              <h2 className="text-xs font-black text-gray-800 uppercase mb-3 border-b border-gray-100 pb-1">Commission Settings (%)</h2>
              <div className="grid grid-cols-3 gap-2">
                <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Upline</span>
                    <input type="number" name="commUpline" value={formData.commUpline} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50/30" />
                </div>
                <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Downline</span>
                    <input type="number" name="commDownline" value={formData.commDownline} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50/30" />
                </div>
                <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Our</span>
                    <input type="number" name="commOur" value={formData.commOur} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-blue-50/30" />
                </div>
              </div>
            </div>

            <div className="p-4">
              <h2 className="text-xs font-black text-gray-800 uppercase mb-3 border-b border-gray-100 pb-1">Partnership (%)</h2>
              <div className="grid grid-cols-3 gap-2">
                <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Upline</span>
                    <input type="number" name="partUpline" value={formData.partUpline} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-orange-50/30" />
                </div>
                <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Downline</span>
                    <input type="number" name="partDownline" value={formData.partDownline} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-orange-50/30" />
                </div>
                <div>
                    <span className="text-[10px] text-gray-400 block mb-0.5">Our</span>
                    <input type="number" name="partOur" value={formData.partOur} onChange={handleChange} className="w-full border border-gray-300 rounded px-2 py-1 text-sm bg-orange-50/30" />
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER: Fixed at bottom of card */}
          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center bg-gray-50 gap-4">
            <div className="relative w-full sm:w-72">
              <label className="block text-[10px] font-bold text-red-500 uppercase mb-0.5">Transaction Password *</label>
              <input 
                type={showTxnPwd ? "text" : "password"} 
                name="transactionPassword" 
                required 
                value={formData.transactionPassword} 
                onChange={handleChange} 
                placeholder="Required to create" 
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
              />
              <button type="button" onClick={() => setShowTxnPwd(!showTxnPwd)} className="absolute right-3 bottom-2.5 text-gray-400">{showTxnPwd ? <EyeSlashIcon /> : <EyeIcon />}</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full sm:w-auto bg-[#0088CC] hover:bg-[#006699] text-white px-12 py-2.5 rounded text-sm font-bold shadow-md transition-all uppercase tracking-wider ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}