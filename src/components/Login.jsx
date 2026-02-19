import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import myLogo from "../../src/assets/image/dev_logo.png";
import { useAuth } from "../components/context/UserContext";

const LoginPage = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
const { fetchProfile } = useAuth();

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

  // 🔹 Normal Login
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
        processLogin(response.data);
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

  // 🔹 Demo Login
  const handleDemoLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "https://devexchangee.in/api/api/users/demo-login",
        {
          client_name: "Demo1",
          password: "Password@123",
        }
      );

      if (response.data.success) {
        processLogin(response.data);
      }
    } catch (err) {
      setError("Demo login failed.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Common Login Processor
const processLogin = async (data) => {
  const token = data.token;
  const role = data.data.account_type;

  localStorage.removeItem("adminToken");
  localStorage.removeItem("userToken");

  if (role === "admin") {
    localStorage.setItem("adminToken", token);
    navigate("/admin");
  } else {
    localStorage.setItem("userToken", token);

    // ✅ Fetch Profile After Login
    await fetchProfile(token);

    navigate("/");
  }

  localStorage.setItem("userRole", role);

  alert("Login Successful!");
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
  {/* Username */}
  <div className="relative">
    <input
      type="text"
      name="username"
      required
      value={formData.username}
      onChange={handleChange}
      placeholder="Username"
      className="w-full border border-gray-300 px-4 py-3 rounded text-sm outline-none"
    />
    <span className="absolute right-3 top-3 text-gray-500">
      <i className="fas fa-user"></i>
    </span>
  </div>

  {/* Password */}
  <div className="relative">
    <input
      type="password"
      name="password"
      required
      value={formData.password}
      onChange={handleChange}
      placeholder="Password"
      className="w-full border border-gray-300 px-4 py-3 rounded text-sm outline-none"
    />
    <span className="absolute right-3 top-3 text-gray-500">
      <i className="fas fa-key"></i>
    </span>
  </div>

  {/* Login Button */}
  <button
    type="submit"
    disabled={loading}
    className="w-full bg-[#0288d1] hover:bg-[#0277bd] text-white font-semibold py-3 rounded flex justify-center items-center gap-2"
  >
    {loading ? "Authenticating..." : "Login"}
    <span>➜</span>
  </button>

  {/* Demo Login Button */}
  <button
    type="button"
    onClick={handleDemoLogin}
    disabled={loading}
    className="w-full bg-[#0288d1] hover:bg-[#0277bd] text-white font-semibold py-3 rounded flex justify-center items-center gap-2"
  >
    {loading ? "Authenticating..." : "Login with demo ID"}
    <span>➜</span>
  </button>
</form>


       
      </div>
    </div>
  );
};

export default LoginPage;
