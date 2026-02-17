import { useEffect, useRef } from "react";

export default function useEntitySocket(onMessage) {
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:3000");

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ Connected to Backend");
    };

    socket.onmessage = (event) => {
      console.log("📩 Live Data:", event.data);

      try {
        const parsed = JSON.parse(event.data);
        if (onMessage) onMessage(parsed);
      } catch (err) {
        console.log("Invalid JSON:", event.data);
      }
    };

    socket.onerror = (err) => {
      console.log("WebSocket Error:", err);
    };

    socket.onclose = () => {
      console.log("WebSocket Closed");
    };

    return () => {
      socket.close();
    };
  }, [onMessage]);
}
