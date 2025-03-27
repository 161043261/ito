import express from "express";
import { auth } from "../utils/auth.js";
import {
  addFriend,
  addTag,
  fetchFriendList,
  fetchTagList,
  findFriendByUserId,
  searchUsers,
  updateFriend,
} from "../service/friend.js";
const router = express.Router();

export default function createFriendRouter() {
  //! /api/v1/friend/search
  router.get("/search", auth, searchUsers);
  //! /api/v1/friend/add
  router.post("/add", addFriend);
  //! /api/v1/friend/list
  router.get("/list", fetchFriendList);
  //! /api/v1/friend
  router.get("/", findFriendByUserId);
  //! /api/v1/friend/tag-list
  router.get("/tag-list", fetchTagList);
  //! /api/v1/friend/add-tag
  router.post("/add-tag", addTag);
  //! /api/v1/friend/update
  router.post("/update", updateFriend);
  return router;
}
