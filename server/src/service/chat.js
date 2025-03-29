import { camel2snake } from "../utils/fmt";
import query from "../utils/query";

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
 * @param {'p2p' | 'group'} type
 * @param {string} roomKey
 * @param {any} writeMsg
 * @param {any} sendMsg
 */
async function writeAndSend(type, roomKey, writeMsg, sendMsg) {
  if (type === "group" || (type === "p2p" && global.chatRooms[roomKey][sendMsg.receiverId])) {
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
}
