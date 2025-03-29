import query from "./query.js";

/**
 * @param {{ receiverEmail: string, type: 'wsFriendList' | 'wsGroupList' | 'wsMsgList' | 'wsChatRooms' }} data
 * @description type: wsFriendList, wsGroupList, wsMsgList, wsChatRooms
 */
export default async function pub(data) {
  let receiverEmail = data.receiverEmail;
  if (!receiverEmail) {
    const results = query("select email from users where id = ?", [data.receiverId]);
    receiverEmail = results[0].email;
  }
  if (global.onlineUsers[receiverEmail]) {
    global.onlineUsers[receiverEmail].ws.send(JSON.stringify(data));
  }
}
