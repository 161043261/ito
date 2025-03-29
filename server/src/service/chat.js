import { camel2snake, fmtBytes } from "../utils/fmt";
import pub from "../utils/pub.js";
import query from "../utils/query.js";
import { BaseState } from "../utils/state.js";
import { resOk, resErr } from "../utils/res.js";

/**
 *
 * @param {string} roomKey
 */
async function updateMsgStats(roomKey) {
  const results = await query("select * from msg_stats where room_key = ?", roomKey);
  if (results.length === 0) {
    await query("insert into msg_stats set ?", { room_key: roomKey, total: 0 });
  }
  await query("update msg_stats set total = total + 1 where room_key = ?", [roomKey]);
}

/**
 *
 * @param {'friend' | 'group'} type
 * @param {string} roomKey
 * @param {any} writeMsg
 * @param {any} sendMsg
 */
async function writeAndSend(type, roomKey, writeMsg, sendMsg) {
  // 群聊, 或
  if (type === "group" || (type === "friend" && global.ChatRooms[roomKey][sendMsg.receiverId])) {
    writeMsg.state = 1;
  } else {
    writeMsg.state = 0;
  }
  console.warn("writeAndSend:", writeMsg);
  await Promise.all([
    query("insert into messages set ?", camel2snake(writeMsg)),
    updateMsgStats(roomKey),
  ]);
  // todo
  sendMsg.fileSize = fmtBytes(writeMsg.fileSize);
  for (const receiverId /** userId | groupId */ in global.ChatRooms[roomKey]) {
    global.ChatRooms[roomKey][receiverId].send(JSON.stringify(sendMsg));
  }
  if (type === "group") {
    const results = await query("select user_id from group_members where group_id = ?", [
      sendMsg.receiverId,
    ]);
    for (const key of results) {
      if (results[key].userId !== sendMsg.senderId) {
        pub({ receiverId: results[key].email, type: "wsMsgList" });
      }
    }
  } else {
    pub({ receiverId: sendMsg.receiverId, type: "wsMsgList" });
  }
}

/**
 *
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
export function findChatList(req, res) {
  try {
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
export function createChat(req, res) {}
