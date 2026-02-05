import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Icons for View/Hide
const EyeIcon = () => <span>👁️</span>;
const EyeSlashIcon = () => <span>🙈</span>;

export default function AddAccountPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Password visibility states
  const [showPwd, setShowPwd] = useState(false);
  const [showRetypePwd, setShowRetypePwd] = useState(false);
  const [showTxnPwd, setShowTxnPwd] = useState(false);

  // Saari fields ka initial state
  const [formData, setFormData] = useState({
    clientName: '',
    userPassword: '',
    retypePassword: '',
    fullName: '',
    city: '',
    phone: '',
    accountType: 'user',
    creditReference: Number,
    transactionPassword: '',
    // Commission fields
    commUpline: 0,
    commDownline: 0,
    commOur: 0,
    // Partnership fields
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
      setError("User passwords do not match!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // Backend Schema ke hisaab se payload
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
        transaction_password: formData.transactionPassword
      };

      const response = await axios.post(
        'http://localhost:3000/api/users/create-user', 
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        alert("Account Created Successfully!");
        // navigate('/'); 
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server Error: Check if username is unique");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-[60px] px-4 sm:px-6 pb-12">
      <div className="max-w-7xl mx-auto bg-white rounded-xl border border-gray-200 shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
          <h1 className="text-2xl font-bold text-gray-800">Add Account</h1>
          {error && <span className="text-red-500 font-medium text-sm bg-red-50 px-3 py-1 rounded">⚠️ {error}</span>}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-x divide-gray-200">
            
            {/* LEFT: Personal Detail */}
            <div className="p-6">
              <h2 className="bg-[#003366] text-white px-4 py-2.5 font-semibold -mx-6 -mt-6 mb-6">Personal Detail</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Client Name</label>
                  <input type="text" name="clientName" required value={formData.clientName} onChange={handleChange} placeholder="Username" className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-[#0088CC]" />
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">User Password</label>
                  <input type={showPwd ? "text" : "password"} name="userPassword" required value={formData.userPassword} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10" />
                  <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-9 text-gray-500 cursor-pointer">{showPwd ? <EyeSlashIcon /> : <EyeIcon />}</button>
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Retype Password</label>
                  <input type={showRetypePwd ? "text" : "password"} name="retypePassword" required value={formData.retypePassword} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10" />
                  <button type="button" onClick={() => setShowRetypePwd(!showRetypePwd)} className="absolute right-3 top-9 text-gray-500 cursor-pointer">{showRetypePwd ? <EyeSlashIcon /> : <EyeIcon />}</button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Enter Full Name" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="Enter City" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="9876543210" className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
              </div>
            </div>

            {/* RIGHT: Account Detail */}
            <div className="p-6">
              <h2 className="bg-[#003366] text-white px-4 py-2.5 font-semibold -mx-6 -mt-6 mb-6">Account Detail</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Type</label>
                  <select name="accountType" value={formData.accountType} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white">
                    <option value="agent">Agent</option>
                    <option value="user">User</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Credit Reference</label>
                  <input type="number" name="creditReference" value={formData.creditReference} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
                </div>
              </div>
            </div>
          </div>

          {/* COMMISSION SETTINGS */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="bg-[#003366] text-white px-4 py-2.5 font-semibold -mx-6 -mt-6 mb-6">Commission Settings (%)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Upline Commission</label>
                <input type="number" name="commUpline" value={formData.commUpline} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Downline Commission</label>
                <input type="number" name="commDownline" value={formData.commDownline} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Our Commission</label>
                <input type="number" name="commOur" value={formData.commOur} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </div>
          </div>

          {/* PARTNERSHIP SETTINGS */}
          <div className="p-6 border-t border-gray-200">
            <h2 className="bg-[#003366] text-white px-4 py-2.5 font-semibold -mx-6 -mt-6 mb-6">Partnership (%)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Upline Partnership</label>
                <input type="number" name="partUpline" value={formData.partUpline} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Downline Partnership</label>
                <input type="number" name="partDownline" value={formData.partDownline} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Our Partnership</label>
                <input type="number" name="partOur" value={formData.partOur} onChange={handleChange} className="w-full border border-gray-300 rounded-md px-3 py-2" />
              </div>
            </div>
          </div>

          {/* FOOTER: Txn Password & Button */}
          <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end items-end gap-6 bg-gray-50">
            <div className="w-full sm:w-80 relative">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Transaction Password</label>
              <input type={showTxnPwd ? "text" : "password"} name="transactionPassword" required value={formData.transactionPassword} onChange={handleChange} placeholder="Required to create" className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 focus:ring-2 focus:ring-red-400" />
              <button type="button" onClick={() => setShowTxnPwd(!showTxnPwd)} className="absolute right-3 top-9 text-gray-500 cursor-pointer">{showTxnPwd ? <EyeSlashIcon /> : <EyeIcon />}</button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`bg-[#0088CC] hover:bg-[#006699] text-white px-10 py-3 rounded-md font-medium shadow-lg transition-all min-w-[200px] ${loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}