import express from "express";
import { findAllMsgLists, connChat } from "../service/chat.js";
import auth from "../utils/auth.js";

const router = express.Router();

export default function createChatRouter() {
  //! /api/v1/chat/msg-lists
  router.get("/msg-lists", auth, findAllMsgLists);
  //! /api/v1/chat/conn
  router.ws("/conn", connChat);
  return router;
}
