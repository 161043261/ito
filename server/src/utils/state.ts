// 1xxx base
export enum BaseState {
  Success = 200,
  ServerErr = 1001,
  TokenInvalid = 1002, // error or expired
  ParamErr = 1003,
  CreateFailed = 1004,
  UpdateFailed = 1005,
}

// 2xxx auth
export enum AuthState {
  EmailOrPassErr = 2001,
  UserLoggedIn = 2002,
  UserRegistered = 2003,
  UserNotRegistered = 2004,
}

// 3xxx friend
export enum FriendState {}

// 4xxx group
export enum GroupState {
  YouHasJoined = 4001,
  FriendHasJoined = 4002,
}

// 5xxx msg

// 6xxx file
export enum FileState {
  FileUploaded = 6001,
  ChunksUploaded = 6002, // pending for merge
}

export const Code2Msg = new Map<number, string>([
  [200, "Success"],

  // 1xxx base
  [1001, "Server error"],
  [1002, "Token error or expired"],
  [1003, "Parameters error"],
  [1004, "Create failed"],
  [1005, "Update failed"],

  // 2xxx auth
  [2001, "Email or password error"],
  [2002, "User logged in"],
  [2003, "User registered"],
  [2004, "User not registered"],

  // 3xxx friend

  // 4xxx group
  [4001, "You has joined the group"],
  [4002, "Friend has joined the group"],

  // 5xxx msg

  // 6xxx file
  [6001, "File uploaded"],
  [6002, "Chunks uploaded"], // pending for merge
]);
