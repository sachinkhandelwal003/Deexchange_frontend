import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useMemo, useRef } from "react";
import axios from "axios";
import { SocketContext } from "../hooks/SocketProvider";
import { useAuth } from "../components/context/UserContext";
import BettingSlip from "../components/BettingSlip";

export default function GameDetail() {
  const { id } = useParams();
  const { matches, lastUpdate } = useContext(SocketContext);
  const { user } = useAuth();

  const [initialData, setInitialData] = useState(null);
  const [sessionOdds, setSessionOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for betting
  const [selectedOdds, setSelectedOdds] = useState(null);
  const [showBetSlip, setShowBetSlip] = useState(false);

  // State for live updates animation
  const [updatingCells, setUpdatingCells] = useState({});
  const prevOddsRef = useRef(null);

  const ACCESS_TOKEN = import.meta.env.VITE_ENTITYSPORT_TOKEN;

  // 🔥 INITIAL API LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://restapi.entitysport.com/exchange/matches/${id}/odds?token=${ACCESS_TOKEN}`
        );

        if (res.data.status === "ok") {
          const response = res.data.response;
          const data = response[id] || response;
          console.log("Initial data loaded", data);
          setInitialData(data || null);
          setSessionOdds(data?.session_odds || []);
        } else {
          setInitialData(null);
        }

        setError(null);
      } catch (err) {
        setError("Failed to fetch match data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);


  // 🔥 LIVE SOCKET MATCH
  const liveMatch = useMemo(() => {
    return matches.find((m) => String(m.match_info?.match_id) === String(id));
  }, [matches, id]);

  // Add this useEffect to log odds data whenever it updates
useEffect(() => {
  if (liveMatch?.live_odds) {
    console.log("🔴 LIVE ODDS DATA:", {
      timestamp: new Date().toLocaleTimeString(),
      match_id: id,
      full_odds: liveMatch.live_odds,
      matchodds: liveMatch.live_odds.matchodds,
      bookmaker: liveMatch.live_odds.bookmaker,
      tiedmatch: liveMatch.live_odds.tiedmatch,
      // Team A details
      teama_back: liveMatch.live_odds.matchodds?.teama?.back,
      teama_lay: liveMatch.live_odds.matchodds?.teama?.lay,
      teama_back_volume: liveMatch.live_odds.matchodds?.teama?.back_volume,
      teama_lay_volume: liveMatch.live_odds.matchodds?.teama?.lay_volume,
      // Team B details
      teamb_back: liveMatch.live_odds.matchodds?.teamb?.back,
      teamb_lay: liveMatch.live_odds.matchodds?.teamb?.lay,
      teamb_back_volume: liveMatch.live_odds.matchodds?.teamb?.back_volume,
      teamb_lay_volume: liveMatch.live_odds.matchodds?.teamb?.lay_volume,
    });
  }
}, [liveMatch]);

// Also log session odds
useEffect(() => {
  if (liveMatch?.session_odds) {
    console.log("🎲 SESSION ODDS:", {
      timestamp: new Date().toLocaleTimeString(),
      count: liveMatch.session_odds.length,
      data: liveMatch.session_odds
    });
  }
}, [liveMatch]);
  // 🔥 Track odds changes for animation
  useEffect(() => {
    if (liveMatch?.live_odds && prevOddsRef.current) {
      const updates = {};
      const newOdds = liveMatch.live_odds;
      const prevOdds = prevOddsRef.current;
      
      // Check matchodds
      if (newOdds.matchodds) {
        if (newOdds.matchodds.teama?.back !== prevOdds.matchodds?.teama?.back) {
          updates['matchodds_teama_back'] = true;
        }
        if (newOdds.matchodds.teama?.lay !== prevOdds.matchodds?.teama?.lay) {
          updates['matchodds_teama_lay'] = true;
        }
        if (newOdds.matchodds.teamb?.back !== prevOdds.matchodds?.teamb?.back) {
          updates['matchodds_teamb_back'] = true;
        }
        if (newOdds.matchodds.teamb?.lay !== prevOdds.matchodds?.teamb?.lay) {
          updates['matchodds_teamb_lay'] = true;
        }
      }
      
      // Check bookmaker
      if (newOdds.bookmaker) {
        if (newOdds.bookmaker.teama?.back !== prevOdds.bookmaker?.teama?.back) {
          updates['bookmaker_teama_back'] = true;
        }
        if (newOdds.bookmaker.teama?.lay !== prevOdds.bookmaker?.teama?.lay) {
          updates['bookmaker_teama_lay'] = true;
        }
        if (newOdds.bookmaker.teamb?.back !== prevOdds.bookmaker?.teamb?.back) {
          updates['bookmaker_teamb_back'] = true;
        }
        if (newOdds.bookmaker.teamb?.lay !== prevOdds.bookmaker?.teamb?.lay) {
          updates['bookmaker_teamb_lay'] = true;
        }
      }
      
      // Check tiedmatch
      if (newOdds.tiedmatch) {
        if (newOdds.tiedmatch.teama?.back !== prevOdds.tiedmatch?.teama?.back) {
          updates['tiedmatch_back'] = true;
        }
        if (newOdds.tiedmatch.teama?.lay !== prevOdds.tiedmatch?.teama?.lay) {
          updates['tiedmatch_lay'] = true;
        }
      }
      
      if (Object.keys(updates).length > 0) {
        setUpdatingCells(updates);
        setTimeout(() => setUpdatingCells({}), 500);
      }
    }
    
    prevOddsRef.current = liveMatch?.live_odds;
  }, [liveMatch]);

  // 🔥 MERGE DATA SAFELY
  const matchData = useMemo(() => {
    if (!initialData) return null;

    return {
      ...initialData,
      match_info: initialData.match_info,
      live_odds: {
        ...initialData.live_odds,
        ...(liveMatch?.live_odds || {}),
      },
      session_odds: liveMatch?.session_odds || initialData.session_odds || [],
    };
  }, [initialData, liveMatch]);

  // Handle odds click
 const handleOddsClick = (teamData, oddsType, oddsValue, market) => {
  if (!user) {
    alert("Please login to place bet");
    return;
  }

  setSelectedOdds({
    team: {
      team_id: teamData.team_id,
      name: teamData.name,
    },
    back: teamData.back,
    lay: teamData.lay,
    back_volume: teamData.back_volume,
    lay_volume: teamData.lay_volume,
    oddsType,
    odds: oddsValue,
    market,
    selection_id: teamData.team_id,
    selection_name: teamData.name,
  });

  setShowBetSlip(true);
};

  // Handle fancy click
  const handleFancyClick = (item, oddsType, oddsValue) => {
    if (!user) {
      alert("Please login to place bet");
      return;
    }
    
    setSelectedOdds({
      ...item,
      oddsType,
      odds: oddsValue,
      market: "fancy",
      selection_id: item.question_id,
    });
    setShowBetSlip(true);
  };

  // Format with animation
  const formatWithAnimation = (value, cellId) => {
    const formatted = value && value !== "0.00" && value !== "" ? value : "-";
    const isUpdating = updatingCells[cellId];
    
    return (
      <span className={isUpdating ? "odds-updating" : ""}>
        {formatted}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading match data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">{error}</div>
    );
  }

  if (!matchData) {
    return (
      <div className="p-4 text-center text-gray-500">
        No match data available
      </div>
    );
  }

  const format = (v) => (v && v !== "0.00" && v !== "" ? v : "-");

  const teama = matchData.match_info?.teama;
  const teamb = matchData.match_info?.teamb;
  const odds = matchData.live_odds || {};

  return (
    <>
      <div className="flex gap-1">
        <div className="bg-gray-200 min-h-screen text-sm w-3/4">
          {/* Live Update Indicator - Small and unobtrusive */}
          <div className="text-xs text-gray-500 mb-1 text-right flex justify-end items-center gap-2">
            <span className={`inline-block h-2 w-2 rounded-full ${lastUpdate ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
            <span>Live: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Connecting...'}</span>
          </div>

          {/* MATCH ODDS */}
          {odds.matchodds ? (
            <div className="bg-white rounded shadow mb-3 overflow-hidden">
              <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold flex justify-between">
                <span>MATCH ODDS</span>
                <span className="text-xs">Live Updates</span>
              </div>

              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="text-left p-2"></th>
                    <th className="bg-blue-400 text-white p-2">BACK</th>
                    <th className="bg-pink-400 text-white p-2">LAY</th>
                  </tr>
                </thead>

                <tbody>
                  {[teama, teamb].map((team, idx) => {
                    const teamOdds = idx === 0 ? odds.matchodds?.teama : odds.matchodds?.teamb;
                    const teamKey = idx === 0 ? 'teama' : 'teamb';
                    
                    return (
                      <tr key={idx} className="border-t">
                        <td className="text-left p-2 font-medium">
                          {team?.name || "-"}
                          {teamOdds?.back_volume && (
                            <span className="text-xs text-gray-500 ml-2">
                              ₹{parseFloat(teamOdds.back_volume).toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td 
                          className={`bg-blue-100 font-bold p-2 cursor-pointer hover:bg-blue-200 transition-colors ${
                            updatingCells[`matchodds_${teamKey}_back`] ? 'bg-yellow-200' : ''
                          }`}
                          onClick={() => 
                          handleOddsClick(
  {
    team_id: team?.team_id,
    name: team?.name,
    back: teamOdds?.back,
    lay: teamOdds?.lay,
    back_volume: teamOdds?.back_volume,
    lay_volume: teamOdds?.lay_volume,
  },
  "back",
  teamOdds?.back,
  "matchodds"
)
                        
                        }
                        >
                          {formatWithAnimation(teamOdds?.back, `matchodds_${teamKey}_back`)}
                        </td>
                        <td 
                          className={`bg-pink-100 font-bold p-2 cursor-pointer hover:bg-pink-200 transition-colors ${
                            updatingCells[`matchodds_${teamKey}_lay`] ? 'bg-yellow-200' : ''
                          }`}
                           onClick={() => 
                          handleOddsClick(
  {
    team_id: team?.team_id,
    name: team?.name,
    back: teamOdds?.back,
    lay: teamOdds?.lay,
    back_volume: teamOdds?.back_volume,
    lay_volume: teamOdds?.lay_volume,
  },
  "back",
  teamOdds?.back,
  "matchodds"
)
                        
                        }
                        >
                          {formatWithAnimation(teamOdds?.lay, `matchodds_${teamKey}_lay`)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-3 rounded shadow mb-3 text-center text-gray-500">
              Match odds loading...
            </div>
          )}

          {odds.bookmaker && (
            <div className="bg-white rounded shadow mb-3 overflow-hidden">
              <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold flex justify-between">
                <span>BOOKMAKER</span>
                <span className="text-xs">Live Updates</span>
              </div>

              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="text-left p-2"></th>
                    <th className="bg-blue-400 text-white p-2">BACK</th>
                    <th className="bg-pink-400 text-white p-2">LAY</th>
                  </tr>
                </thead>

                <tbody>
                  {[teama, teamb].map((team, idx) => {
                    const teamOdds = idx === 0 ? odds.bookmaker?.teama : odds.bookmaker?.teamb;
                    const teamKey = idx === 0 ? 'teama' : 'teamb';
                    
                    return (
                      <tr key={idx} className="border-t">
                        <td className="text-left p-2 font-medium">
                          {team?.name}
                          {teamOdds?.back_volume && (
                            <span className="text-xs text-gray-500 ml-2">
                              ₹{parseFloat(teamOdds.back_volume).toLocaleString()}
                            </span>
                          )}
                        </td>
                        <td 
                          className={`bg-blue-100 font-bold p-2 cursor-pointer hover:bg-blue-200 transition-colors ${
                            updatingCells[`bookmaker_${teamKey}_back`] ? 'bg-yellow-200' : ''
                          }`}
                          onClick={() => 
                          handleOddsClick(
  {
    team_id: team?.team_id,
    name: team?.name,
    back: teamOdds?.back,
    lay: teamOdds?.lay,
    back_volume: teamOdds?.back_volume,
    lay_volume: teamOdds?.lay_volume,
  },
  "back",
  teamOdds?.back,
  "matchodds"
)
                        
                        }
                        >
                          {formatWithAnimation(teamOdds?.back, `bookmaker_${teamKey}_back`)}
                        </td>
                        <td 
                          className={`bg-pink-100 font-bold p-2 cursor-pointer hover:bg-pink-200 transition-colors ${
                            updatingCells[`bookmaker_${teamKey}_lay`] ? 'bg-yellow-200' : ''
                          }`}
                          onClick={() => 
                          handleOddsClick(
  {
    team_id: team?.team_id,
    name: team?.name,
    back: teamOdds?.back,
    lay: teamOdds?.lay,
    back_volume: teamOdds?.back_volume,
    lay_volume: teamOdds?.lay_volume,
  },
  "back",
  teamOdds?.back,
  "matchodds"
)
                        
                        }
                        >
                          {formatWithAnimation(teamOdds?.lay, `bookmaker_${teamKey}_lay`)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {odds.tiedmatch && (
            <div className="bg-white rounded shadow mb-3 overflow-hidden">
              <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold flex justify-between">
                <span>TIED MATCH</span>
                <span className="text-xs">Live Updates</span>
              </div>

              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="text-left p-2"></th>
                    <th className="bg-blue-400 text-white p-2">BACK</th>
                    <th className="bg-pink-400 text-white p-2">LAY</th>
                  </tr>
                </thead>

                <tbody>
                  <tr className="border-t">
                    <td className="text-left p-2 font-medium">
                      Tie
                      {odds.tiedmatch?.teama?.back_volume && (
                        <span className="text-xs text-gray-500 ml-2">
                          ₹{parseFloat(odds.tiedmatch.teama.back_volume).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td 
                      className={`bg-blue-100 font-bold p-2 cursor-pointer hover:bg-blue-200 transition-colors ${
                        updatingCells['tiedmatch_back'] ? 'bg-yellow-200' : ''
                      }`}
                      onClick={() => 
                          handleOddsClick(
  {
    team_id: team?.team_id,
    name: team?.name,
    back: teamOdds?.back,
    lay: teamOdds?.lay,
    back_volume: teamOdds?.back_volume,
    lay_volume: teamOdds?.lay_volume,
  },
  "back",
  teamOdds?.back,
  "matchodds"
)
                        
                        }
                    >
                      {formatWithAnimation(odds.tiedmatch?.teama?.back, 'tiedmatch_back')}
                    </td>
                    <td 
                      className={`bg-pink-100 font-bold p-2 cursor-pointer hover:bg-pink-200 transition-colors ${
                        updatingCells['tiedmatch_lay'] ? 'bg-yellow-200' : ''
                      }`}
                      onClick={() => handleOddsClick(
                        odds.tiedmatch?.teama, 
                        "lay", 
                        odds.tiedmatch?.teama?.lay, 
                        "tiedmatch",
                        odds.tiedmatch?.teama?.back_volume,
                        odds.tiedmatch?.teama?.lay_volume
                      )}
                    >
                      {formatWithAnimation(odds.tiedmatch?.teama?.lay, 'tiedmatch_lay')}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* FANCY */}
          {matchData.session_odds?.length > 0 ? (
            <div className="bg-white rounded shadow mt-4 overflow-hidden">
              <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold flex justify-between">
                <span>Sessions</span>
                <span className="text-xs">Live Updates</span>
              </div>

              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th className="text-left p-2"></th>
                    <th className="bg-pink-300 p-2">No</th>
                    <th className="bg-blue-300 p-2">Yes</th>
                  </tr>
                </thead>

                <tbody>
                  {matchData.session_odds.map((item) => (
                    <tr key={item.question_id} className="border-t">
                      <td className="text-left p-2">
                        {item.title}
                      </td>

                      <td 
                        className="bg-pink-100 font-bold p-2 cursor-pointer hover:bg-pink-200"
                        onClick={() => handleFancyClick(item, "lay", item.lay)}
                      >
                        {item.status === "SUSPENDED" ? (
                          <span className="text-red-600">SUSPENDED</span>
                        ) : (
                          item.lay
                        )}
                      </td>

                      <td 
                        className="bg-blue-100 font-bold p-2 cursor-pointer hover:bg-blue-200"
                        onClick={() => handleFancyClick(item, "back", item.back)}
                      >
                        {item.status === "SUSPENDED" ? "-" : item.back}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-white p-3 rounded shadow mt-3 text-center text-gray-500">
              Fancy loading...
            </div>
          )}
        </div>

        <div className="w-1/4">
          {showBetSlip && selectedOdds ? (
            <BettingSlip
              matchData={matchData}
              selectedOdds={selectedOdds}
              onClose={() => {
                setShowBetSlip(false);
                setSelectedOdds(null);
              }}
            />
          ) : (
            <div className="bg-white shadow rounded overflow-hidden text-sm">
              {/* TOP BAR */}
              <div className="bg-[#2f4050] text-white px-3 py-2 flex justify-between">
                <span className="font-semibold">LIVE MATCH</span>
                <span className="text-xs">LIVE STREAM STARTED</span>
              </div>

              {/* PLACE BET HEADER */}
              <div className="bg-[#34495e] text-white px-3 py-2 font-semibold">
                PLACE BET
              </div>

              {/* BET BODY */}
              <div className="bg-pink-300 p-3">
                <div className="text-center text-gray-700 py-4">
                  Click on any odds to place bet
                </div>

                {!user && (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded text-xs text-center">
                    Please login to place bets
                  </div>
                )}
              </div>

              {/* MY BET SECTION */}
              <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold mt-2">
                MY BET
              </div>

              <div className="p-2">
                <select className="w-full border p-1 text-sm rounded">
                  <option>All</option>
                  <option>Matched</option>
                  <option>Unmatched</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animation Styles - Added to your existing UI */}
      <style jsx>{`
        @keyframes oddsUpdate {
          0% { background-color: rgba(255, 255, 0, 0.5); }
          100% { background-color: transparent; }
        }
        
        .odds-updating {
          animation: oddsUpdate 0.5s ease-out;
          display: inline-block;
          padding: 2px 4px;
          border-radius: 4px;
        }
        
        td {
          transition: background-color 0.3s ease;
        }
      `}</style>
    </>
  );
}