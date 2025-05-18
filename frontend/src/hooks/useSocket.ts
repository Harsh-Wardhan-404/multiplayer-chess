import { useEffect, useState } from "react"
const WS_URL = "ws://localhost:8080";


export const useSocket = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    ws.onopen = () => {
      setSocket(ws);
    }

    ws.onclose = () => {
      setSocket(null);
    }

    return () => {
      ws.close();
    }
  }, [])
  return socket;
}

// Custom hook to manage WebSocket connection
// - Creates and maintains WebSocket connection to the server
// - Provides socket state to components
// - Handles connection open and close events
// - Automatically cleans up connection when component unmounts