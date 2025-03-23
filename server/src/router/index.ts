import express, {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
} from "express";
import expressWs from "express-ws";
import bodyParser from "body-parser";

const app = express();
expressWs(app);

// 解析 HTTP 请求体参数
// 将请求体解析为 JSON 对象 或 URL-encoded 格式, 并限制请求体大小 <= 100mb
app.use(bodyParser.json({ limit: "100mb" }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

function corsHandler(req: Request, res: Response, next: NextFunction) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json;charset=utf-8");
  // 预检 (pre-flight) 请求
  if (req.method.toLowerCase() === "options") {
    res.sendStatus(200);
    // res.end();
  } else {
    next();
  }
}

const staticHandler: RequestHandler = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/octet-stream");
  // 预检 (pre-flight) 请求
  if (req.method.toLowerCase() === "options") {
    res.sendStatus(200);
    // res.end();
  } else {
    next();
  }
};

// 跨域
app.use("", corsHandler);
app.use("/upload", staticHandler, express.static("upload"));

export default app;
