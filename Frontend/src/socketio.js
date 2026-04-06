import { io } from "socket.io-client";

const socket = io("https://vibenet-pn8t.onrender.com", {
  transports: ["websocket"],
  withCredentials: true
});

export default socket;