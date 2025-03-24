/* eslint-disable @typescript-eslint/no-explicit-any */
import { Code2Msg } from "./state.js";
import type { Response } from "express";

export function resJson(res: Response, code?: number, data?: any) {
  const body = {
    code: 200,
    data: "",
    msg: "",
  };
  body.code = code ?? 200;
  body.data = data ?? "";
  body.msg = Code2Msg.get(code ?? 200) ?? "success";
  res.json(body);
}

export function resErr(res: Response, code: number) {
  resJson(res, code /** code */, "" /** data */);
}

export function resOk(res: Response, data?: any, code?: number) {
  resJson(res, code ?? 200 /** code */, data ?? "" /** data */);
}
