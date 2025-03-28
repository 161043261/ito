// 某标签下的全部好友
export interface ITaggedFriends {
  tagName: string;
  onlineCnt: number;
  friends: IFriendItem[];
}

export type TaggedFriendsList = ITaggedFriends[];
export type FriendList = TaggedFriendsList;

//! id, state, tag_id, room_key, unread_cnt, email, avatar,
//! friend_id, friend_user_id, tag_name, username, signature
export interface IFriendItem {
  // friends 表字段
  id: number; // friends 表字段 id, 好友 ID
  avatar: string; // friends 表字段 avatar, 好友头像
  email: string; // friends 表字段 email, 好友邮箱
  note_name: string; // friends 表字段 note_name, 好友备注
  state: 'online' | 'offline'; // friends 表字段 state, 好友状态
  tag_id: number; // friends 表字段 tag_id, 好友的标签 ID
  unread_cnt: number; // friends 表字段 unread_cnt, 未读消息数
  user_id: number; // friends 表字段 user_id, 所属用户 ID
  room_key: string; // friends 表字段 room_key, 房间号
}

export interface IFriendInfo extends IFriendItem {
  // 补充属性
  friend_id: number; // 同 IFriendItem.id
  friend_user_id: number;
  group_id: number;
  group_name: string;
  username: string; // 好友的用户名
  signature: string; // 好友的签名
}

export interface ITagItem {
  // tag 表字段
  id: number; // tag 表字段 id, 标签 ID
  name: string; // tag 表字段 name, 标签名
  user_id: number; // tag 表字段 user_id, 所属用户 ID
  user_email: string; // tag 表字段 user_email, 所属用户邮箱
}
