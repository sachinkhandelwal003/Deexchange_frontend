import { useParams } from "react-router-dom";
import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { SocketContext } from "../hooks/SocketProvider";

export default function GameDetail() {
  const { id } = useParams();
  const { matches } = useContext(SocketContext);

  const [initialData, setInitialData] = useState(null);
  const [sessionOdds, setSessionOdds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const ACCESS_TOKEN = import.meta.env.VITE_ENTITYSPORT_TOKEN;

  // 🔥 INITIAL API LOAD
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await axios.get(
          `https://restapi.entitysport.com/exchange/matchesmultiodds?token=${ACCESS_TOKEN}&match_id=${id}`
        );

        if (res.data.status === "ok") {
const response = res.data.response;
          const data =
  response[id] || response;   // 🔥 HANDLE BOTH FORMATS
  console.log("daddadad",data)
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
  return matches.find(
    (m) =>
      String(m.match_info?.match_id) === String(id)
  );
}, [matches, id]);


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

    session_odds:
      liveMatch?.session_odds ||
      initialData.session_odds ||
      [],
  };
}, [initialData, liveMatch]);


  console.log("matchDatamatchData",matchData)
  // ✅ GLOBAL LOADING CONDITION
  if (loading) {
    return (
      <div className="p-4 text-center text-gray-600">
        Loading match data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="p-4 text-center text-gray-500">
        No match data available
      </div>
    );
  }

  const format = (v) =>
    v && v !== "0.00" && v !== "" ? v : "-";

  const teama = matchData.match_info?.teama;
  const teamb = matchData.match_info?.teamb;
  const odds = matchData.live_odds || {};

  return (
    <>
    <div className=" flex  gap-1">
    <div className=" bg-gray-200 min-h-screen text-sm w-3/4">

      {/* HEADER */}
      {/* <div className="bg-[#2f4050] text-white p-3 rounded mb-3">
        <div className="font-bold text-lg">
          {matchData.match_info?.title || "Match"}
        </div>
        <div className="text-xs mt-1">
          {matchData.match_info?.status_str || "-"} |{" "}
          {teama?.scores_full || "-"}
        </div>
      </div> */}

      {/* MATCH ODDS */}
      {odds.matchodds ? (
        <div className="bg-white rounded shadow mb-3 overflow-hidden">
          <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold">
            MATCH ODDS
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
              {[teama, teamb].map((team, idx) => (
                <tr key={idx} className="border-t">
                  <td className="text-left p-2 font-medium">
                    {team?.name || "-"}
                  </td>
                  <td className="bg-blue-100 font-bold p-2">
                    {format(
                      idx === 0
                        ? odds.matchodds?.teama?.back
                        : odds.matchodds?.teamb?.back
                    )}
                  </td>
                  <td className="bg-pink-100 font-bold p-2">
                    {format(
                      idx === 0
                        ? odds.matchodds?.teama?.lay
                        : odds.matchodds?.teamb?.lay
                    )}
                  </td>
                </tr>
              ))}
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
    <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold">
      BOOKMAKER
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
        {[teama, teamb].map((team, idx) => (
          <tr key={idx} className="border-t">
            <td className="text-left p-2 font-medium">
              {team?.name}
            </td>
            <td className="bg-blue-100 font-bold p-2">
              {format(
                idx === 0
                  ? odds.bookmaker?.teama?.back
                  : odds.bookmaker?.teamb?.back
              )}
            </td>
            <td className="bg-pink-100 font-bold p-2">
              {format(
                idx === 0
                  ? odds.bookmaker?.teama?.lay
                  : odds.bookmaker?.teamb?.lay
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

{odds.tiedmatch && (
  <div className="bg-white rounded shadow mb-3 overflow-hidden">
    <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold">
      TIED MATCH
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
          </td>
          <td className="bg-blue-100 font-bold p-2">
            {format(odds.tiedmatch?.teama?.back)}
          </td>
          <td className="bg-pink-100 font-bold p-2">
            {format(odds.tiedmatch?.teama?.lay)}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}

      {/* FANCY */}
{matchData.session_odds?.length > 0 ? (
        <div className="bg-white rounded shadow mt-4 overflow-hidden">
          <div className="bg-[#2f4050] text-white px-3 py-2 font-semibold">
            Sessions
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

                  <td className="bg-pink-100 font-bold p-2">
                    {item.status === "SUSPENDED"
                      ? <span className="text-red-600">SUSPENDED</span>
                      : format(item.lay)}
                  </td>

                  <td className="bg-blue-100 font-bold p-2">
                    {item.status === "SUSPENDED"
                      ? "-"
                      : format(item.back)}
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

      {/* Bet For */}
      <div className="text-xs text-gray-700 mb-1">(Bet for)</div>

      {/* Odds + Stake + Profit */}
      <div className="grid grid-cols-3 gap-2 mb-3">

        <div>
          <div className="text-xs mb-1">Odds</div>
          <input
            type="number"
            defaultValue="1.13"
            className="w-full p-1 border rounded text-center"
          />
        </div>

        <div>
          <div className="text-xs mb-1">Stake</div>
          <input
            type="number"
            defaultValue="0"
            className="w-full p-1 border rounded text-center"
          />
        </div>

        <div>
          <div className="text-xs mb-1">Profit</div>
          <input
            type="text"
            value="0"
            disabled
            className="w-full p-1 border rounded text-center bg-gray-100"
          />
        </div>
      </div>

      {/* Quick Amount Buttons */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[100, 500, 1000, 5000, 10000, 50000].map((amt) => (
          <button
            key={amt}
            className="bg-gray-300 hover:bg-gray-400 rounded py-1 text-xs font-semibold"
          >
            +{amt}
          </button>
        ))}
      </div>

      {/* Accept Any Odds */}
      <div className="flex items-center gap-2 mb-3 text-xs">
        <input type="checkbox" />
        <span>Accept Any Odds</span>
      </div>

      {/* Buttons */}
      <div className="flex justify-between">
        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm">
          Cancel
        </button>

        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm">
          Place Bet
        </button>
      </div>
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
</div>


</div>
    </>
  );
}
