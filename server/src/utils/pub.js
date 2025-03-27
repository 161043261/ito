import query from "./query.js";

/**
 * @description type: wsFriendList, wsGroupList, wsMsgList, wsChatRooms
 */
export async function pub(data) {
  let receiverEmail = data.receiverEmail;
  if (!receiverEmail) {
    const results = query("select email from users where id = ?", [data.receiverId]);
    receiverEmail = results[0].email;
  }
  if (global.chatRooms[receiverEmail]) {
    global.chatRooms[receiverEmail].ws.send(JSON.stringify(data));
  }
}
