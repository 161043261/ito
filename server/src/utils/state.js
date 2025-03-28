// 1xxx base
export const BaseState = {
  Success: 200,
  Failed: 400,

  ServerErr: 1001,
  TokenInvalid: 1002, // error or expired
  ParamErr: 1003,
  CreateFailed: 1004,
  UpdateFailed: 1005,
};

// 2xxx user
export const UserState = {
  EmailOrPassErr: 2001,
  UserLoggedIn: 2002,
  UserRegistered: 2003,
  UserNotRegistered: 2004,
};

// 3xxx friend
// export const FriendState = {}

// 4xxx group
export const GroupState = {
  SelfJoined: 4001,
  FriendJoined: 4002,
};

// 5xxx msg
// export const MsgState = {}

// 6xxx file
export const FileState = {
  FileUploaded: 6001,
  ChunksUploaded: 6002, // pending for merge
};

export const Code2Msg = new Map([
  [200, "成功"],
  [400, "失败"],

  // 1xxx base
  [1001, "服务器错误"],
  [1002, "令牌错误或过期"],
  [1003, "参数错误"],
  [1004, "创建失败"],
  [1005, "更新失败"],

  // 2xxx user
  [2001, "邮箱或密码错误"],
  [2002, "用户已登录"],
  [2003, "用户已注册"],
  [2004, "用户未注册"],

  // 3xxx friend

  // 4xxx group
  [4001, "你已加入群聊"],
  [4002, "好友已加入群聊"],

  // 5xxx msg

  // 6xxx file
  [6001, "文件重复上传"],
  [6002, "分块全部上传, 等待合并"],
]);
