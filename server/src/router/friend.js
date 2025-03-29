import express from "express";
import auth from "../utils/auth.js";
import {
  addFriend,
  createTag,
  findFriendList,
  findTagList,
  findFriendById,
  findFriendListByName,
  updateFriend,
} from "../service/friend.js";
const router = express.Router();

export default function createFriendRouter() {
  //! /api/v1/friend/name
  router.get("/name", auth, findFriendListByName);
  //! /api/v1/friend/add
  router.post("/add", auth, addFriend);
  //! /api/v1/friend/list
  router.get("/list", auth, findFriendList);
  //! /api/v1/friend/id
  router.get("/", auth, findFriendById);
  //! /api/v1/friend/tag-list
  router.get("/tag-list", auth, findTagList);
  //! /api/v1/friend/create-tag
  router.post("/create-tag", auth, createTag);
  //! /api/v1/friend/update
  router.post("/update", auth, updateFriend);
  return router;
}
