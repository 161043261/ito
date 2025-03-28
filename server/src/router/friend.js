import express from "express";
import auth from "../utils/auth.js";
import {
  addFriend,
  addTag,
  fetchFriendList,
  fetchTagList,
  findFriendById,
  searchUsers,
  updateFriend,
} from "../service/friend.js";
const router = express.Router();

export default function createFriendRouter() {
  //! /api/v1/friend/search
  router.get("/search", auth, searchUsers);
  //! /api/v1/friend/add
  router.post("/add", auth, addFriend);
  //! /api/v1/friend/list
  router.get("/list", auth, fetchFriendList);
  //! /api/v1/friend
  router.get("/", auth, findFriendById);
  //! /api/v1/friend/tag-list
  router.get("/tag-list", auth, fetchTagList);
  //! /api/v1/friend/add-tag
  router.post("/add-tag", auth, addTag);
  //! /api/v1/friend/update
  router.post("/update", auth, updateFriend);
  return router;
}
