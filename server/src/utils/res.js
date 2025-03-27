import { Code2Msg } from "./state.js";

export function resJson(res, code, data) {
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

export function resErr(res, code) {
  resJson(res, code /** code */, "" /** data */);
}

export function resOk(res, data, code) {
  resJson(res, code ?? 200 /** code */, data ?? "" /** data */);
}
