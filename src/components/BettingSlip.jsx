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

  console.log("matchDatamatchDatamatchData" ,matchData)
    console.log("selectedOddsselectedOddsselectedOdds" ,selectedOdds)
  // console.log("matchDatamatchDatamatchData" ,matchData)

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
      return selectedOdds.title; // Use fancy title as market name
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
    // Fallback: create unique ID from name
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
      // Get admin_id from user data or use default
      const adminId = user.admin_id || user._id || "6989a57c6fa1cc7c49e4ff79";

      // Get sport type from match data
      const sportType = matchData?.match_info?.format_str?.toLowerCase() || 
                       matchData?.match_info?.competition?.type || 
                       "cricket";

      // Get event details
      const eventId = matchData?.match_info?.match_id?.toString() || 
                     matchData?.match_info?.id?.toString() || 
                     `EVENT_${Date.now()}`;
      
      const eventName = matchData?.match_info?.title || 
                       matchData?.match_info?.short_title || 
                       "Unknown Event";

      // Build bet data dynamically
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
        // Additional dynamic fields that might be useful
        match_format: matchData?.match_info?.format_str,
        competition: matchData?.match_info?.competition?.title,
        team_a: matchData?.match_info?.teama?.name,
        team_b: matchData?.match_info?.teamb?.name,
        innings: matchData?.match_info?.latest_inning_number,
        match_status: matchData?.match_info?.status_str,
        current_score: matchData?.match_info?.live,
      };

      // Add fancy-specific fields if applicable
      if (selectedOdds?.question_id) {
        betData.fancy_id = selectedOdds.question_id;
        betData.fancy_title = selectedOdds.title;
        betData.back_condition = selectedOdds.back_condition;
        betData.team_batting = selectedOdds.team_batting;
      }

      // Add volume data if available
      if (selectedOdds?.back_volume) {
        betData.back_volume = selectedOdds.back_volume;
      }
      if (selectedOdds?.lay_volume) {
        betData.lay_volume = selectedOdds.lay_volume;
      }

      console.log("Placing bet with dynamic data:", betData);

      const response = await axios.post(
        "https://devexchangee.in/api/api/users/make-bet",
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
  useEffect(() => {
    const currentOdds = getCurrentOdds();
    if (currentOdds) {
      setOdds(currentOdds);
    }
  }, [betType, selectedOdds]);

  return (
    <div className="bg-white shadow rounded overflow-hidden text-sm">
      {/* TOP BAR */}
      <div className="bg-[#2f4050] text-white px-3 py-2 flex justify-between">
        <span className="font-semibold">
          {selectedOdds ? (
            <>
              {getSelectionName()} -{" "}
              {betType === "back" ? "BACK" : "LAY"} @ {odds}
            </>
          ) : (
            "PLACE BET"
          )}
        </span>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          ✕
        </button>
      </div>

      {/* BET BODY */}
      <div className="bg-pink-300 p-3">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-3 text-xs">
            {error}
          </div>
        )}

        {/* Market Info */}
        <div className="bg-gray-100 p-2 rounded mb-3 text-xs">
          <div className="font-semibold">{getMarketName()}</div>
          <div className="text-gray-600">{matchData?.match_info?.title}</div>
          {matchData?.match_info?.live && (
            <div className="text-green-600 mt-1">{matchData.match_info.live}</div>
          )}
        </div>

        {/* Bet Type Selector */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            onClick={() => setBetType("back")}
            className={`py-2 rounded font-semibold ${
              betType === "back"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            BACK {selectedOdds?.back && `@ ${selectedOdds.back}`}
          </button>
          <button
            onClick={() => setBetType("lay")}
            className={`py-2 rounded font-semibold ${
              betType === "lay"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            LAY {selectedOdds?.lay && `@ ${selectedOdds.lay}`}
          </button>
        </div>

        {/* Bet For */}
        <div className="text-xs text-gray-700 mb-1">
          {betType === "back" ? "Backing" : "Laying"}: {getSelectionName()}
        </div>

        {/* Odds + Stake + Profit/Liability */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div>
            <div className="text-xs mb-1">Odds</div>
            <input
              type="number"
              value={odds}
              onChange={(e) => setOdds(e.target.value)}
              step="0.01"
              min="1.01"
              className="w-full p-1 border rounded text-center"
            />
          </div>

          <div>
            <div className="text-xs mb-1">Stake (₹)</div>
            <input
              type="number"
              value={stake}
              onChange={(e) => setStake(e.target.value)}
              min="1"
              className="w-full p-1 border rounded text-center"
            />
          </div>

          <div>
            <div className="text-xs mb-1">
              {betType === "back" ? "Profit (₹)" : "Liability (₹)"}
            </div>
            <input
              type="text"
              value={(betType === "back" ? profit : liability).toFixed(2)}
              disabled
              className="w-full p-1 border rounded text-center bg-gray-100"
            />
          </div>
        </div>

        {/* Volume Info */}
        {(selectedOdds?.back_volume || selectedOdds?.lay_volume) && (
          <div className="bg-gray-100 p-2 rounded mb-3 text-xs flex justify-between">
            {selectedOdds?.back_volume && (
              <span>Available: ₹{parseFloat(selectedOdds.back_volume).toLocaleString()}</span>
            )}
            {selectedOdds?.lay_volume && (
              <span>Volume: ₹{parseFloat(selectedOdds.lay_volume).toLocaleString()}</span>
            )}
          </div>
        )}

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {[100, 500, 1000, 5000, 10000, 50000].map((amt) => (
            <button
              key={amt}
              onClick={() => quickStake(amt)}
              className="bg-gray-300 hover:bg-gray-400 rounded py-1 text-xs font-semibold"
            >
              +₹{amt.toLocaleString()}
            </button>
          ))}
        </div>

        {/* Accept Any Odds */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <input
            type="checkbox"
            checked={acceptAnyOdds}
            onChange={(e) => setAcceptAnyOdds(e.target.checked)}
          />
          <span>Accept Any Odds (match current market price)</span>
        </div>

        {/* User Balance Info */}
        {user && (
          <div className="bg-gray-100 p-2 rounded mb-3 text-xs">
            <div className="flex justify-between">
              <span>Available Balance:</span>
              <span className="font-bold text-green-600">
                ₹{user.current_balance?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Current Exposure:</span>
              <span className="font-bold text-orange-600">
                ₹{user.used_exposure?.toLocaleString() || 0}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Exposure Limit:</span>
              <span className="font-bold">
                ₹{user.exposure_limit?.toLocaleString() || 0}
              </span>
            </div>
            {liability > 0 && (
              <div className="flex justify-between mt-1 pt-1 border-t">
                <span>New Exposure:</span>
                <span className="font-bold text-red-600">
                  ₹{(user.used_exposure + liability).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handlePlaceBet}
            disabled={placing || !stake || stake <= 0 || !odds}
            className={`bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm ${
              placing || !stake || stake <= 0 || !odds
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {placing ? "Placing Bet..." : "Place Bet"}
          </button>
        </div>
      </div>

      {/* MY BET SECTION */}
      <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold mt-2">
        MY BETS - {getMarketName()}
      </div>

      <div className="p-2">
        <select className="w-full border p-1 text-sm rounded mb-2">
          <option>All Bets</option>
          <option>Matched Bets</option>
          <option>Unmatched Bets</option>
        </select>
        
        <div className="text-center text-gray-500 text-xs py-2">
          Your bets for this market will appear here
        </div>
      </div>
    </div>
  );
}