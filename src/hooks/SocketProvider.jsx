import { createContext, useEffect, useRef, useState } from "react";

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [matches, setMatches] = useState([]);

  // Function to initialize WebSocket
  const initWebSocket = () => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${protocol}://${window.location.hostname}:3000/ws`;
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    console.log(`🔄 Connecting to WebSocket: ${wsUrl}`);

    socket.onopen = () => {
      console.log("✅ WebSocket Connected");
    };

    socket.onmessage = (event) => {
      try {
        const dataArray = JSON.parse(event.data);
        if (!Array.isArray(dataArray)) return;

        dataArray.forEach((data) => {
          if (!data || !data.api_type) return;

          // 🟢 MATCH INFO UPDATE
          if (data.api_type === "match_push_obj") {
            const matchId = data.response?.match_id;
            const matchInfo = data.response?.match_info;
            if (!matchInfo || matchInfo?.oddstype !== "betfair") return;

            setMatches((prev) => {
              const exists = prev.find((m) => m.match_id === matchId);
              if (exists) {
                return prev.map((match) =>
                  match.match_id === matchId
                    ? { ...match, ...matchInfo }
                    : match
                );
              } else {
                return [...prev, matchInfo];
              }
            });
          }

          // 🟢 ODDS UPDATE
          if (data.api_type === "odds_update") {
            const matchId = data.response?.match_id;
            const market = data.response?.market?.[0];
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
      } catch (err) {
        console.error("WebSocket Message Error:", err);
      }
    };

    socket.onclose = () => {
      console.log("🔴 WebSocket Closed. Reconnecting in 3s...");
      setTimeout(initWebSocket, 3000); // auto-reconnect
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket Error:", err);
      socket.close();
    };
  };

  useEffect(() => {
    initWebSocket();

    // Cleanup on unmount
    return () => {
      socketRef.current?.close();
      console.log("🧹 WebSocket Cleanup Done");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ matches }}>
      {children}
    </SocketContext.Provider>
  );
}
