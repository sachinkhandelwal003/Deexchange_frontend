import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import myLogo from "../../src/assets/image/dev_logo.png";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // 🔹 Auto Redirect if already logged in
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("userToken");

    if (adminToken) {
      navigate("/admin");
    } else if (userToken) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://devexchangee.in/api/api/users/user-login",
        {
          client_name: formData.username,
          password: formData.password,
        }
      );

      if (response.data.success) {
        const token = response.data.token;
        const role = response.data.data.account_type; // admin or user
        const fullName = response.data.data.full_name;

        // 🔹 Clear old tokens
        localStorage.removeItem("adminToken");
        localStorage.removeItem("userToken");

        if (role === "admin") {
          localStorage.setItem("adminToken", token);
          navigate("/admin");
        } else {
          localStorage.setItem("userToken", token);
          navigate("/");
        }

        localStorage.setItem("userRole", role);
        localStorage.setItem("userName", fullName);

        alert("Login Successful!");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Invalid credentials or Server Error.";
      setError(message);
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
        />
      </div>

      <div className="bg-white w-full max-w-md rounded-md shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-8">
          <h2 className="text-[#0288d1] text-2xl font-bold">Login</h2>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-600 text-sm rounded text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="text"
            name="username"
            required
            value={formData.username}
            onChange={handleChange}
            placeholder="Client Name / Username"
            className="w-full border border-gray-300 px-4 py-3 rounded text-sm outline-none"
          />

          <input
            type="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-gray-300 px-4 py-3 rounded text-sm outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#0288d1] hover:bg-[#0277bd] text-white font-bold py-3 rounded uppercase text-sm ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
