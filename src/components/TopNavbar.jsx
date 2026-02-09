import { useState, useRef, useEffect } from "react";
import logo from "../assets/image/dev_logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function TopNavbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState("Loading..."); // Default state
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // 1. Fetch User Profile Name
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("adminToken") || localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3000/api/users/get-profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          // Aapki API ke data structure ke hisaab se client_name ya full_name nikalein
          const name = response.data.data.client_name || response.data.data.full_name || "User";
          setUserName(name);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setUserName("Demo"); // Error hone par fallback name
      }
    };

    fetchProfile();
  }, []);

// Logout Function
const handleSignOut = () => {
  localStorage.clear(); // Saara data clear karne ke liye
  navigate('/user/login');        // Ab ye seedha home page (root) par le jaayega
};

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-[#2C3E50] text-white w-full mb-1">
      <div className="px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-2">
            <button onClick={onMenuClick} className="lg:hidden text-xl font-bold">≡</button>
            <img src={logo} alt="logo" className="h-18" />
          </div>

          <div className="hidden lg:flex items-center gap-6 text-sm">
            <div className="text-right leading-tight">
              <div>Balance: <strong>1500</strong></div>
              <div className="text-xs opacity-90">Exp: 0</div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 cursor-pointer select-none font-bold bg-[#34495E] px-3 py-1.5 rounded"
              >
                {/* Yahan 'Demo' ki jagah UserName dikhega */}
                {userName}
                <span className="text-xs">▼</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50 overflow-hidden">
                  <ul className="text-sm">
                    <li className="hover:bg-gray-100 border-b bg-gray-50 px-4 py-2 font-bold text-[#2C3E50]">
                      Hi, {userName}
                    </li>
                    <li className="hover:bg-gray-100">
                      <Link to="/account-statement" className="block px-4 py-2" onClick={() => setOpen(false)}>
                        Account Statement
                      </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Current Bet</li>
                    <li className="hover:bg-gray-100">
                      <Link to="/casino-results" className="block px-4 py-2" onClick={() => setOpen(false)}>
                        Casino Results
                      </Link>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Set Button Values</li>
                    <li 
                      onClick={handleSignOut}
                      className="border-t px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 font-bold"
                    >
                      Sign Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-[#007ab8] px-3 py-1 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <span>Balance: <strong>1500</strong></span>
            <span>Exp: 0</span>
          </div>
          {/* Mobile par bhi naam dikhane ke liye */}
          <span className="font-bold">{userName}</span>
        </div>
      </div>
    </nav>
  );
}