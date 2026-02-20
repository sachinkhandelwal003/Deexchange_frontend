import React, { useState, useEffect } from "react";
import axios from "axios";
import myLogo from "../../src/assets/image/dev_logo.png";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Redirect if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      navigate("/admin");
    }
  }, [navigate]);

  // 🔹 Handle Input Change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔹 Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://devexchangee.in/api/api/users/admin-login",
        {
          username: formData.username,
          password: formData.password,
        }
      );

      if (response.data.success) {
         const role = response.data.data.account_type;

         
  if (role === "admin" || role === "agent" || role === "admin_staff") {
    localStorage.setItem("adminToken", response.data.token);
    navigate("/admin");
  } else {
    setError("Access denied. Not an admin/agent account.");
  }
        const token = response.data.token;

        // Remove user token if exists
        localStorage.removeItem("userToken");

        // Save admin token
        localStorage.setItem("adminToken", token);

        alert("Admin Login Successful!");
        navigate("/admin");
      } else {
        setError(response.data.message || "Login failed");
      }

    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
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
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/150?text=Your+Logo";
          }}
        />
      </div>

      <div className="bg-white w-full max-w-md rounded-md shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-black text-2xl font-semibold">
            Admin Sign In
          </h2>
          {error && (
            <p className="text-red-500 text-sm mt-2 font-medium">
              {error}
            </p>
          )}
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
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
              👤
            </div>
          </div>

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
              🔑
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#0288d1] hover:bg-[#0277bd] text-white font-bold py-3 rounded transition-colors uppercase text-sm mt-6 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Processing..." : "Sign In"} ➜
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
