import express from "express";
import expressWs from "express-ws";
import bodyParser from "body-parser";
import createUserRouter from "./user.js";
import createFriendRouter from "./friend.js";

const app = express();
expressWs(app);

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function cors(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-type", "application/json;charset=utf-8");
  // 预检 (pre-flight) 请求
  if (req.method.toLowerCase() === "options") {
    res.sendStatus(200);
  } else {
    next();
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
function staticHandler(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/octet-stream");
  // 预检 (pre-flight) 请求
  if (req.method.toLowerCase() === "options") {
    res.sendStatus(200);
  } else {
    next();
  }
}

app.use("/upload", staticHandler, express.static("upload"));

app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

//! /api/v1/user/login
//! /api/v1/user/logout
//! /api/v1/user/register
//! /api/v1/user/update-pwd
//! /api/v1/user/update-info
const userRouter = createUserRouter();

//! /api/v1/friend/search
//! /api/v1/friend/add
//! /api/v1/friend/list
//! /api/v1/friend
//! /api/v1/friend/tag-list
//! /api/v1/friend/add-tag
//! /api/v1/friend/update
const friendRouter = createFriendRouter();

app.use("", cors);
app.use("/api/v1/user", cors, userRouter);
app.use("/api/v1/friend", cors, friendRouter);

export default app;
