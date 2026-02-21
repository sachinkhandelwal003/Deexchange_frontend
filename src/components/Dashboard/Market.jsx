import { useState, useEffect } from 'react';
import axios from 'axios';

export default function MarketAnalysisPage() {
  const [searchEvent, setSearchEvent] = useState('');
  const [marketData, setMarketData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchAnalysis = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/admin/match-analysis', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMarketData(response.data.data); //
      }
    } catch (err) {
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const filteredMatches = Object.keys(marketData).filter(matchName =>
    matchName.toLowerCase().includes(searchEvent.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f4f6f9] p-2 sm:p-4 font-sans">
      <div className="max-w-full mx-auto bg-white shadow-md border border-gray-200">
        
        {/* Main Header Bar */}
        <div className="flex items-center justify-between p-3 border-b bg-white">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-700">Market Analysis</h1>
            <button onClick={fetchAnalysis} className="text-xl text-gray-500 hover:text-blue-500">↻</button>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Event"
              value={searchEvent}
              onChange={(e) => setSearchEvent(e.target.value)}
              className="border border-gray-300 rounded-sm px-3 py-1.5 w-48 sm:w-64 outline-none text-sm focus:border-blue-400"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3 space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500 font-bold">Loading...</div>
          ) : filteredMatches.length > 0 ? (
            filteredMatches.map((matchName) => {
              const matchBets = marketData[matchName];
              
              return (
                <div key={matchName} className="border border-gray-400 rounded-sm shadow-sm overflow-hidden bg-white mb-4">
                  {/* Dark Header Bar (Image 9a783a logic) */}
                  <div className="bg-[#343a40] text-white px-3 py-1.5 flex justify-between items-center font-bold">
                    <span className="text-[14px]">{matchName}</span>
                    <span className="text-[12px]">11/02/2026 15:00:00</span>
                  </div>

                  <div className="p-1">
                    {/* Sub Header Bar */}
                    <div className="bg-[#efeff5] px-4 py-1.5 text-[#6f42c1] font-bold border border-gray-200 text-[12px]">
                      NORMAL
                    </div>

                    {/* Bhav Content (Digit exactly next to selection) */}
                    <div className="border-x border-b border-gray-200">
                      {matchBets.map((bet) => (
                        <div key={bet._id} className="px-4 py-2 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                          {/* Yahan Digit aur Name ek saath hain */}
                          <div className="flex items-baseline gap-4">
                            <span className="text-[#555] font-medium text-[13px]">
                              6 over run bhav {bet.selection_id}
                            </span>
                            
                            {/* Bhav Digit - side mein bold */}
                            <span className="font-bold text-[#777] text-[14px]">
                              {parseFloat(bet.odds).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-400 italic">No records found.</div>
          )}
        </div>
      </div>
    </div>
  );
}