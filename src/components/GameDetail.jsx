import { useParams } from 'react-router-dom';

export default function GameDetail() {
  const { id } = useParams();

  return (
    <div className="flex flex-col lg:flex-row gap-2 p-1">
      {/* Left Column: Markets (Matches your 2nd image) */}
      <div className="flex-1">
        <div className="bg-[#2C3E50] text-white p-2 flex justify-between items-center text-sm font-bold uppercase">
          <span>Womens Premier League (ID: {id})</span>
          <span>09/01/2026 19:30:00</span>
        </div>

        {/* Tournament Winner Section */}
        <div className="mt-1 border border-gray-300">
          <div className="bg-gray-600 text-white px-2 py-1 text-xs font-bold flex justify-between">
            <span>TOURNAMENT_WINNER</span>
            <span className="text-[#ffeb3b]">Matka</span>
          </div>
          
          <table className="w-full text-xs border-collapse">
            <thead className="bg-gray-100 text-[10px] border-b">
              <tr>
                <th className="text-left p-2">Max: 1</th>
                <th className="bg-[#7ec3f5] w-16">Back</th>
                <th className="bg-[#f7b2c4] w-16">Lay</th>
              </tr>
            </thead>
            <tbody>
              {["Mumbai Indians W", "Up Warriorz W", "Royal Challengers Bengaluru W"].map((team, idx) => (
                <tr key={idx} className="border-b bg-white">
                  <td className="p-2 font-bold">{team}</td>
                  <td className="bg-[#7ec3f5]/20 text-center p-2 font-bold">2.2</td>
                  <td className="bg-[#f7b2c4]/20 text-center p-2 font-bold">2.3</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Column: Bet Slip (Sidebar style) */}
      <div className="w-full lg:w-80">
        <div className="bg-[#2C3E50] text-white p-2 text-sm font-bold">My Bet</div>
        <div className="bg-white border border-gray-300 min-h-[100px]">
           <table className="w-full text-[10px]">
             <thead className="bg-gray-100 border-b">
               <tr>
                 <th className="text-left p-1">Matched Bet</th>
                 <th className="text-center p-1">Odds</th>
                 <th className="text-center p-1">Stake</th>
               </tr>
             </thead>
             <tbody>
               <tr className="text-center italic text-gray-400">
                 <td colSpan="3" className="py-4">No bets matched</td>
               </tr>
             </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}