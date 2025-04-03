export interface IGroupItem {
  // groups 表字段
  id: number; // groups 表字段 id, 群聊 ID
  name: string; // groups 表字段 name, 群聊名
  creatorId: number; // groups 表字段 creator_id, 群主的用户 ID
  readme: string; // groups 表字段 readme, 群公告
  roomKey: string; // groups 表字段 room_key, 房间号
  avatar: string; // groups 表字段 avatar, 群聊头像
  createdAt: string; // groups 表字段 created_at, 创建时间
  updatedAt: string; // groups 表字段 updated_at, 更新时间
}

export interface IGroupMemberItem {
  groupId: number; // group_members 表字段 group_id, 群聊 ID
  id: number; // group_members 表字段 id, 成员 ID
  nickname: string; // group_members 表字段 nickname, 成员昵称
  userId: number; // group_members 表字段 user_id, 成员的用户 ID
  createdAt: string; // group_members 表字段 created_at, 创建时间
}

export interface IGroupExt extends IGroupItem {
  // 补充字段
  ownerEmail: string; // 群主的邮箱
  members: IGroupMemberExt[];
}

export interface IGroupMemberExt extends Omit<IGroupMemberItem, 'id' | 'groupId'> {
  avatar: string;
  latestMsgTime?: string;
  email: string;
  username: string;
  // nickname: string;
  // userId: number;
  // createdAt: string;
}

export interface IAddSelf2groupDto {
  groupId: number;
}

export interface IGroupDto {
  avatar: string;
  id: number;
  name: string;
  memberNum: number;
  flag: boolean;
}
