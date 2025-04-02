import expressWs from "express-ws";
import app from "./router/index.js";
import http from "node:http";
const port = process.env.PORT ?? 3000;

/**
 * @type {{ [email: string]: { ws: any, state: boolean } }}
 * @description { email: { ws, state } }
 * @description state 表示用户是否在音视频通话
 */
globalThis.OnlineUsers = {};

/**
 * @type {{ [roomKey: string]: { [receiverId: string]: any } }}
 * @description { roomKey: { receiverId: ws } }
 * @description receiverId: userId | groupId
 */
globalThis.ChatRooms = {};

/**
 * @type {{ [roomKey: string]: { [email: string]: any }}}
 * @description { roomKey: { email: ws } }
 */
globalThis.RtcRooms = {};

app.listen(port, () => {
  console.log(`Server: http://localhost:${port}/`);
});

const server = http.createServer(app);
expressWs(app, server, {
  wsOptions: { maxPayload: 5 * 1024 * 1024 * 1024 },
});
