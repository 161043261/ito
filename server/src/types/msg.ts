export interface IMsgItem {
  // messages 表字段
  content: string; // messages 表字段 content, 消息内容
  file_size: number; // messages 表字段 file_size, 文件大小, 单位 B
  id: number; // messages 表字段 id, 消息 ID
  media_type: "text" | "image" | "video" | "file"; // messages 表字段 media_type, 媒体类型
  receiver_id: number; // messages 表字段 receiver_id, 接收者的用户 ID
  room_key: string; // messages 表字段 room_key, 房间号
  sender_id: number; // messages 表字段 sender_id, 发送者的用户 ID
  state: 0 | 1; // messages 表字段 state, 消息状态
  type: "private" | "public"; // messages 表字段 type, 消息类型
}

export interface IMsgStatItem {
  // msg_stats 表字段
  id: number; // msg_stats 表字段 id, 消息统计 ID
  room_key: string; // msg_stats 表字段 room_key, 房间号
  total: number; // msg_stats 表字段 total, 消息总数
}
