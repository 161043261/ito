import express from "express";
import { auth } from "../utils/user.js";
const router = express.Router();

// todo
export default function createFriendRouter() {
  router.get("/friends", auth);
}
