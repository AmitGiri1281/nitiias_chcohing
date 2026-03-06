// import { io } from "socket.io-client";

// const SOCKET_URL =
//   import.meta.env.VITE_SOCKET_URL ||
//   "https://nitiias-chcohing-backend.onrender.com";

// const socket = io(SOCKET_URL, {
//   withCredentials: true,
//   transports: ["websocket"],
//   secure: true, // 🔥 important for production
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 2000,
// });

// export default socket;

import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  withCredentials: true,
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 2000,
});

export default socket;