import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { resErr } from "./res.js";
import { BaseState } from "./state.js";

// secretKey.length === 32
export const secretKey = crypto.randomBytes(16).toString("hex");

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 */
export default function auth(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return resErr(res, BaseState.TokenInvalid);
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return resErr(res, BaseState.TokenInvalid);
    } else {
      console.log("[utils/user] decoded:", decoded);
      req.userInfo = decoded;
      next();
    }
  });
}
