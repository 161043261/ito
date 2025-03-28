export interface IGroupItem {
  // groups 表字段
  id: number; // groups 表字段 id, 群聊 ID
  name: string; // groups 表字段 name, 群聊名
  ownerId: number; // groups 表字段 owner_id, 群主的用户 ID
  readme: string; // groups 表字段 readme, 群公告
  roomKey: string; // groups 表字段 room_key, 房间号
  avatar: string; // groups 表字段 avatar, 群聊头像
}

export interface IGroupMemberItem {
  groupId: number; // group_members 表字段 group_id, 群聊 ID
  id: number; // group_members 表字段 id, 成员 ID
  nickname: string; // group_members 表字段 nickname, 成员昵称
  userId: number; // group_members 表字段 user_id, 成员的用户 ID
}

export interface IGroupInfo extends IGroupItem {
  // 补充字段
  ownerEmail: string; // 群主的邮箱
}

export interface IGroupDto {
  avatar: string;
  id: number;
  name: string;
  memberNum: number;
  flag: boolean;
}
