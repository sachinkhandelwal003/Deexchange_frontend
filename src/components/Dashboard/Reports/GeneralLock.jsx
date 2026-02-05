import React, { useState } from 'react';

const GeneralLock = () => {
  const [entries, setEntries] = useState(25);

  return (
    <div className="p-0 m-0 bg-white min-h-screen font-sans text-gray-800">
      
      {/* Main Container - Full Width */}
      <div className="w-full border-b border-gray-200">
        
        {/* Title Header */}
        <div className="p-4 bg-white border-b border-gray-100">
          <h1 className="text-xl font-semibold text-slate-800">General Lock</h1>
        </div>

        {/* Filter Section */}
        <div className="p-4">
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <input 
              type="text" 
              placeholder="Search By Client Name"
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-64 h-10 shadow-sm"
            />
            
            <input 
              type="text" 
              placeholder="Transaction Code"
              className="border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none w-64 h-10 shadow-sm"
            />
            
            <button className="bg-[#0086C1] hover:bg-blue-600 text-white px-6 rounded-sm text-sm font-medium transition-colors h-10 shadow-sm">
              Load
            </button>

            <button className="bg-[#E8F1F8] hover:bg-gray-200 text-[#0086C1] px-6 rounded-sm text-sm font-medium transition-colors h-10 shadow-sm">
              Reset
            </button>
          </div>

   
        </div>
      </div>
    </div>
  );
};

export default GeneralLock;