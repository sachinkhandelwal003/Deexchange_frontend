import { useState } from "react";
import TrendingTabs from "./TrendingTabs";
import SportTabs from "./SportTabs";
import TableView from "./TableView";
import CardGrid from "./CardGrid";

import tabsData from "./tabsData";
import trendingTabsData from "./trendingTabsData";
import GamesGrid from "../GamesGrid";

export default function MainContent() {
  const [activeSport, setActiveSport] = useState(tabsData[0]);
  const [activeTrending, setActiveTrending] = useState(trendingTabsData[0]);

const tableData = [
  {
    id: 1,
    title: "Afghanistan U19 v Sri Lanka U19",
    date: "26/01/2026 13:00:00",
    back1: "2.24",
    lay1: "2.34",
    backX: "-",
    layX: "-",
    back2: "1.75",
    lay2: "1.8",
  },
  {
    id: 2,
    title: "Royal Challengers Bengaluru W v Mumbai Indians W",
    date: "26/01/2026 19:30:00",
    back1: "1.89",
    lay1: "1.91",
    backX: "-",
    layX: "-",
    back2: "2.08",
    lay2: "2.12",
  },
  {
    id: 3,
    title: "India v New Zealand",
    date: "28/01/2026 19:00:00",
    back1: "1.27",
    lay1: "1.28",
    backX: "-",
    layX: "-",
    back2: "4.5",
    lay2: "4.8",
  },
    {
    id: 4,
    title: "Afghanistan U19 v Sri Lanka U19",
    date: "26/01/2026 13:00:00",
    back1: "2.24",
    lay1: "2.34",
    backX: "-",
    layX: "-",
    back2: "1.75",
    lay2: "1.8",
  },
  {
    id: 5,
    title: "Royal Challengers Bengaluru W v Mumbai Indians W",
    date: "26/01/2026 19:30:00",
    back1: "1.89",
    lay1: "1.91",
    backX: "-",
    layX: "-",
    back2: "2.08",
    lay2: "2.12",
  },
  {
    id: 6,
    title: "India v New Zealand",
    date: "28/01/2026 19:00:00",
    back1: "1.27",
    lay1: "1.28",
    backX: "-",
    layX: "-",
    back2: "4.5",
    lay2: "4.8",
  },  {
    id: 7,
    title: "Afghanistan U19 v Sri Lanka U19",
    date: "26/01/2026 13:00:00",
    back1: "2.24",
    lay1: "2.34",
    backX: "-",
    layX: "-",
    back2: "1.75",
    lay2: "1.8",
  },
  {
    id: 8,
    title: "Royal Challengers Bengaluru W v Mumbai Indians W",
    date: "26/01/2026 19:30:00",
    back1: "1.89",
    lay1: "1.91",
    backX: "-",
    layX: "-",
    back2: "2.08",
    lay2: "2.12",
  },
  {
    id: 9,
    title: "India v New Zealand",
    date: "28/01/2026 19:00:00",
    back1: "1.27",
    lay1: "1.28",
    backX: "-",
    layX: "-",
    back2: "4.5",
    lay2: "4.8",
  }  ,{
    id: 10,
    title: "Afghanistan U19 v Sri Lanka U19",
    date: "26/01/2026 13:00:00",
    back1: "2.24",
    lay1: "2.34",
    backX: "-",
    layX: "-",
    back2: "1.75",
    lay2: "1.8",
  },
  {
    id: 11,
    title: "Royal Challengers Bengaluru W v Mumbai Indians W",
    date: "26/01/2026 19:30:00",
    back1: "1.89",
    lay1: "1.91",
    backX: "-",
    layX: "-",
    back2: "2.08",
    lay2: "2.12",
  },
  {
    id: 12,
    title: "India v New Zealand",
    date: "28/01/2026 19:00:00",
    back1: "1.27",
    lay1: "1.28",
    backX: "-",
    layX: "-",
    back2: "4.5",
    lay2: "4.8",
  }
];

  return (
    <div className="flex-1 bg-white rounded-xl shadow-lg">
      {/* ROW 1 – TRENDING */}
      <TrendingTabs
        tabs={trendingTabsData}
        active={activeTrending}
        onChange={setActiveTrending}
      />

      {/* ROW 2 – SPORTS */}
      <SportTabs
        tabs={tabsData}
        activeTab={activeSport}
        onChange={setActiveSport}
      />

      {/* CONTENT */}
      <div className="">
        {activeSport.type === "table" && (
          <TableView data={tableData} />
        )}

      </div>


      <GamesGrid/>
    </div>
  );
}