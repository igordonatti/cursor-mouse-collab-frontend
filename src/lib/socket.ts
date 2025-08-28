import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL || "http://localhost:3000";

export const socket = io(URL, {
  autoConnect: false, // Vamos conectar manualmente através de um componente
});
