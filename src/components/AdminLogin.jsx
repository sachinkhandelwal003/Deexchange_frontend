import React, { useState } from 'react';
import axios from 'axios';
import myLogo from '../../src/assets/image/dev_logo.png'; 
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
  const navigate = useNavigate();
  // 1. State for form inputs
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 2. Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. API Integration Logic
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/users/admin-login', {
        username: formData.username,
        password: formData.password
      });

      // Handle Success (e.g., save token, redirect)
      console.log('Login Success:', response.data);
      alert('Login Successful!');
      localStorage.setItem('adminToken', response.data.token); // Save token for future use
      console.log(response.data)
      navigate('/admin'); 
      
      // Redirect to dashboard after successful login
      // Example: localStorage.setItem('token', response.data.token);
      
    } catch (err) {
      // Handle Error
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      console.error('Login Error:', err);
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
          <h2 className="text-black text-2xl font-semibold flex items-center justify-center gap-2">
            Sign In
          </h2>
          {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Username */}
          <div className="flex border border-gray-300 rounded overflow-hidden focus-within:ring-1 focus-within:ring-blue-400">
            <input
              type="text"
              name="username"
              required
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="flex-1 px-4 py-3 text-sm outline-none"
            />
            <div className="bg-gray-100 px-3 flex items-center border-l border-gray-300">
              <span className="text-gray-500 text-lg">👤</span>
            </div>
          </div>

          {/* Password */}
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
            {loading ? 'Processing...' : 'Login'} <span>➜</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;