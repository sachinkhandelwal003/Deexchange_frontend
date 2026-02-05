import { useState, useRef, useEffect } from "react";
import logo from "../assets/image/dev_logo.png";
import { Link } from 'react-router-dom';
export default function TopNavbar({ onMenuClick }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
      {/* TOP BAR */}
      <div className="px-3 sm:px-4 py-2">
        <div className="flex items-center justify-between">
          
          {/* LEFT */}
          <div className="flex items-center gap-2">
            <button
              onClick={onMenuClick}
              className="lg:hidden text-xl font-bold"
            >
              ≡
            </button>

            <img src={logo} alt="logo" className="h-18" />
          </div>

          {/* RIGHT (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 text-sm">
            <div className="text-right leading-tight">
              <div>
                Balance: <strong>1500</strong>
              </div>
              <div className="text-xs opacity-90">Exp: 0</div>
            </div>

            {/* DEMO DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 cursor-pointer select-none"
              >
                Demo
                <span className="text-xs">▼</span>
              </button>

              {open && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
                  <ul className="text-sm">
                   <li className="hover:bg-gray-100">
  <Link to="/account-statement" className="block px-4 py-2" onClick={() => setOpen(false)}>
    Account Statement
  </Link>
</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Current Bet
                    </li>
               <li className="hover:bg-gray-100">
  <Link to="/casino-results" className="block px-4 py-2" onClick={() => setOpen(false)}>
    Casino Results
  </Link>
</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      Set Button Values
                    </li>
                    <li className="border-t px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-600">
                      Sign Out
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE SECOND ROW */}
      <div className="lg:hidden bg-[#007ab8] px-3 py-1 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <span>
              Balance: <strong>1500</strong>
            </span>
            <span>Exp: 0</span>
          </div>

          {/* You can reuse same dropdown logic here if needed */}
        </div>
      </div>
    </nav>
  );
}