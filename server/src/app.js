import expressWs from "express-ws";
import app from "./router/index.js";
import http from "node:http";
const port = process.env.PORT ?? 3000;

global.chatRooms = {};

app.listen(port, () => {
  console.log("Server listening on port", port);
});

const server = http.createServer(app);
expressWs(app, server, {
  wsOptions: { maxPayload: 5 * 1024 * 1024 * 1024 },
});
