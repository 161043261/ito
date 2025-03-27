import crypto, { randomUUID } from "node:crypto";
// import { promises as fs } from "node:fs";
import jwt from "jsonwebtoken";
import { Redis } from "ioredis";
import { resErr, resOk } from "../utils/res.js";
import { UserState, BaseState } from "../utils/state.js";
import query from "../utils/query.js";
import { secretKey } from "../utils/auth.js";

// import { fileURLToPath } from "url";
// import { dirname } from "node:path";
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

const redis = new Redis({
  host: "127.0.0.1",
  port: 6379,
});

export async function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    return resErr(res, BaseState.ParamErr);
  }
  // const cachedToken = await redis.get(`token:${email}`);
  // if (cachedToken) {
  //   return resErr(res, UserState.UserLoggedIn);
  // }

  try {
    const results = await query("select * from users where email = ?", [email]);
    if (results.length === 0) {
      return resErr(res, UserState.EmailOrPassErr);
    }

    //! 解盐
    const { id, password: saltedPwd, username, avatar, signature } = results[0];
    const [salt, encodedPwd] = saltedPwd.split("$");
    const encodedPwd2 = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    if (encodedPwd !== encodedPwd2) {
      return resErr(res, UserState.EmailOrPassErr);
    }

    //! 签发令牌
    const payload = { id, email };
    const token = jwt.sign(payload, secretKey);

    await Promise.all([
      query("update friends set state = ? where email = ?", ["online", email]),
      redis.set(`token:${email}`, token, "EX", 60 * 60 * 24),
    ]);
    //! id, email, password, username, avatar, signature
    const userInfo = { id, email, password, username, avatar, signature };

    ///////////////////////////////////
    req.cookies["userInfo"] = userInfo;
    res.cookie("userInfo", userInfo);
    ///////////////////////////////////

    return resOk(res, { token });
  } catch (err) {
    console.error("[service/user] login:", err);
    resErr(res, BaseState.ServerErr);
  }
}

export async function logout(req, res) {
  const { email } = req.body;
  if (!email) {
    return resErr(res, BaseState.ParamErr);
  }

  try {
    await Promise.all([
      query("update friends set state = ? where email = ?", ["offline", email]),
      redis.del(`token:${email}`),
    ]);
    return resOk(res);
  } catch (err) {
    console.error("[service/user] logout:", err);
    return resErr(res, BaseState.ServerErr);
  }
}

export async function register(req, res) {
  const { email, password, avatar } = req.body;
  if (!email || !password || !avatar) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const results = await query("select count(*) as count from users where email = ?", [email]);
    if (Number.parseInt(results[0].count) !== 0) {
      return resErr(res, UserState.UserRegistered);
    }

    //! 加盐
    const salt = randomUUID().toString().replaceAll("-", "");
    const encodedPwd = crypto
      .createHash("md5")
      .update(salt + password)
      .digest("hex");
    const saltedPwd = salt + "$" + encodedPwd;

    const userInfo = {
      email,
      password: saltedPwd,
      username: email, // 默认
      avatar,
      signature: "", // 默认
    };
    const { affectedRows } = await query("insert into users set ?", userInfo);
    if (affectedRows !== 1) {
      return resErr(res, BaseState.ServerErr);
    }
    // 数组解构赋值, 对象解构赋值
    const [{ id }] = await query("select * from users where email = ?", [email]);
    // 默认标签
    const tag = { user_id: id, user_email: email, name: "好友" };
    await query("insert into tags set ?", [tag]);

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
