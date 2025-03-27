import express from "express";
import expressWs from "express-ws";
import bodyParser from "body-parser";
import createUserRouter from "./user.js";
import createFriendRouter from "./friend.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
expressWs(app);

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
const staticHandler = (req, res, next) => {
  res.header("Content-Type", "application/octet-stream");
  // 预检 (pre-flight) 请求
  if (req.method.toLowerCase() === "options") {
    res.sendStatus(200);
  } else {
    next();
  }
};

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

app.use("/api/v1/user", userRouter);
app.use("/api/v1/friend", friendRouter);
export default app;
