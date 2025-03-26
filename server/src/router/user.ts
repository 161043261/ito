import express from "express";
import { login, logout, register } from "../service/user.js";

const router = express.Router();

export default function createUserRouter() {
  router.post("/login", login);
  router.post("/logout", logout);
  router.post("/register", register);
  return router;
}
