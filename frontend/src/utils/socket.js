import { io } from "socket.io-client";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const socket = io(baseURL.replace("/api", ""), {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;