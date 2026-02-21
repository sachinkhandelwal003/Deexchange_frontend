import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../components/context/UserContext";

export default function BettingSlip({ matchData, selectedOdds, onClose }) {
  const { user } = useAuth();
  const [betType, setBetType] = useState(selectedOdds?.oddsType || "back");
  const [odds, setOdds] = useState(selectedOdds?.odds || "");
  const [stake, setStake] = useState("");
  const [profit, setProfit] = useState(0);
  const [liability, setLiability] = useState(0);
  const [acceptAnyOdds, setAcceptAnyOdds] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  console.log("matchData", matchData);
  console.log("selectedOdds", selectedOdds);

  // Calculate profit/liability when odds or stake changes
  useEffect(() => {
    if (!odds || !stake || stake <= 0) {
      setProfit(0);
      setLiability(0);
      return;
    }

    const oddsNum = parseFloat(odds);
    const stakeNum = parseFloat(stake);

    if (betType === "back") {
      // Back bet: profit = stake * (odds - 1)
      setProfit(stakeNum * (oddsNum - 1));
      setLiability(stakeNum); // Liability for back is the stake
    } else {
      // Lay bet: profit = stake (if lay wins), liability = stake * (odds - 1)
      setProfit(stakeNum);
      setLiability(stakeNum * (oddsNum - 1));
    }
  }, [odds, stake, betType]);

  const quickStake = (amount) => {
    setStake(amount);
  };

  // Generate market ID dynamically based on selection
  const getMarketId = () => {
    if (selectedOdds?.market === "matchodds") {
      return `MATCH_${matchData?.match_info?.match_id}`;
    } else if (selectedOdds?.market === "bookmaker") {
      return `BOOK_${matchData?.match_info?.match_id}`;
    } else if (selectedOdds?.market === "tiedmatch") {
      return `TIED_${matchData?.match_info?.match_id}`;
    } else if (selectedOdds?.question_id) {
      return `FANCY_${selectedOdds.question_id}`;
    }
    return `MARKET_${matchData?.match_info?.match_id}`;
  };

  // Generate market name dynamically
  const getMarketName = () => {
    if (selectedOdds?.market === "matchodds") {
      return "Match Odds";
    } else if (selectedOdds?.market === "bookmaker") {
      return "Bookmaker";
    } else if (selectedOdds?.market === "tiedmatch") {
      return "Tied Match";
    } else if (selectedOdds?.title) {
      return selectedOdds.title;
    }
    return selectedOdds?.market || "Unknown Market";
  };

  // Generate selection ID dynamically
  const getSelectionId = () => {
    if (selectedOdds?.team?.team_id) {
      return selectedOdds.team.team_id.toString();
    } else if (selectedOdds?.question_id) {
      return selectedOdds.question_id.toString();
    } else if (selectedOdds?.selection_id) {
      return selectedOdds.selection_id;
    }
    return `${selectedOdds?.market}_${selectedOdds?.team?.name || selectedOdds?.title}`.replace(/\s+/g, '_').toLowerCase();
  };

  // Generate selection name dynamically
  const getSelectionName = () => {
    if (selectedOdds?.team?.name) {
      return selectedOdds.team.name;
    } else if (selectedOdds?.title) {
      return selectedOdds.title;
    } else if (selectedOdds?.selection_name) {
      return selectedOdds.selection_name;
    }
    return "Unknown Selection";
  };

  // Get odds value based on bet type
  const getCurrentOdds = () => {
    if (betType === "back") {
      return selectedOdds?.back || selectedOdds?.odds;
    } else {
      return selectedOdds?.lay || selectedOdds?.odds;
    }
  };

  const handlePlaceBet = async () => {
    if (!user) {
      setError("Please login to place bet");
      return;
    }

    if (!stake || stake <= 0) {
      setError("Please enter valid stake");
      return;
    }

    if (!odds || odds <= 1) {
      setError("Invalid odds");
      return;
    }

    setPlacing(true);
    setError("");

    try {
      const adminId = user.admin_id || user._id || "6989a57c6fa1cc7c49e4ff79";
      const sportType = matchData?.match_info?.format_str?.toLowerCase() || 
                       matchData?.match_info?.competition?.type || 
                       "cricket";

      const eventId = matchData?.match_info?.match_id?.toString() || 
                     matchData?.match_info?.id?.toString() || 
                     `EVENT_${Date.now()}`;
      
      const eventName = matchData?.match_info?.title || 
                       matchData?.match_info?.short_title || 
                       "Unknown Event";

      const betData = {
        user_id: user._id,
        admin_id: adminId,
        sport_type: sportType,
        event_id: eventId,
        event_name: eventName,
        market_id: getMarketId(),
        market_name: getMarketName(),
        selection_id: getSelectionId(),
        selection_name: getSelectionName(),
        bet_type: betType,
        bet_sub_type: selectedOdds?.question_id ? "third_party" : "sport",
        odds: parseFloat(odds),
        stake: parseFloat(stake),
        match_format: matchData?.match_info?.format_str,
        competition: matchData?.match_info?.competition?.title,
        team_a: matchData?.match_info?.teama?.name,
        team_b: matchData?.match_info?.teamb?.name,
        innings: matchData?.match_info?.latest_inning_number,
        match_status: matchData?.match_info?.status_str,
        current_score: matchData?.match_info?.live,
      };

      if (selectedOdds?.question_id) {
        betData.fancy_id = selectedOdds.question_id;
        betData.fancy_title = selectedOdds.title;
        betData.back_condition = selectedOdds.back_condition;
        betData.team_batting = selectedOdds.team_batting;
      }

      if (selectedOdds?.back_volume) {
        betData.back_volume = selectedOdds.back_volume;
      }
      if (selectedOdds?.lay_volume) {
        betData.lay_volume = selectedOdds.lay_volume;
      }

      console.log("Placing bet with dynamic data:", betData);

      const response = await axios.post(
        "http://localhost:3000/api/users/make-bet",
        betData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Bet placed successfully!");
        onClose?.();
      } else {
        setError(response.data.message || "Failed to place bet");
      }
    } catch (err) {
      console.error("Bet placement error:", err);
      setError(err.response?.data?.message || err.message || "Error placing bet");
    } finally {
      setPlacing(false);
    }
  };

  // Update odds when bet type changes
 // 1️⃣ When user clicks different market price
useEffect(() => {
  if (selectedOdds) {
    setBetType(selectedOdds.oddsType || "back");
    setOdds(selectedOdds.odds || "");
    setStake("");
  }
}, [selectedOdds]);

// 2️⃣ When user manually switches back/lay toggle
useEffect(() => {
  const currentOdds = getCurrentOdds();
  if (currentOdds) {
    setOdds(currentOdds);
  }
}, [betType, selectedOdds]);

  return (
    <div className="bg-white shadow rounded overflow-hidden text-sm">
      {/* TOP BAR */}
      <div className="bg-[#2f4050] text-white px-3 py-2">
  <div className="flex justify-between items-center">
    <div>
      <div className="font-semibold text-sm">
        {matchData?.match_info?.title}
      </div>
      <div className="text-xs text-gray-300">
        {getMarketName()}
      </div>
    </div>
    <button onClick={onClose} className="text-white text-lg">✕</button>
  </div>
</div>

      {/* BET BODY */}
  <div
  className="p-3 text-xs transition-colors duration-200"
  style={{
    backgroundColor: betType === "back" ? "#72BBEF" : "#FAA9BA"
  }}
>

  {/* Header Row */}
  <div className="grid grid-cols-4 font-bold mb-1">
    <div>Bet For</div>
    <div className="text-center">Odds</div>
    <div className="text-center">Stake</div>
    <div className="text-right">
      {betType === "back" ? "Profit" : "Liability"}
    </div>
  </div>

  {/* Bet Row */}
  <div className="grid grid-cols-4 items-center gap-1 mb-2">
    <div className="text-red-700 font-bold">
      {getSelectionName()}
    </div>

    <input
      type="number"
      value={odds}
      onChange={(e) => setOdds(e.target.value)}
      className="border p-1 text-center bg-white"
    />

    <input
      type="number"
      value={stake}
      onChange={(e) => setStake(e.target.value)}
      className="border p-1 text-center bg-white"
    />

    <div className="text-right font-bold">
      ₹{(betType === "back" ? profit : liability).toFixed(0)}
    </div>
  </div>

  {/* Quick Buttons */}
  <div className="grid grid-cols-4 gap-1 mb-2">
    {[1000, 2000, 5000, 10000, 20000, 25000, 50000, 75000].map((amt) => (
      <button
        key={amt}
        onClick={() => setStake(amt)}
        className="bg-gray-300 hover:bg-gray-400 py-1"
      >
        +{amt / 1000}k
      </button>
    ))}
  </div>

  <div
    className="text-right underline cursor-pointer mb-2"
    onClick={() => setStake("")}
  >
    clear
  </div>

  {/* Buttons */}
  <div className="flex justify-between">
    <button
      onClick={() => setStake("")}
      className="bg-teal-600 text-white px-4 py-1"
    >
      Edit
    </button>

    <button
      onClick={() => setStake("")}
      className="bg-red-600 text-white px-4 py-1"
    >
      Reset
    </button>

    <button
      onClick={handlePlaceBet}
      disabled={!stake || placing}
      className="bg-green-600 text-white px-4 py-1 disabled:opacity-50"
    >
      {placing ? "Placing..." : "Submit"}
    </button>
  </div>
</div>

      {/* MY BET SECTION */}
      <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold">
        MY BETS - {getMarketName()}
      </div>

      {/* <div className="p-2">
        <select className="w-full border p-1.5 text-sm rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-300">
          <option>All Bets</option>
          <option>Matched Bets</option>
          <option>Unmatched Bets</option>
        </select>
        
        <div className="text-center text-gray-500 text-xs py-4 bg-gray-50 rounded">
          Your bets for this market will appear here
        </div>
      </div> */}
    </div>
  );
}