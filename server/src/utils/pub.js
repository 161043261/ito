import query from "./query.js";

/**
 * @param {{ receiverId?: number, receiverEmail?: string, type: 'wsFetchFriendList' | 'wsFetchGroupList' | 'wsFetchMsgList' | 'wsCreateRtcRoom' }} data
 * @description type: wsFetchFriendList, wsFetchGroupList, wsFetchMsgList, wsCreateRtcRoom
 */
export default async function pub(data) {
  console.log("[debug] should publish:", data);
  let receiverEmail = data.receiverEmail;
  if (!receiverEmail) {
    const emailWraps = query("select email from users where id = ?", [data.receiverId]);
    receiverEmail = emailWraps[0].email;
  }
  if (global.OnlineUsers[receiverEmail]) {
    console.log("[debug] publish:", data);
    global.OnlineUsers[receiverEmail].ws.send(JSON.stringify(data));
  }
}
