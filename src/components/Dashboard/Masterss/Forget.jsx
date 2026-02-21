import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Password visibility states
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Check: Kya koi bhi field khali (empty) hai?
    if (!formData.oldPassword.trim() || !formData.newPassword.trim() || !formData.confirmPassword.trim()) {
      setError("Sabhi fields bharna zaroori hai! Please koi bhi field khali na chhodein.");
      return;
    }

    // 2. Check: Kya Old aur New password same hain? 
    if (formData.oldPassword === formData.newPassword) {
      setError("Naya password purane password jaisa nahi ho sakta!");
      return;
    }

    // 3. Check: Kya New aur Confirm password match kar rahe hain?
    if (formData.newPassword !== formData.confirmPassword) {
      setError("New Password aur Confirm Password match hone chahiye!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      
      // API call to change password
      const response = await axios.post('https://devexchangee.in/api/api/users/admin-change-password', {
        old_password: formData.oldPassword,
        password: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        alert("Password successfully changed!");
        setFormData({ oldPassword: '', newPassword: '', confirmPassword: '' });
        navigate('/admin'); 
      }
    } catch (err) {
      setError(err.response?.data?.message );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Header */}
      <div className="border-b border-gray-300 px-4 py-3">
        <h1 className="text-xl md:text-2xl font-normal text-[#333]">
          Change Password
        </h1>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mt-8 px-6">
        
        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm border border-red-200 rounded font-medium">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Old Password */}
          <div className="relative max-w-md">
            <label className="block text-[14px] font-bold text-[#333] mb-1">
              Old Password
            </label>
            <input 
              type={showOld ? "text" : "password"} 
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
              placeholder="Enter old password"
              className="w-full border border-gray-300 rounded-[3px] px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
            <button 
              type="button"
              onClick={() => setShowOld(!showOld)}
              className="absolute right-3 top-9 text-gray-500 hover:text-blue-500 text-sm font-medium"
            >
              {showOld ? "Hide" : "Show"}
            </button>
          </div>

          {/* New Password */}
          <div className="relative max-w-md">
            <label className="block text-[14px] font-bold text-[#333] mb-1">
              New Password
            </label>
            <input 
              type={showNew ? "text" : "password"} 
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              className="w-full border border-gray-300 rounded-[3px] px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
            <button 
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-3 top-9 text-gray-500 hover:text-blue-500 text-sm font-medium"
            >
              {showNew ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="relative max-w-md">
            <label className="block text-[14px] font-bold text-[#333] mb-1">
              Confirm Password
            </label>
            <input 
              type={showConfirm ? "text" : "password"} 
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm new password"
              className="w-full border border-gray-300 rounded-[3px] px-3 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
            />
            <button 
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-gray-500 hover:text-blue-500 text-sm font-medium"
            >
              {showConfirm ? "Hide" : "Show"}
            </button>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button 
              type="submit"
              disabled={loading}
              className={`bg-[#0088CC] text-white px-8 py-2 rounded-[4px] text-[14px] font-bold hover:bg-[#0077B3] transition-all shadow-md active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Change Password'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ChangePassword;