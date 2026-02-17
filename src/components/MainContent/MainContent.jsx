import { useState, useEffect } from "react";
import axios from "axios";

import TrendingTabs from "./TrendingTabs";
import SportTabs from "./SportTabs";
import TableView from "./TableView";
import GamesGrid from "../GamesGrid";
import useEntitySocket from "../../hooks/useEntitySocket";

import tabsData from "./tabsData";
import trendingTabsData from "./trendingTabsData";

export default function MainContent() {
  const [activeSport, setActiveSport] = useState(tabsData[0]);
  const [activeTrending, setActiveTrending] = useState(trendingTabsData[0]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch Matches
  const fetchCricketMatches = async () => {
    try {
      setLoading(true);

      const ACCESS_TOKEN = import.meta.env.VITE_ENTITYSPORT_TOKEN;

      const response = await axios.get(
        `https://restapi.entitysport.com/exchange/matches?token=${ACCESS_TOKEN}`
      );

      if (response.data.status === "ok") {
        // Store full match data including team info
        setMatches(response.data.response.items);
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch When Cricket Selected
  useEffect(() => {
    if (activeSport.id === "cricket") {
      fetchCricketMatches();
    } else {
      setMatches([]);
    }
  }, [activeSport]);

// 🔥 WebSocket Live Updates
useEntitySocket((data) => {
  if (!data || !data.api_type) return;

  // 🟢 MATCH LIVE SCORE UPDATE
  if (data.api_type === "match_push_obj" && data.response?.match_id) {
    const matchId = data.response.match_id;
    const matchInfo = data.response.match_info;

    setMatches((prev) => {
      const exists = prev.find((m) => m.match_id === matchId);

      if (exists) {
        return prev.map((match) =>
          match.match_id === matchId
            ? {
                ...match,
                ...matchInfo, // merge full match info
                teama: {
                  ...match.teama,
                  ...matchInfo.teama,
                },
                teamb: {
                  ...match.teamb,
                  ...matchInfo.teamb,
                },
              }
            : match
        );
      } else {
        // If match not exist → add new
        return [...prev, matchInfo];
      }
    });
  }

  // 🟢 ODDS UPDATE
  if (data.api_type === "odds_update" && data.response?.match_id) {
    const matchId = data.response.match_id;

    const market = data.response.market?.[0];
    if (!market) return;

    const runner1 = market.runners?.[0];
    const runner2 = market.runners?.[1];

    const formattedOdds = {
      back1: runner1?.back?.[0]?.price || "-",
      lay1: runner1?.lay?.[0]?.price || "-",
      back2: runner2?.back?.[0]?.price || "-",
      lay2: runner2?.lay?.[0]?.price || "-",
    };

    setMatches((prev) =>
      prev.map((match) =>
        match.match_id === matchId
          ? { ...match, live_odds: formattedOdds }
          : match
      )
    );
  }
});


  // 🔥 Format Data for Table
const formattedData = matches.map((match) => {
  const teamAName = match.teama?.name || "";
  const teamBName = match.teamb?.name || "";

  const displayTitle =
    match.title || `${teamAName} vs ${teamBName}`;

  const scores =
    match.teama?.scores_full || match.teamb?.scores_full
      ? `${match.teama?.scores_full || ""} ${
          match.teamb?.scores_full || ""
        }`
      : "";

  const isLive =
    match.status_str === "Live" ||
    match.status === "Live";

  return {
    id: match.match_id || match.id,
    title: displayTitle,
    date: match.date_start_ist || match.date,
    scores,
    status: match.status_str || match.status || "",
    isLive,
    back1: match.live_odds?.back1 ?? "-",
    lay1: match.live_odds?.lay1 ?? "-",
    backX: "-",
    layX: "-",
    back2: match.live_odds?.back2 ?? "-",
    lay2: match.live_odds?.lay2 ?? "-",
  };
});



  return (
    <div className="flex-1 bg-white rounded-xl shadow-lg">
      <TrendingTabs
        tabs={trendingTabsData}
        active={activeTrending}
        onChange={setActiveTrending}
      />

      <SportTabs
        tabs={tabsData}
        activeTab={activeSport}
        onChange={setActiveSport}
      />

      <div>
        {activeSport.type === "table" && (
          <TableView data={formattedData} loading={loading} />
        )}
      </div>

      <GamesGrid />
    </div>
  );
}