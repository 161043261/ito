// 某标签下的全部好友
export interface ITagFriends {
  tagName: string;
  onlineCnt: number;
  friends: IFriendItem[];
}

export interface IFriendItem {
  // friends 表字段
  id: number; // friends 表字段 id, 好友 ID
  avatar: string; // friends 表字段 avatar, 好友头像
  email: string; // friends 表字段 email, 好友邮箱
  note_name: string; // friends 表字段 note_name, 好友备注
  state: "online" | "offline"; // friends 表字段 state, 好友状态
  tag_id: number; // friends 表字段 tag_id, 好友的标签 ID
  unread_cnt: number; // friends 表字段 unread_cnt, 未读消息数
  user_id: number; // friends 表字段 user_id, 所属用户 ID
}
