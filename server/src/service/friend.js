import query from "../utils/query.js";
import { BaseState } from "../utils/state.js";
import { resErr, resOk } from "../utils/res.js";
import { v4 as uuid } from "uuid";
import pub from "../utils/pub.js";
import { camel2snake, snack2camel } from "../utils/fmt.js";

/**
 *
 * @param {number} tagId
 */
async function selectFriendsByTagId(tagId) {
  try {
    const results = await query("select * from friends where tag_id = ?", [tagId]);
    console.warn("selectFriendsByTagId:", results);
    return results.map((item) => snack2camel(item));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 *
 * @param {number} userId
 */
async function selectFriendsByUserId(userId) {
  const friends = [];
  try {
    const tags = await query("select id from tags where user_id = ?", [userId]);
    for (const tag of tags) {
      const results = await selectFriendsByTagId(tag.id);
      friends.push(...results);
    }
    return friends;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 *
 * todo: specify typeof friendItem
 * @param {*} friendItem
 */
async function insertFriend(friendItem) {
  console.warn("insertFriend", friendItem);
  try {
    const { affectedRows } = await query("insert into friends set ?", friendItem);
    if (affectedRows !== 1) {
      throw "affectedRows !==  1";
    }
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//! >>>>>>>>>>>>>>>>>>>> DAO end >>>>>>>>>>>>>>>>>>>>

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @description Find friend list by username
 */
export async function findFriendListByName(req, res) {
  const sender = req.userInfo;
  const { username } = req.query;
  if (!sender || !username) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const results = await query(
      "select id, email, username, avatar from users where username like ?",
      [`%${username}%`],
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

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function addFriend(req, res) {
  const sender = req.userInfo;
  // 好友 ID, 好友邮箱, 好友头像
  const { id, email, avatar } = req.body;
  if (!id || !email || !avatar) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const roomKey = uuid();
    const senderTags = await query("select id from tags where user_id = ?", [sender.id]);
    const receiverTags = await query(`select id from tags where user_id = ?`, [id]);
    await Promise.all([
      insertFriend({
        // todo
        user_id: sender.id, // 所属用户 ID
        email, // 好友邮箱
        avatar, // 好友头像
        state: global.OnlineUsers[email] ? "online" : "offline", // 好友状态
        note_name: email, // 好友备注
        tag_id: senderTags[0].id, // 好友的标签 ID
        room_key: roomKey, // 房间号
      }),
      insertFriend({
        // todo
        user_id: id,
        email: sender.email,
        avatar: sender.avatar,
        state: global.OnlineUsers[sender.email] ? "online" : "offline",
        note_name: sender.email,
        tag_id: receiverTags[0].id,
        room_key: roomKey,
      }),
    ]);
    pub({ receiverEmail: email, type: "wsFriendList" });
    pub({ receiverEmail: sender.email, type: "wsFriendList" });
    return resOk(res);
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @description Find tagged friends list
 */
export async function findFriendList(req, res) {
  try {
    const sender = req.userInfo;
    const results = await query("select id, name from tags where user_id = ?", [sender.id]);
    if (results.length === 0) {
      return resOk(res, []);
    }
    const taggedFriendsList = [];
    for (const result of results) {
      const taggedFriends = { tagName: result.name, onlineCnt: 0, friends: [] };
      const friends = await selectFriendsByTagId(result.id);
      for (const friend of friends) {
        taggedFriends.friends.push(friend);
        if (friend.state === "online") {
          taggedFriends.onlineCnt++;
        }
      }
      taggedFriendsList.push(taggedFriends);
    }
    const friendList = taggedFriendsList;
    return resOk(res, friendList);
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @description Find friend by friend's user ID
 */
export async function findFriendById(req, res) {
  const { id } = req.query;
  if (!id) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const sql = `
select f.id      as friend_id,
       f.user_id as friend_user_id,
       f.state,
       f.tag_id,
       f.room_key,
       f.unread_cnt,
       t.name    as tag_name,
       u.email,
       u.avatar,
       u.username,
       u.signature
from friends as f
       join users as u on f.user_id = u.id
       join tags as t on f.tag_id = t.id
where f.id = ?;
    `;
    const results = await query(sql, [id]);
    console.warn("findFriendById:", results);
    if (results.length !== 0) {
      return resOk(res, snack2camel(results[0]));
    }
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function findTagList(req, res) {
  const userId = req.userInfo.id;
  if (!userId) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const results = await query("select * from tags where user_id = ?", [userId]);
    console.warn("findTagList:", results);
    return resOk(
      res,
      results.map((item) => snack2camel(item)),
    );
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function createTag(req, res) {
  // userId, userEmail, name
  const tag = req.body;
  if (!tag) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const { affectedRows } = await query("insert into tags set ?", camel2snake(tag));
    if (affectedRows === 1) {
      return resOk(res);
    }
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export async function updateFriend(req, res) {
  const { friendId, noteName, tagId } = req.body;
  if (!friendId || !noteName || !tagId) {
    return resErr(res, BaseState.ParamErr);
  }
  try {
    const { affectedRows } = await query(
      "update friends set note_name = ?, tag_id = ? where id = ?",
      [noteName, tagId, friendId],
    );
    if (affectedRows === 1) {
      return resOk(res);
    }
  } catch (err) {
    console.error(err);
    return resErr(res, BaseState.ServerErr);
  }
}
