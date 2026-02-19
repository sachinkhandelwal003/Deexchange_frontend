import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";

import TrendingTabs from "./TrendingTabs";
import SportTabs from "./SportTabs";
import TableView from "./TableView";
import GamesGrid from "../GamesGrid";
import { SocketContext } from "../../hooks/SocketProvider";

import tabsData from "./tabsData";
import trendingTabsData from "./trendingTabsData";

export default function MainContent() {
  const [activeSport, setActiveSport] = useState(tabsData[0]);
  const [activeTrending, setActiveTrending] = useState(trendingTabsData[0]);
  const { matches } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);

  // 🔥 Initial Fetch Only (NO socket here)
  const fetchCricketMatches = async () => {
    try {
      setLoading(true);

      const ACCESS_TOKEN = import.meta.env.VITE_ENTITYSPORT_TOKEN;

      const response = await axios.get(
        `https://restapi.entitysport.com/exchange/matches?token=${ACCESS_TOKEN}`
      );


    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeSport.id === "cricket" && matches.length === 0) {
      fetchCricketMatches();
    }
  }, [activeSport]);

  // 🔥 Format Data (optimized)
  const formattedData = useMemo(() => {
  return matches.map((match) => {
    const matchInfo = match.match_info || {};
    const odds = match.live_odds?.matchodds || {};

    return {
      id: matchInfo.match_id,   // ✅ correct id
      title:
        matchInfo.title ||
        `${matchInfo.teama?.name || ""} vs ${matchInfo.teamb?.name || ""}`,

      date: matchInfo.date_start_ist || "",
      status: matchInfo.status_str || "",
      isLive: matchInfo.status_str === "Live",

      back1: odds.teama?.back || "-",
      lay1: odds.teama?.lay || "-",

      backX: "-",
      layX: "-",

      back2: odds.teamb?.back || "-",
      lay2: odds.teamb?.lay || "-",
    };
  });
}, [matches]);

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

      {activeSport.type === "table" && (
        <TableView
          data={formattedData}
          loading={loading && matches.length === 0}
        />
      )}

      <GamesGrid />
    </div>
  );
}
