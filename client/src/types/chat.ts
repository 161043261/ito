export interface ChatItem {
  chatId: number; // 好友 ID 或群聊 ID
  chatName: string; // 好友备注 (好友名) 或群聊备注 (群聊名)
  receiverName: string; // 好友的用户名, 有该字段, 说明是单聊, 不是群聊
  isGroup: boolean; // 是不是群聊
  unreadCnt: number; // 未读消息数
  latestMsg: string; // 最新消息
  latestMsgType: string; // 最新消息的类型
  avatar: string; // 好友头像或群聊头像
}

export interface IFriendItem {
  // friends 表字段
  id: number, // friends 表字段 id, 好友 ID
  avatar: string; // friends 表字段 avatar, 好友头像
  email: string; // friends 表字段 email, 好友邮箱
  noteName: string; // friends 表字段 note_name, 好友备注
  state: 'online' | 'offline'; // friends 表字段 state, 好友状态
  tagId: number; // friends 表字段 tag_id, 好友的标签 ID
  unreadCnt: number; // friends 表字段 unread_cnt, 未读消息数
  userId: number; // friends 表字段 user_id, 所属用户 ID

  // 补充属性
  friendUserId: number,
  groupId: number,
  groupName: string,
  roomKey: string,
  username: string, // 好友的用户名
  signature: string, // 好友的签名
}

export interface IGroupItem {
  // groups 表字段
  id: number; // groups 表字段 id, 群聊 ID
  name: string; // groups 表字段 name, 群聊名
  noteName: string; // groups 表字段 note_name, 群聊备注
  ownerId: number; // groups 表字段 owner_id, 群主的用户 ID
  readme: string; // groups 表字段 readme, 群公告
  roomKey: string; // groups 表字段 room_key, 房间号
}
