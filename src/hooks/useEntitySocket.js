// hooks/useEntitySocket.js
import { useEffect, useRef } from "react";

const useEntitySocket = (onMessage) => {
  const wsRef = useRef(null);

  useEffect(() => {
    // Use the correct WebSocket URL - your backend server
    const wsUrl = `ws://${window.location.hostname}:3000`; // Make sure this matches your backend port
    console.log("🔄 Connecting to WebSocket:", wsUrl);
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("✅ Connected to Backend WebSocket");
      wsRef.current = ws;
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Live Data:", data);
        
        if (onMessage) {
          onMessage(data);
        }
      } catch (error) {
        console.error("Error parsing WebSocket data:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
    };

    ws.onclose = (event) => {
      console.log("🔴 WebSocket Closed:", event.code, event.reason);
      // Try to reconnect after 3 seconds
      setTimeout(() => {
        console.log("🔄 Attempting to reconnect...");
        wsRef.current = null;
      }, 3000);
    };

    wsRef.current = ws;

    return () => {
      console.log("🧹 Cleaning up WebSocket connection");
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [onMessage]);

  return wsRef.current;
};

export default useEntitySocket;