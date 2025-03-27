import type { Request, Response } from "express";
import query from "../utils/query.js";
import { BaseState } from "../utils/state.js";
import { resErr } from "../utils/res.js";

export async function findFriendsByTagId(tagId: number) {
  try {
    return await query("select id from friends where tag_id = ?", [tagId]);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function findFriendsByUserId(userId: number) {
  const friends = [];
  try {
    const results = await query("select id from tags where user_id = ?", [userId]);
    for (const result of results) {
      const results = await findFriendsByTagId(result.id);
      friends.push(results);
    }
    return friends;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function addFriend(friendItem: unknown) {
  try {
    const results = await query("insert into friends set ?", friendItem);
    if (results.affectedRows !== 1) {
      throw "affectedRows !==  1";
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function findUser(req: Request, res: Response) {
  const sender = req.cookies["userInfo"];
  console.log(sender);
  const { email } = req.query;
  if (!sender || !email) {
    return resErr(res, BaseState.ParamErr);
  }
}
