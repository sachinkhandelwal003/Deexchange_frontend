// hooks/SocketProvider.jsx
import { createContext, useEffect, useRef, useState } from "react";

export const SocketContext = createContext();

export default function SocketProvider({ children }) {
  const socketRef = useRef(null);
  const [matches, setMatches] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  // Function to initialize WebSocket
  const initWebSocket = () => {
    // Determine WebSocket URL based on environment
    let wsUrl;
    
    if (window.location.hostname === "localhost") {
      // Your backend runs on port 3000
      wsUrl = `ws://localhost:3000/ws`;
    } else {
      // Production - use same hostname with wss for secure
      wsUrl = `wss://${window.location.hostname}/ws`;
    }

    console.log(`🔄 Connecting to WebSocket: ${wsUrl}`);
    setConnectionStatus("connecting");
    
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket Connected to backend");
      setConnectionStatus("connected");
    };

    socket.onmessage = (event) => {
      try {
        // Your backend sends batches every 200ms
        const dataArray = JSON.parse(event.data);
        
        if (!Array.isArray(dataArray)) return;
        
        console.log("📥 Received WebSocket batch:", dataArray.length, "messages at", new Date().toLocaleTimeString());
        setLastUpdate(new Date());

        // Process each message in the batch
        dataArray.forEach((data) => {
          if (!data || !data.api_type) return;

          // 🟢 MATCH INFO UPDATE
          if (data.api_type === "match_push_obj") {
            const matchId = data.response?.match_id;
            const matchInfo = data.response?.match_info;
            
            if (!matchInfo) return;

            setMatches((prev) => {
              const exists = prev.find((m) => m.match_info?.match_id === matchId);
              
              if (exists) {
                return prev.map((match) =>
                  match.match_info?.match_id === matchId
                    ? { 
                        ...match, 
                        match_info: { ...match.match_info, ...matchInfo },
                        live_odds: match.live_odds // Preserve odds
                      }
                    : match
                );
              } else {
                return [...prev, { match_info: matchInfo }];
              }
            });
          }

          // 🟢 ODDS UPDATE
          if (data.api_type === "odds_update") {
            const matchId = data.response?.match_id;
            const market = data.response?.market?.[0];
            
            if (!market || !market.runners) return;

            // Format odds from EntitySport format
            const runner1 = market.runners[0];
            const runner2 = market.runners[1];

            // EntitySport sends odds in arrays: [price, volume]
            const formattedOdds = {
              matchodds: {
                teama: {
                  back: runner1?.back?.[0]?.[0] || runner1?.back?.[0] || "-",
                  back_volume: runner1?.back?.[0]?.[1] || "0",
                  lay: runner1?.lay?.[0]?.[0] || runner1?.lay?.[0] || "-",
                  lay_volume: runner1?.lay?.[0]?.[1] || "0"
                },
                teamb: {
                  back: runner2?.back?.[0]?.[0] || runner2?.back?.[0] || "-",
                  back_volume: runner2?.back?.[0]?.[1] || "0",
                  lay: runner2?.lay?.[0]?.[0] || runner2?.lay?.[0] || "-",
                  lay_volume: runner2?.lay?.[0]?.[1] || "0"
                }
              },
              bookmaker: data.response?.bookmaker || null,
              tiedmatch: data.response?.tiedmatch || null
            };

            setMatches((prev) => {
              const exists = prev.find((m) => m.match_info?.match_id === matchId);
              
              if (exists) {
                return prev.map((match) =>
                  match.match_info?.match_id === matchId
                    ? { 
                        ...match, 
                        live_odds: {
                          ...match.live_odds,
                          ...formattedOdds
                        }
                      }
                    : match
                );
              } else {
                return [...prev, { 
                  match_info: { match_id: matchId },
                  live_odds: formattedOdds 
                }];
              }
            });
          }

          // 🟢 SESSION ODDS UPDATE (Fancy)
          if (data.api_type === "session_update") {
            const matchId = data.response?.match_id;
            const sessionData = data.response?.sessions || [];
            
            setMatches((prev) => {
              const exists = prev.find((m) => m.match_info?.match_id === matchId);
              
              if (exists) {
                return prev.map((match) =>
                  match.match_info?.match_id === matchId
                    ? { 
                        ...match, 
                        session_odds: sessionData
                      }
                    : match
                );
              } else {
                return [...prev, { 
                  match_info: { match_id: matchId },
                  session_odds: sessionData 
                }];
              }
            });
          }
        });
      } catch (err) {
        console.error("WebSocket Message Error:", err);
      }
    };

    socket.onclose = () => {
      console.log("🔴 WebSocket Closed. Reconnecting in 1s...");
      setConnectionStatus("disconnected");
      setTimeout(initWebSocket, 1000);
    };

    socket.onerror = (err) => {
      console.error("⚠️ WebSocket Error:", err);
      setConnectionStatus("error");
      socket.close();
    };
  };

  useEffect(() => {
    initWebSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        console.log("🧹 WebSocket Cleanup Done");
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={{ matches, lastUpdate, connectionStatus }}>
      {children}
    </SocketContext.Provider>
  );
}