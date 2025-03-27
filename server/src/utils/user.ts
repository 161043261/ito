import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { resJson } from "./res.js";
import { BaseState } from "./state.js";

// secretKey.length === 32
export const secretKey = crypto.randomBytes(16).toString("hex");

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return resJson(res, BaseState.TokenInvalid);
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return resJson(res, BaseState.TokenInvalid);
    } else {
      // todo
      console.log("[utils/user] decoded:", decoded);
      next();
    }
  });
}
