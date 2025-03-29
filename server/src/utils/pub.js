import query from "./query.js";

/**
 * @param {{ receiverId?: number, receiverEmail?: string, type: 'wsFriendList' | 'wsGroupList' | 'wsMsgList' | 'wsChatRooms' }} data
 * @description type: wsFriendList, wsGroupList, wsMsgList, wsChatRooms
 */
export default async function pub(data) {
  let receiverEmail = data.receiverEmail;
  if (!receiverEmail) {
    const results = query("select email from users where id = ?", [data.receiverId]);
    receiverEmail = results[0].email;
  }
  if (global.OnlineUsers[receiverEmail]) {
    global.OnlineUsers[receiverEmail].ws.send(JSON.stringify(data));
  }
}
