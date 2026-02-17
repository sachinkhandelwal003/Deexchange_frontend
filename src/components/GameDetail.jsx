import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import useEntitySocket from "../hooks/useEntitySocket";

export default function GameDetail() {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [liveOdds, setLiveOdds] = useState(null);
  const [sessionOdds, setSessionOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initial fetch of match data and odds
  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);

        const ACCESS_TOKEN = import.meta.env.VITE_ENTITYSPORT_TOKEN;

        const response = await axios.get(
          `https://restapi.entitysport.com/exchange/matchesmultiodds?token=${ACCESS_TOKEN}&match_id=${id}`
        );

        if (response.data.status === "ok") {
          const matchResponse = response.data.response[id];
          console.log("📊 Match Data:", matchResponse);
          setMatchData(matchResponse);
          setLiveOdds(matchResponse.live_odds);
          setSessionOdds(matchResponse.session_odds || []);
        }
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to fetch match data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMatchData();
  }, [id]);

  // 🔥 WebSocket Live Updates for odds
  useEntitySocket((data) => {
    console.log("🔥 Live odds update:", data);

    // Handle odds updates for this specific match
    if (data.api_type === "odds_update" && data.response?.match_id === parseInt(id)) {
      if (data.response.live_odds) {
        setLiveOdds(prev => ({
          ...prev,
          ...data.response.live_odds
        }));
      }
      if (data.response.session_odds) {
        setSessionOdds(data.response.session_odds);
      }
    }
    
    // Handle match push updates
    if (data.api_type === "match_push_obj" && data.response?.match_id === parseInt(id)) {
      setMatchData(prev => ({
        ...prev,
        match_info: data.response.match_info
      }));
    }
  });

  if (loading) return <div className="p-4 text-center">Loading match...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!matchData || !matchData.match_info) return <div className="p-4 text-center">No match found</div>;

  const { match_info } = matchData;
  
  // Safe destructuring with default values
  const competition = match_info.competition || {};
  const venue = match_info.venue || {};
  const weather = match_info.weather || {};
  const pitch = match_info.pitch || {};
  const toss = match_info.toss || {};

  const matchDate = match_info.date_start_ist 
    ? new Date(match_info.date_start_ist).toLocaleString("en-IN", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date not available";

  // Helper function to format odds
  const formatOdds = (value) => value || "-";

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-100 min-h-screen">
      {/* LEFT SIDE - Match Info & Odds Tables */}
      <div className="flex-1 space-y-4">
        {/* HEADER */}
        <div className="bg-[#2C3E50] text-white p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">{match_info.title || "Match"}</div>
            <div className="text-sm">{matchDate}</div>
          </div>
          <div className="text-sm mt-1">
            {match_info.format_str || ""} | {match_info.subtitle || ""}
          </div>
        </div>

        {/* STATUS */}
        {match_info.status_note && (
          <div className="bg-green-600 text-white text-center p-2 rounded-md font-semibold">
            {match_info.result || match_info.status_note}
          </div>
        )}

        {/* TEAMS SCORES */}
        {match_info.teama && match_info.teamb && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Team A */}
            <div className="bg-white p-4 rounded-md shadow">
              <div className="flex items-center gap-3">
                {match_info.teama.logo_url && (
                  <img
                    src={match_info.teama.logo_url}
                    alt={match_info.teama.name}
                    className="w-12 h-12"
                  />
                )}
                <div>
                  <div className="font-bold text-lg">{match_info.teama.name}</div>
                  <div className="text-sm text-gray-600">{match_info.teama.scores_full}</div>
                </div>
              </div>
            </div>

            {/* Team B */}
            <div className="bg-white p-4 rounded-md shadow">
              <div className="flex items-center gap-3">
                {match_info.teamb.logo_url && (
                  <img
                    src={match_info.teamb.logo_url}
                    alt={match_info.teamb.name}
                    className="w-12 h-12"
                  />
                )}
                <div>
                  <div className="font-bold text-lg">{match_info.teamb.name}</div>
                  <div className="text-sm text-gray-600">{match_info.teamb.scores_full}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 📊 MATCH ODDS - First Table */}
        {liveOdds?.matchodds && (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="bg-[#2C3E50] text-white p-3 font-bold flex justify-between items-center">
              <span>MATCH ODDS</span>
              <span className="text-sm font-normal">CASHOUT</span>
            </div>
            
            <div className="p-3 border-b text-xs text-gray-600">
              MIN: 100 / MAX: 500000
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3"></th>
                  <th className="text-center p-3 bg-[#7ec3f5] text-white">BACK</th>
                  <th className="text-center p-3 bg-[#f7b2c4] text-white">LAY</th>
                </tr>
              </thead>
              <tbody>
                {match_info.teama && (
                  <tr className="border-b">
                    <td className="p-3 font-bold">{match_info.teama.name}</td>
                    <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                      {formatOdds(liveOdds.matchodds?.teama?.back)}
                    </td>
                    <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                      {formatOdds(liveOdds.matchodds?.teama?.lay)}
                    </td>
                  </tr>
                )}
                {match_info.teamb && (
                  <tr>
                    <td className="p-3 font-bold">{match_info.teamb.name}</td>
                    <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                      {formatOdds(liveOdds.matchodds?.teamb?.back)}
                    </td>
                    <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                      {formatOdds(liveOdds.matchodds?.teamb?.lay)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 📊 BOOKMAKER SECTION */}
        {liveOdds?.bookmaker && match_info.teama && match_info.teamb && (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="grid grid-cols-3 border-b">
              <div className="p-2 text-center text-xs font-bold bg-gray-100">BOOKMAKER 0%</div>
              <div className="p-2 text-center text-xs font-bold bg-green-100">CASHOUT</div>
              <div className="p-2 text-center text-xs font-bold bg-gray-100">BOOKMAKER 1.0%</div>
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3"></th>
                  <th className="text-center p-3 bg-[#7ec3f5] text-white">BACK</th>
                  <th className="text-center p-3 bg-[#f7b2c4] text-white">LAY</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-bold">{match_info.teama.name}</td>
                  <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                    {formatOdds(liveOdds.bookmaker?.teama?.back)}
                  </td>
                  <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                    {formatOdds(liveOdds.bookmaker?.teama?.lay)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td colSpan="3" className="p-2 text-xs text-gray-600">
                    khadda and meter market bets starte | Min: 100 Max: 500000 | Min: 100 Max: 500000
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">{match_info.teamb.name}</td>
                  <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                    {formatOdds(liveOdds.bookmaker?.teamb?.back)}
                  </td>
                  <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                    {formatOdds(liveOdds.bookmaker?.teamb?.lay)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 📊 6 OVER BOOKMAKER */}
        <div className="bg-white rounded-md shadow overflow-hidden">
          <div className="bg-[#2C3E50] text-white p-3 font-bold">
            6 OVER BOOKMAKER (SCO VS NEP)
          </div>
          
          <div className="p-3 border-b text-xs text-gray-600 flex justify-between">
            <span>CASHOUT</span>
            <span>Min: 100 Max: 200000</span>
          </div>

          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <div className="font-bold mb-2">SCO 1 TO 6 Over Runs</div>
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-center p-2 bg-[#7ec3f5] text-white">BACK</th>
                    <th className="text-center p-2 bg-[#f7b2c4] text-white">LAY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center p-2 bg-[#7ec3f5]/20 font-bold">0</td>
                    <td className="text-center p-2 bg-[#f7b2c4]/20 font-bold">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <div className="font-bold mb-2">NEP 1 TO 6 Over Runs</div>
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-center p-2 bg-[#7ec3f5] text-white">BACK</th>
                    <th className="text-center p-2 bg-[#f7b2c4] text-white">LAY</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="text-center p-2 bg-[#7ec3f5]/20 font-bold">0</td>
                    <td className="text-center p-2 bg-[#f7b2c4]/20 font-bold">0</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 📊 TIED MATCH */}
        {liveOdds?.tiedmatch && (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="bg-[#2C3E50] text-white p-3 font-bold flex justify-between items-center">
              <span>TIED MATCH</span>
              <span className="text-sm font-normal">CASHOUT</span>
            </div>
            
            <div className="p-3 border-b text-xs text-gray-600">
              Min: 100 Max: 100000
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3"></th>
                  <th className="text-center p-3 bg-[#7ec3f5] text-white">BACK</th>
                  <th className="text-center p-3 bg-[#f7b2c4] text-white">LAY</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-bold">YES</td>
                  <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                    {formatOdds(liveOdds.tiedmatch?.teama?.back)}
                  </td>
                  <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                    {formatOdds(liveOdds.tiedmatch?.teama?.lay)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">NO</td>
                  <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                    {formatOdds(liveOdds.tiedmatch?.teamb?.back)}
                  </td>
                  <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                    {formatOdds(liveOdds.tiedmatch?.teamb?.lay)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 📊 WINNER (INCL. SUPER OVER) */}
        {match_info.teama && match_info.teamb && (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="bg-[#2C3E50] text-white p-3 font-bold">
              WINNER (INCL. SUPER OVER)
            </div>
            
            <div className="p-3 border-b text-xs text-gray-600">
              CASHOUT | Min: 50
            </div>

            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3"></th>
                  <th className="text-center p-3 bg-[#7ec3f5] text-white">BACK</th>
                  <th className="text-center p-3 bg-[#f7b2c4] text-white">LAY</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-bold">{match_info.teama.name}</td>
                  <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                    {formatOdds(liveOdds?.matchodds?.teama?.back)}
                  </td>
                  <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                    {formatOdds(liveOdds?.matchodds?.teama?.lay)}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 font-bold">{match_info.teamb.name}</td>
                  <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                    {formatOdds(liveOdds?.matchodds?.teamb?.back)}
                  </td>
                  <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                    {formatOdds(liveOdds?.matchodds?.teamb?.lay)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* 📊 FANCY PREMIUM - Session Markets */}
        {sessionOdds.length > 0 && (
          <div className="bg-white rounded-md shadow overflow-hidden">
            <div className="bg-[#2C3E50] text-white p-3 font-bold">
              Fancy Premium
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="text-left p-3">Market</th>
                    <th className="text-center p-3 bg-[#7ec3f5] text-white">BACK</th>
                    <th className="text-center p-3 bg-[#f7b2c4] text-white">LAY</th>
                    <th className="text-center p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sessionOdds.map((session, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-medium">{session.title}</div>
                        <div className="text-xs text-gray-500">
                          Cond: {session.back_condition}
                        </div>
                      </td>
                      <td className="text-center p-3 bg-[#7ec3f5]/20 font-bold">
                        {session.back}
                      </td>
                      <td className="text-center p-3 bg-[#f7b2c4]/20 font-bold">
                        {session.lay}
                      </td>
                      <td className="text-center p-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          session.status === "SUSPENDED" 
                            ? "bg-red-100 text-red-600" 
                            : session.status === "Ball Running"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-100 text-gray-600"
                        }`}>
                          {session.status || "Open"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Match Info Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* TOURNAMENT */}
          {competition.title && (
            <div className="bg-white p-4 rounded-md shadow text-sm">
              <div><strong>Tournament:</strong> {competition.title}</div>
              <div><strong>Season:</strong> {competition.season}</div>
              <div><strong>Total Teams:</strong> {competition.total_teams}</div>
              <div><strong>Total Matches:</strong> {competition.total_matches}</div>
            </div>
          )}

          {/* VENUE */}
          {venue.name && (
            <div className="bg-white p-4 rounded-md shadow text-sm">
              <div><strong>Venue:</strong> {venue.name}</div>
              <div><strong>Location:</strong> {venue.location}, {venue.country}</div>
            </div>
          )}

          {/* TOSS */}
          {toss.text && (
            <div className="bg-white p-4 rounded-md shadow text-sm">
              <strong>Toss:</strong> {toss.text}
            </div>
          )}

          {/* WEATHER */}
          {weather.weather_desc && (
            <div className="bg-white p-4 rounded-md shadow text-sm">
              <div><strong>Weather:</strong> {weather.weather_desc}</div>
              <div>Temperature: {weather.temp}°C</div>
              <div>Humidity: {weather.humidity}%</div>
              <div>Wind Speed: {weather.wind_speed} km/h</div>
            </div>
          )}

          {/* PITCH */}
          {pitch.pitch_condition && (
            <div className="bg-white p-4 rounded-md shadow text-sm md:col-span-2">
              <div><strong>Pitch:</strong> {pitch.pitch_condition}</div>
              <div>Batting: {pitch.batting_condition} | Pace: {pitch.pace_bowling_condition} | Spin: {pitch.spine_bowling_condition}</div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDE - BET SLIP */}
      <div className="w-full lg:w-80 space-y-4">
        <div className="bg-white rounded-md shadow">
          <div className="bg-[#2C3E50] text-white p-3 font-bold">
            My Bets
          </div>
          <div className="p-4 text-center text-gray-400">
            No bets placed yet
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-md shadow p-4">
          <h3 className="font-bold mb-2">Match Stats</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-semibold text-green-600">{match_info.status_str || "Upcoming"}</span>
            </div>
            {match_info.winning_team_id > 0 && match_info.teama && match_info.teamb && (
              <div className="flex justify-between">
                <span>Winner:</span>
                <span className="font-semibold">
                  {match_info.winning_team_id === match_info.teama.team_id 
                    ? match_info.teama.name 
                    : match_info.teamb.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}