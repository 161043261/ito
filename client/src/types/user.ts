export interface IUserInfo {
  email: string;
  password: string;
  avatar: string;
  username: string;
}

export interface ILoginReqData {
  email: string;
  password: string;
}

export interface ILoginResData {
  token: string;
  userInfo: IUserInfo;
}

export interface ChatItem {
  chatId: number; // 好友 ID 或群聊 ID
  noteName: string; // 好友备注或群聊名
  receiverName: string; // 好友的用户名, 有该字段, 表示是单聊, 不是群聊
}
