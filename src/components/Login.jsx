import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import myLogo from '../../src/assets/image/dev_logo.png'; 

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Updated payload: Mapping 'username' from form to 'client_name' for API
      const response = await axios.post('http://localhost:3000/api/users/user-login', {
        client_name: formData.username, 
        password: formData.password
      });

      // 2. Check for success based on your API structure
      if (response.data.success) {
        console.log('Login Success:', response.data.message);
        
        // 3. Store the Token
        if (response.data.token) {
          localStorage.setItem('adminToken', response.data.token);
        }

        // 4. Optional: Store user info (like role or name) if needed elsewhere
        localStorage.setItem('userRole', response.data.data.account_type);
        localStorage.setItem('userName', response.data.data.full_name);

        // 5. Success Alert and Redirect
        alert("Login Successful!");
        navigate('/'); 
      }

    } catch (err) {
      // Handles 401 (Invalid creds) or 500 (Server error)
      const message = err.response?.data?.message || 'Invalid credentials or Server Error.';
      setError(message);
      console.error("Login Error Details:", err.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0288d1] to-[#01579b] font-sans p-4">
      
      <div className="mb-6">
        <img 
          src={myLogo} 
          alt="Logo" 
          className="h-20 w-auto object-contain"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=Your+Logo'; }} 
        />
      </div>

      <div className="bg-white w-full max-w-md rounded-md shadow-2xl overflow-hidden p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-[#0288d1] text-2xl font-bold flex items-center justify-center gap-2 text-uppercase">
            Login
          </h2>
        </div>

        {/* Error Message Display */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded border border-red-200 text-center font-medium">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Username Input */}
          <div className="flex border border-gray-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-blue-400">
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Client Name / Username"
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
            <div className="bg-gray-100 px-3 flex items-center border-l border-gray-300">
              <span className="text-gray-500 text-lg">👤</span>
            </div>
          </div>

          {/* Password Input */}
          <div className="flex border border-gray-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-blue-400">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
            <div className="bg-gray-100 px-3 flex items-center border-l border-gray-300">
              <span className="text-gray-500 text-lg">🔑</span>
            </div>
          </div>

          {/* Login Button */}
          <button 
            type="submit"
            disabled={loading}
            className={`w-full bg-[#0288d1] hover:bg-[#0277bd] text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-colors uppercase text-sm mt-6 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Authenticating...' : 'Login'} <span>➜</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;