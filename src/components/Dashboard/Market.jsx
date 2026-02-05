// src/pages/MarketAnalysisPage.jsx
import { useState } from 'react';
import Navbar from '../Dashboard/Navbar';

export default function MarketAnalysisPage() {
  const [searchEvent, setSearchEvent] = useState('');

  return (
    <>
      {/* Navbar fixed rahega */}
      {/* <Navbar /> */}

      {/* Content navbar ke niche */}
      <div className="min-h-screen bg-gray-50  px-4 sm:px-6 pb-12">
        <div className="max-w-full mx-auto">
          {/* Main Card / Container */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            {/* Top Header */}
            <div className="bg-[#0088CC] text-white px-6 py-3 flex items-center justify-between">
              <h1 className="text-xl font-bold">Market Analysis</h1>
              <span className="text-lg cursor-pointer">↻</span> {/* Refresh icon jaise screenshot mein */}
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search Event"
                  value={searchEvent}
                  onChange={(e) => setSearchEvent(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0088CC]/60 focus:border-[#0088CC]"
                />
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m21 21-5.2-5.2m1.7-4.8a7 7 0 1 0-14 0 7 7 0 0 0 14 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Blank / Gradient Area (screenshot jaisa empty feel) */}
            <div className="h-[60vh] bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
              <p className="text-gray-500 text-lg italic">
                {/* Yahan future mein chart ya content aayega */}
                Market Analysis loading... (or empty state)
              </p>
            </div>

            {/* Bottom Pagination/Indicator (screenshot mein right side arrow) */}
            <div className="p-4 flex justify-end">
              <button className="text-gray-600 hover:text-[#0088CC] text-xl">
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}