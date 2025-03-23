// 1xxx base
export enum BaseState {
  ServerErr = 1001, // 服务器错误
  TokenErr = 1002, // token 过期或错误
  ParamErr = 1003, // 参数错误
  CreateErr = 1004, // 创建失败
  UpdateErr = 1005, // 更新失败
}

// 2xxx auth
export enum AuthState {
  EmailOrPassErr = 2001, // 邮箱或密码错误
  UserLoggedIn = 2002, // 用户已登录
  UserRegistered = 2003, // 用户已注册
  UserNotRegistered = 2004, // 用户未注册
}

// 3xxx friend
export enum FriendState {}

// 4xxx group
export enum GroupState {
  YouHasJoined = 4001, // 您已加入群聊
  FriendHasJoined = 4002, // 好友已加入群聊
}

// 5xxx msg

// 6xxx file
export enum FileState {
  FileUploaded = 6001, // 文件已上传
  ChunksUploaded = 6002, // 全部分块已上传, 未合并
}

export const Code2Msg = new Map<number, string>([
  [200, "成功"],

  // 1xxx base
  [1001, "服务器错误"],
  [1002, "token 过期或错误"],
  [1003, "参数错误"],
  [1004, "创建失败"],
  [1005, "更新失败"],

  // 2xxx aut]h
  [2001, "邮箱或密码错误"],
  [2002, "用户已登录"],
  [2003, "用户已注册"],
  [2004, "用户未注册"],

  // 3xxx frien]d]

  // 4xxx grou]p
  [4001, "您已加入群聊"],
  [4002, "好友已加入群聊"],

  // 5xxx ms]g]

  // 6xxx fil]e
  [6001, "文件已上传"],
  [6002, "全部分块已上传, 未合并"],
]);
