import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function GameDetail() {
  const { id } = useParams();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      try {
        setLoading(true);

        const ACCESS_TOKEN = import.meta.env.VITE_ENTITYSPORT_TOKEN;

        const response = await axios.get(
          `https://restapi.entitysport.com/exchange/matches/${id}/info?token=${ACCESS_TOKEN}`
        );

        setMatchData(response.data.response);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch match data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchMatchData();
  }, [id]);

  if (loading) return <div className="p-4 text-center">Loading match...</div>;
  if (error) return <div className="p-4 text-center text-red-500">{error}</div>;
  if (!matchData) return <div className="p-4 text-center">No match found</div>;

  const { match_info } = matchData;
  const { competition, venue, weather, pitch, toss } = match_info;

  const winner =
    match_info.winning_team_id === match_info.teama.team_id
      ? match_info.teama.name
      : match_info.teamb.name;

  const matchDate = new Date(match_info.date_start_ist).toLocaleString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-gray-100 min-h-screen">

      {/* LEFT SIDE */}
      <div className="flex-1 space-y-4">

        {/* HEADER */}
        <div className="bg-[#2C3E50] text-white p-3 rounded-md">
          <div className="flex justify-between items-center">
            <div className="font-bold text-lg">{match_info.title}</div>
            <div className="text-sm">{matchDate}</div>
          </div>
          <div className="text-sm mt-1">
            {match_info.format_str} | {match_info.subtitle}
          </div>
        </div>

        {/* STATUS */}
        <div className="bg-green-600 text-white text-center p-2 rounded-md font-semibold">
          {match_info.result || match_info.status_note}
        </div>

        {/* TEAMS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Team A */}
          <div className="bg-white p-4 rounded-md shadow">
            <div className="flex items-center gap-3">
              <img
                src={match_info.teama.logo_url}
                alt={match_info.teama.name}
                className="w-12 h-12"
              />
              <div>
                <div className="font-bold text-lg">
                  {match_info.teama.name}
                </div>
                <div className="text-sm text-gray-600">
                  {match_info.teama.scores_full}
                </div>
              </div>
            </div>
          </div>

          {/* Team B */}
          <div className="bg-white p-4 rounded-md shadow">
            <div className="flex items-center gap-3">
              <img
                src={match_info.teamb.logo_url}
                alt={match_info.teamb.name}
                className="w-12 h-12"
              />
              <div>
                <div className="font-bold text-lg">
                  {match_info.teamb.name}
                </div>
                <div className="text-sm text-gray-600">
                  {match_info.teamb.scores_full}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* TOURNAMENT */}
        <div className="bg-white p-4 rounded-md shadow text-sm">
          <div><strong>Tournament:</strong> {competition.title}</div>
          <div><strong>Season:</strong> {competition.season}</div>
          <div><strong>Total Teams:</strong> {competition.total_teams}</div>
          <div><strong>Total Matches:</strong> {competition.total_matches}</div>
        </div>

        {/* VENUE */}
        <div className="bg-white p-4 rounded-md shadow text-sm">
          <div><strong>Venue:</strong> {venue.name}</div>
          <div><strong>Location:</strong> {venue.location}, {venue.country}</div>
        </div>

        {/* TOSS */}
        <div className="bg-white p-4 rounded-md shadow text-sm">
          <strong>Toss:</strong> {toss.text}
        </div>

        {/* WEATHER */}
        <div className="bg-white p-4 rounded-md shadow text-sm">
          <div><strong>Weather:</strong> {weather.weather_desc}</div>
          <div>Temperature: {weather.temp}°C</div>
          <div>Humidity: {weather.humidity}%</div>
          <div>Wind Speed: {weather.wind_speed} km/h</div>
        </div>

        {/* PITCH */}
        <div className="bg-white p-4 rounded-md shadow text-sm">
          <div><strong>Pitch:</strong> {pitch.pitch_condition}</div>
          <div>Batting: {pitch.batting_condition}</div>
          <div>Pace: {pitch.pace_bowling_condition}</div>
          <div>Spin: {pitch.spine_bowling_condition}</div>
        </div>

      </div>

      {/* RIGHT SIDE - BET SLIP */}
      <div className="w-full lg:w-80 bg-white rounded-md shadow">

        <div className="bg-[#2C3E50] text-white p-3 font-bold">
          My Bets
        </div>

        <div className="p-4 text-center text-gray-400">
          No bets placed yet
        </div>

      </div>

    </div>
  );
}
