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
