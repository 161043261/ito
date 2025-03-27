import query from "../utils/query.js";
import { BaseState } from "../utils/state.js";
import { resErr, resOk } from "../utils/res.js";
import { v4 as uuidv4 } from "uuid";

export async function selectFriendsByTagId(tagId) {
  try {
    return await query("select id from friends where tag_id = ?", [tagId]);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function selectFriendsByUserId(userId) {
  const friends = [];
  try {
    const results = await query("select id from tags where user_id = ?", [userId]);
    for (const result of results) {
      const results = await selectFriendsByTagId(result.id);
      friends.push(results);
    }
    return friends;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export async function insertFriend(friendItem) {
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

export async function findUsers(req, res) {
  const sender = req.cookies["userInfo"];
  console.log("[service/friend] sender:", sender);
  const { email } = req.query;
  if (!sender || !email) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const results = await query(
      "select id, email, username, avatar from users where email like ?",
      [`%${email}%`],
    );
    if (results.length === 0) {
      return resOk(res, []);
    }
    const friends = await selectFriendsByUserId(sender.id);
    return resOk(
      res,
      results
        .filter((item) => item.email !== sender.email)
        .map((item) => ({
          ...item,
          flag: friends.some((friend) => friend.email === item.email),
        })),
    );
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

export async function addFriend(req, res) {
  const sender = req.cookies["userInfo"];
  const { id, email, avatar } = req.body;
  if (!id || !email || !avatar) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const uuid = uuidv4();
    const senderTags = await query("select id from tags where user_id = ?", [sender.id]);
    const friendItem = {
      user_id: id, // 所属用户 ID
      email, // 好友邮箱
      avatar, // 好友头像
      state: global.chatRooms.has(email) ? "online" : "offline", // 好友状态
      note_name: email, // 好友备注
      tag_id: senderTags[0].id, // 好友的标签 ID
      room_key: uuid, //
    };
    await insertFriend(friendItem);
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}
