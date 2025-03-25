export interface IUserInfo {
  // ! email, password, username, avatar, signature
  email: string;
  password: string;
  avatar: string;
  username: string;
  signature?: string;
}

export interface ILoginReqData {
  email: string;
  password: string;
}

export interface ILoginResData {
  token: string;
  userInfo: IUserInfo;
}

export interface IRegisterReqData {
  email: string;
  password: string;
  avatar: string; // random
}

export interface IRegisterResData {
  token: string;
  userInfo: {
    //! email, password, username, avatar, signature
    id: number;
    email: string;
    username: string;
    avatar: string;
    signature: string;
  };
}

export interface IReceiverInfo {
  email: string;
  username: string; // 用户名 username
  alias: string; // 备注 noteName 或群昵称 nickname 或用户名 username
  avatar: string;
}
