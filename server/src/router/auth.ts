import express from "express";
import { login, logout, register } from "../service/auth.js";

const router = express.Router();

export default function createAuthRouter() {
  router.post("/login", login);
  router.post("/logout", logout);
  router.post("/register", register);
  return router;
}
