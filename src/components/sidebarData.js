const sidebarData = [
    // 🏇 RACING
  {
    id: "racing",
    title: "Racing Sports",
    children: [
      { id: "horse", title: "Horse Racing" },
      { id: "greyhound", title: "Greyhound Racing" },
    ],
  },

  // 🎰 OTHERS
  {
    id: "others",
    title: "Others",
    children: [
      { id: "casino", title: "Our Casino", premium: true },
      { id: "vip", title: "Our VIP Casino", premium: true },
      { id: "premium", title: "Our Premium Casino", premium: true },
      { id: "virtual", title: "Our Virtual", premium: true },
      { id: "tembo", title: "Tembo" },
      { id: "live", title: "Live Casino" },
      { id: "slot", title: "Slot Game" },
      { id: "fantasy", title: "Fantasy Game" },
    ],
  },
  {
    id: "all-sports",
    title: "All Sports",
    children: [
      // 🏏 CRICKET (nested)
      {
        id: "cricket",
        title: "Cricket",
        children: [
          {
            id: "international",
            title: "International",
            children: [
              {
                id: "asia",
                title: "Asia",
                children: [
                  { id: "india", title: "India" },
                  { id: "pakistan", title: "Pakistan" },
                ],
              },
            ],
          },
        ],
      },

      // ⚽ FOOTBALL (nested)
      {
        id: "football",
        title: "Football",
        children: [
          {
            id: "europe",
            title: "Europe",
            children: [
              { id: "epl", title: "Premier League" },
              { id: "laliga", title: "La Liga" },
            ],
          },
        ],
      },

      // 🟢 FLAT SPORTS
      { id: "tennis", title: "Tennis" },
      { id: "table-tennis", title: "Table Tennis" },
      { id: "badminton", title: "Badminton" },
      { id: "basketball", title: "Basketball" },
      { id: "volleyball", title: "Volleyball" },
      { id: "snooker", title: "Snooker" },
      { id: "ice-hockey", title: "Ice Hockey" },
      { id: "esoccer", title: "Esoccer" },
      { id: "egames", title: "E Games" },
      { id: "futsal", title: "Futsal" },
      { id: "handball", title: "Handball" },
      { id: "kabaddi", title: "Kabaddi" },
      { id: "golf", title: "Golf" },
      { id: "rugby-league", title: "Rugby League" },
      { id: "boxing", title: "Boxing" },
      { id: "beach-volleyball", title: "Beach Volleyball" },
      { id: "mixed-martial-arts", title: "Mixed Martial Arts" },
      { id: "motogp", title: "MotoGP" },
      { id: "chess", title: "Chess" },
      { id: "cycling", title: "Cycling" },
      { id: "motorbikes", title: "Motorbikes" },
      { id: "athletics", title: "Athletics" },
      { id: "basketball-3x3", title: "Basketball 3X3" },
      { id: "sumo", title: "Sumo" },
      { id: "virtual-sports", title: "Virtual Sports" },
      { id: "motor-sports", title: "Motor Sports" },
      { id: "baseball", title: "Baseball" },
      { id: "rugby-union", title: "Rugby Union" },
      { id: "darts", title: "Darts" },
      { id: "american-football", title: "American Football" },
      { id: "soccer", title: "Soccer" },
      { id: "esports", title: "ESports" },
    ],
  },


];

export default sidebarData;