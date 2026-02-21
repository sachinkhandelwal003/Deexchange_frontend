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
    const dataArray = JSON.parse(event.data);
    if (!Array.isArray(dataArray)) return;

    setLastUpdate(new Date());

    setMatches((prev) => {
      let updated = [...prev];

      dataArray.forEach((data) => {
        if (!data?.response?.match_info) return;

        const matchId = data.response.match_info.match_id;

        const existingIndex = updated.findIndex(
          (m) => String(m.match_info?.match_id) === String(matchId)
        );

        const fullMatchData = {
          match_info: data.response.match_info,
          live_odds: data.response.live_odds || {},
          session_odds: data.response.session_odds || []
        };

        if (existingIndex !== -1) {
          updated[existingIndex] = fullMatchData;
        } else {
          updated.push(fullMatchData);
        }
      });

      return updated;
    });

  } catch (err) {
    console.error("WebSocket error:", err);
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