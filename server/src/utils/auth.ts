import {
  type NextFunction,
  type Request,
  // type RequestHandler,
  type Response,
} from "express";
import jwt from "jsonwebtoken";
import { hash } from "ohash";
import { resJson } from "./res.js";
import { BaseState } from "./state.js";

// 生成 32 位 hash 字符串
export const secretKey = hash(`${Date.now() + Math.random()}`);

export function auth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization;
  if (!token) {
    return resJson(res, BaseState.TokenErr);
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return resJson(res, BaseState.TokenErr);
    } else {
      // todo
      console.log("decoded:", decoded);
      req.cookies.email = decoded;
      next();
    }
  });
}
