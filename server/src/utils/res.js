import { Code2Msg } from "./state.js";

export function resJson(res, code, data) {
  const body = {
    code: 200,
    data: "",
    msg: "",
  };
  body.code = code ?? 200;
  body.data = data ?? "";
  body.msg = Code2Msg.get(body.code) ?? "成功";
  res.json(body);
}

export function resErr(res, code) {
  resJson(res, code ?? 400 /** code */, "" /** data */);
}

export function resOk(res, data) {
  resJson(res, 200 /** code */, data ?? "" /** data */);
}
