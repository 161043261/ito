import expressWs from "express-ws";
import app from "./router/index.js";
import http from "node:http";
const port = process.env.PORT ?? 3000;

/** @type {{ [email: string]: { ws: any, state: boolean } }} */
globalThis.OnlineUsers = {};
/** @type {{ [roomKey: string]: { receiverId: { ws: any } } }} */
globalThis.ChatRooms = {};

app.listen(port, () => {
  console.log(`Server:   http://localhost:${port}/`);
});

const server = http.createServer(app);
expressWs(app, server, {
  wsOptions: { maxPayload: 5 * 1024 * 1024 * 1024 },
});
