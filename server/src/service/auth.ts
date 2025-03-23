import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import redis from "ioredis";
import type { Request, Response } from "express";
import { resErr } from "../utils/res.js";
import { BaseState } from "../utils/state.js";
import query from "../utils/query.js";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  if (!email || !password) {
    return resErr(res, BaseState.TokenInvalid);
  }

  try {
    const sql = `select * from users where username = ?`;
    const results = await query(sql, [email]);
    console.log("[service/auth] results:", results);
    if (results.length !== 0) {
      const payload = {
        id: results[0].id,
        avatar: results[0].avatar,
        email: results[0].email,
        password: results[0].password,
        username: results[0].password,
        salt: results[0].salt,
      };
      // 加盐
    }
  } catch (err) {
    console.error("[service/auth]", err);
  }
}
