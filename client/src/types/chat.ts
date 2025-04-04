export enum MsgType {
  Friend = 'friend',
  Group = 'group',
}

export interface ChatItem {
  chatId: number; // 好友 ID 或群聊 ID
  chatName: string; // 好友备注 (好友名) 或群聊备注 (群聊名)
  receiverName: string; // 好友的用户名, 有该字段, 说明是好友, 不是群聊
  isGroup: boolean; // 是不是群聊
  unreadCnt: number; // 未读消息数
  latestMsg: string; // 最新消息
  latestMsgType: string; // 最新消息的类型
  avatar: string; // 好友头像或群聊头像
}

export interface IMsgItem {
  // messages 表字段
  content: string; // messages 表字段 content, 消息内容
  fileSize: number; // messages 表字段 file_size, 文件大小, 单位 B
  id: number; // messages 表字段 id, 消息 ID
  mediaType: 'text' | 'image' | 'video' | 'file'; // messages 表字段 media_type, 媒体类型
  receiverId: number; // messages 表字段 receiver_id, 接收者的用户 ID
  roomKey: string; // messages 表字段 room_key, 房间号
  senderId: number; // messages 表字段 sender_id, 发送者的用户 ID
  state: 0 | 1; // messages 表字段 state, 消息状态
  // type: friend | group
  type: MsgType; // messages 表字段 type, 消息类型
  createdAt: string; // messages 表字段 created_at, 创建时间
}

export interface IMsgStatItem {
  // msg_stats 表字段
  id: number; // msg_stats 表字段 id, 消息统计 ID
  roomKey: string; // msg_stats 表字段 room_key, 房间号
  total: number; // msg_stats 表字段 total, 消息总数
}
