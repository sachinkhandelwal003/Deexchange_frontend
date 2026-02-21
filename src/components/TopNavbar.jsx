import { useState, useRef, useEffect } from "react";
import logo from "../assets/image/dev_logo.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

export default function TopNavbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  const [creditRef, setCreditRef] = useState("Loading...");
  const [balancecreditRef, balancesetCreditRef] = useState("Loading...");

  const dropdownRef = useRef(null);
  const mobileDropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch User Profile Name
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("userToken") || localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("http://localhost:3000/api/users/get-profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          const name = response.data.data.client_name || response.data.data.full_name || "User";
          const credit = response.data.data.credit_ref;
          const currentbalance = response.data.data.current_balance;
          balancesetCreditRef(currentbalance);
          setCreditRef(credit);
          setUserName(name);
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        setUserName("Demo");
      }
    };

    fetchProfile();
  }, []);

  // Logout Function
  const handleSignOut = () => {
    localStorage.clear();
    navigate('/user/login');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (mobileDropdownRef.current && !mobileDropdownRef.current.contains(e.target)) {
        setMobileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Dropdown Menu Component (reusable for both desktop and mobile)
  const DropdownMenu = ({ isMobile = false, onClose }) => (
    <div className={`${
      isMobile ? 'absolute right-0 mt-2' : 'absolute right-0 mt-2'
    } w-48 bg-white text-black rounded shadow-lg z-50 overflow-hidden`}>
      <ul className="text-sm">
        <li className="hover:bg-gray-100 border-b bg-gray-50 px-4 py-2 font-bold text-[#2C3E50]">
          Hi, {userName}
        </li>
        <li className="hover:bg-gray-100 cursor-pointer">
          <Link 
            to="/bets/my" 
            className="block px-4 py-2" 
            onClick={() => {
              onClose();
            }}
          >
            Unsettled Bets
          </Link>
        </li>
        <li className="hover:bg-gray-100">
          <Link 
            to="/casino-results" 
            className="block px-4 py-2" 
            onClick={() => {
              onClose();
            }}
          >
            Casino Results
          </Link>
        </li>
        <li 
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => {
            // Add your set button values functionality here
            console.log("Set Button Values clicked");
            onClose();
          }}
        >
          Set Button Values
        </li>
        <li 
          onClick={() => {
            handleSignOut();
            onClose();
          }}
          className="border-t px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600 font-bold"
        >
          Sign Out
        </li>
      </ul>
    </div>
  );

  // Handle menu click to open sidebar offcanvas
  const handleMenuClick = () => {
    onMenuClick(); // This will set sidebarOpen to true in App.js
    // Prevent body scroll when sidebar is open
    document.body.style.overflow = 'hidden';
  };

  // Handle overlay click to close sidebar
  const handleOverlayClick = () => {
    onMenuClick(); // This will set sidebarOpen to false in App.js
    document.body.style.overflow = 'unset';
  };

  return (
    <nav className="bg-[#2C3E50] text-white w-full mb-1">
      <div className="px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between">
          
          {/* Left side - Logo and Menu Button */}
          <div className="flex items-center gap-2">
            <button 
              onClick={handleMenuClick} 
              className="lg:hidden text-xl font-bold hover:bg-[#34495E] px-2 py-1 rounded transition-colors focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="Dev Exchange Logo" className="h-10 md:h-12 lg:h-14" />
            </Link>
          </div>

          {/* Desktop View (lg and above) */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <div className="text-right leading-tight">
              <div className="text-gray-300">Credits: <strong className="text-white">{creditRef}</strong></div>
              <div className="text-gray-300">Balance: <strong className="text-white">{balancecreditRef}</strong></div>
            </div>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 cursor-pointer select-none font-bold bg-[#34495E] hover:bg-[#3d566e] px-3 py-1.5 rounded transition-colors min-w-[100px] justify-between"
              >
                <span className="truncate">{userName}</span>
                <span className={`text-xs transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
              </button>

              {open && <DropdownMenu onClose={() => setOpen(false)} />}
            </div>
          </div>

          {/* Mobile View (below lg) - Right side dropdown */}
          <div className="lg:hidden relative" ref={mobileDropdownRef}>
            <button
              onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
              className="flex items-center gap-1 cursor-pointer select-none font-bold bg-[#34495E] hover:bg-[#3d566e] px-3 py-1.5 rounded transition-colors min-w-[80px] justify-between"
            >
              <span className="truncate max-w-[60px]">{userName}</span>
              <span className={`text-xs transition-transform ${mobileDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>

            {mobileDropdownOpen && <DropdownMenu isMobile onClose={() => setMobileDropdownOpen(false)} />}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar - Credits and Balance */}
      <div className="lg:hidden bg-gradient-to-r from-[#007ab8] to-[#0095e0] px-3 py-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <div className="flex items-center gap-1">
              <span className="text-white/80">Balance:</span>
              <strong className="text-white">₹{balancecreditRef}</strong>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-white/80">Credits:</span>
              <strong className="text-white">₹{creditRef}</strong>
            </div>
          </div>
          {/* Quick action buttons for mobile */}
          <div className="flex gap-2">
            <Link 
              to="/bets/my" 
              className="bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-white transition-colors"
              title="My Bets"
            >
              My Bets
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Bottom Info Bar */}
      <div className="hidden lg:block bg-[#007ab8] px-4 py-1 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex gap-4">
            <span className="text-white/90">Welcome to Dev Exchange</span>
            <span className="text-white/90">|</span>
            <span className="text-white/90">24/7 Support Available</span>
          </div>
          <div className="text-white/90">
            {new Date().toLocaleDateString('en-IN', { 
              weekday: 'short', 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open - This will be handled in App.js layout */}
    </nav>
  );
}