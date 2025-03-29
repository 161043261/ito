import expressWs from "express-ws";
import app from "./router/index.js";
import http from "node:http";
const port = process.env.PORT ?? 3000;

/** @type {{ [email: string]: { ws: any, state: boolean } }} */
globalThis.onlineUsers = {};
/** @type {{ [roomKey: string]: { id: { ws: any } } }} */
globalThis.chatRooms = {};

app.listen(port, () => {
  console.log(`Server:   http://localhost:${port}/`);
});

const server = http.createServer(app);
expressWs(app, server, {
  wsOptions: { maxPayload: 5 * 1024 * 1024 * 1024 },
});
