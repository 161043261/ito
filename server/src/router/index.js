import express from "express";
import expressWs from "express-ws";
import bodyParser from "body-parser";
import createUserRouter from "./user.js";
import createFriendRouter from "./friend.js";

const app = express();
expressWs(app);

// 解析 HTTP 请求体参数
// 将请求体解析为 JSON 对象 或 URL-encoded 格式, 并限制请求体大小 <= 100mb
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  // 预检 (pre-flight) 请求
  if (req.method.toLowerCase() === "options") {
    res.sendStatus(200);
    // res.end();
  } else {
    next();
  }
}

const staticHandler = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/octet-stream");
  // 预检 (pre-flight) 请求
  if (req.method.toLowerCase() === "options") {
    res.sendStatus(200);
    // res.end();
  } else {
    next();
  }
};

// 跨域
app.use("", cors);
app.use("/upload", staticHandler, express.static("upload"));

//! /api/v1/user/login
//! /api/v1/user/logout
//! /api/v1/user/register
const userRouter = createUserRouter();
//! /api/v1/friend/search
//! /api/v1/friend/add
//! /api/v1/friend/list
//! /api/v1/friend
//! /api/v1/friend/tag-list
//! /api/v1/friend/add-tag
//! /api/v1/friend/update
const friendRouter = createFriendRouter();

app.use("/api/v1/user", cors, userRouter);
app.use("/api/v1/friend", cors, friendRouter);
export default app;
