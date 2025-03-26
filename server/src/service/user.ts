import crypto, { randomUUID } from "node:crypto";
import jwt from "jsonwebtoken";
import { Redis } from "ioredis";
import type { Request, Response } from "express";
import { resErr, resOk } from "../utils/res.js";
import { AuthState, BaseState } from "../utils/state.js";
import query from "../utils/query.js";
import { secretKey } from "../utils/user.js";

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const cachedToken = await redis.get(`token:${email}`);
  if (!email || !password) {
    return resErr(res, BaseState.ParamErr);
  }
  if (cachedToken) {
    return resErr(res, AuthState.UserLoggedIn);
  }

  try {
    //! const sql = `select * from users where email = ?`;
    //! const results = await query(sql, [email]);
    const sql = `select * from users where email = ?`;
    const results = await query(sql, [email]);
    if (results.length === 0) {
      return resErr(res, AuthState.EmailOrPassErr);
    }

    //! 解盐
    const { id, password: saltedPwd, username, avatar, signature } = results[0];
    const [salt, encodedPwd] = saltedPwd.split("$");
    const encodedPwd2 = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    if (encodedPwd !== encodedPwd2) {
      return resErr(res, AuthState.EmailOrPassErr);
    }

    //! 签发令牌
    const payload = { id, email };
    const token = jwt.sign(payload, secretKey);

    //! const sql2 = `update friends set state = ? where email = ?`;
    //! query(sql2, ["online", email])
    const sql2 = `update friends set state = ? where email = ?`;
    await Promise.all([
      query(sql2, ["online", email]),
      redis.set(`token:${email}`, token, "EX", 60 * 60 * 24),
    ]);

    //! email, password, username, avatar, signature
    const userInfo = { email, password, username, avatar, signature };
    return resOk(res, { token, userInfo: { ...userInfo, id } });
  } catch (err) {
    console.error("[service/user] login:", err);
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
    console.error("[service/user] logout:", err);
    return resErr(res, BaseState.ServerErr);
  }
}

export async function register(req: Request, res: Response) {
  const { email, password, avatar } = req.body;
  if (!email || !password || !avatar) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    //! const sql = `select count(*) as count from users where email = ?`;
    //! const results = await query(sql, [email]);
    const sql = `select count(*) as count from users where email = ?`;
    const results = await query(sql, [email]);
    if (Number.parseInt(results[0].count) !== 0) {
      return resErr(res, AuthState.UserRegistered);
    }

    //! 加盐
    const salt = randomUUID().toString().replaceAll("-", "");
    const encodedPwd = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    const saltedPwd = salt + "$" + encodedPwd;

    //! const sql2 = `insert into users set ?`;
    //! const results2 = await query(sql2, userInfo);
    const sql2 = `insert into users set ?`;
    //! email, password, username, avatar, signature
    const userInfo = {
      email,
      password: saltedPwd,
      username: email, // 默认
      avatar,
      signature: "谢谢你的关注",
    };
    const results2 = await query(sql2, userInfo);
    if (results2.affectedRows !== 1) {
      return resErr(res, BaseState.ServerErr);
    }

    //! const sql3 = `select * from users where email = ?`;
    //! const results3 = await query(sql3, [email]);
    const sql3 = `select * from users where email = ?`;
    const results3 = await query(sql3, [email]);

    //! const sql4 = `insert into tags set ?`;
    //! await query(sql4, [tag]);
    const sql4 = `insert into tags set ?`;
    const { id } = results3[0];
    // 默认标签
    const tag = { user_id: id, user_email: email, name: "好友" };
    await query(sql4, [tag]);

    //! 签发令牌
    const payload = { id, email };
    const token = jwt.sign(payload, secretKey);
    const data = { token, userInfo: { ...userInfo, id } };
    return resOk(res, data);
  } catch (err) {
    console.error("[service/user] register:", err);
    return resErr(res, BaseState.ServerErr);
  }
}
