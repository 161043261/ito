export interface IGroupItem {
  // groups 表字段
  id: number; // groups 表字段 id, 群聊 ID
  name: string; // groups 表字段 name, 群聊名
  note_name: string; // groups 表字段 note_name, 群聊备注
  owner_id: number; // groups 表字段 owner_id, 群主的用户 ID
  readme: string; // groups 表字段 readme, 群公告
  room_key: string; // groups 表字段 room_key, 房间号
}

export interface IGroupMemberItem {
  // group_members 表字段
  id: number, // group_members 表字段 id, 成员 ID
  group_id: number, // group_members 表字段 group_id, 群聊 ID
  nickname: string, // group_members 表字段 nickname, 成员昵称
  user_id: number // group_members 表字段 user_id, 成员的用户 ID
}
