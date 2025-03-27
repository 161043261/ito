export interface IGroupItem {
  // groups 表字段
  id: number; // groups 表字段 id, 群聊 ID
  name: string; // groups 表字段 name, 群聊名
  note_name: string; // groups 表字段 note_name, 群聊备注
  owner_id: number; // groups 表字段 owner_id, 群主的用户 ID
  readme: string; // groups 表字段 readme, 群公告
  room_key: string; // groups 表字段 room_key, 房间号
}

export interface IGroupInfo extends IGroupItem {
  // 补充字段
  ownerEmail: string; // 群主的邮箱
}
