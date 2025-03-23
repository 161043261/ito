import { Code2Msg } from "./state.js";
import type { Response } from "express";

// todo: 确定 res 的类型
export function resJson(res: Response, code?: number, data?: any) {
  const body = {
    code: 200,
    data: "",
    msg: "",
  };
  body.code = code ?? 200;
  body.data = data ?? "";
  body.msg = Code2Msg.get(code ?? 200) ?? "成功";
  res.json(body);
}
