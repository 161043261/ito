import express from "express";
import { login, logout, register } from "../service/user.js";

const router = express.Router();

export default function createUserRouter() {
  //! /api/v1/user/login
  router.post("/login", login);
  //! /api/v1/user/logout
  router.post("/logout", logout);
  //! /api/v1/user/register
  router.post("/register", register);
  return router;
}
