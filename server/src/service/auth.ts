import crypto, { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { Redis } from "ioredis";
import type { Request, Response } from "express";
import { resErr, resOk } from "../utils/res.js";
import { AuthState, BaseState } from "../utils/state.js";
import query from "../utils/query.js";
import { secretKey } from "../utils/auth.js";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return resErr(res, BaseState.ParamErr);
  }

  try {
    const sql = `select * from users where username = ?`;
    const results = await query(sql, [email]);
    console.log("[service/auth] results:", results);
    if (results.length === 0) {
      return resErr(res, AuthState.EmailOrPassErr);
    }

    const payload = {
      id: results[0].id,
      email: results[0].email,
      username: results[0].username,
      // avatar: results[0].avatar,
    };

    // 加盐
    const [salt, encodedPwd] = password.split("$");
    const encodedPwd2 = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    if (encodedPwd !== encodedPwd2) {
      return resErr(res, AuthState.EmailOrPassErr);
    }

    const token = jwt.sign(payload, secretKey);
    const data = {
      token,
      info: {
        ...payload,
        password,
        avatar: results[0].avatar,
      },
    };
    const cachedToken = await redis.get(`token:${payload.email}`);
    if (cachedToken) {
      return resErr(res, AuthState.UserLoggedIn);
    }
    const sql2 = `update friends set state = ? where email = ?`;
    await Promise.all([
      query(sql2, ["online", email]),
      redis.set(`token:${payload.email}`, token, "EX", 60 * 60 * 24),
    ]);
    return resOk(res, data);
  } catch (err) {
    console.error("[service/auth] login:", err);
    resErr(res, BaseState.ServerErr);
  }
}

export async function logout(req: Request, res: Response) {
  const { email } = req.body;
  if (!email) {
    return resErr(res, BaseState.ParamErr);
  }

  try {
    const sql = `update friends set state = ? where email = ?`;
    await Promise.all([query(sql, ["offline", email]), redis.del(`token:${email}`)]);
    return resOk(res);
  } catch (err) {
    console.error("[service/auth] logout:", err);
    return resErr(res, BaseState.ServerErr);
  }
}

export async function register(req: Request, res: Response) {
  const { email, password, username, avatar } = req.body;
  if (!email || !password || !avatar) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const sql = `select email, password from users where email = ?`;
    const results = await query(sql, [email]);
    if (results.length !== 0) {
      return resErr(res, AuthState.UserRegistered);
    }
    const salt = randomUUID().toString().replaceAll("-", "");
    const encodedPwd = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    const saltedPwd = salt + "$" + encodedPwd;
    const user = {
      email,
      password: saltedPwd,
      username: username,
      signature: "",
    };
    const sql2 = `insert into user set ?`;
    const results2 = await query(sql2, user);
    if (results2[0].affectedRows !== 1) {
      return resErr(res, BaseState.ServerErr);
    }
    const sql3 = `select * from user where email = ?`;
    const results3 = await query(sql3, [email]);
    const tag = {
      user_id: results3[0].id,
      email,
      tag_name: "Contact", // 默认标签
    };
    const sql4 = `insert into tags set ?`;
    await query(sql4, tag);
    const payload = {
      id: results3[0].id,
      email,
      username,
      // avatar,
    };
    const token = jwt.sign(payload, secretKey);
    const data = {
      token,
      info: {
        ...payload,
        avatar,
        signature: "",
      },
    };
    return resOk(res, data);
  } catch (err) {
    console.error("[service/auth] register:", err);
    return resErr(res, BaseState.ServerErr);
  }
}

// export async function(req: Request, res: Response) {

// }
