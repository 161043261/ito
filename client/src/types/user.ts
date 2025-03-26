export interface IUserInfo { // users
  // ! id, email, password, username, avatar, signature
  id: number, // id
  email: string; // email
  password: string; // password
  avatar: string; // avatar
  username: string; // username
  signature?: string; // signature
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
    //! id, email, password, username, avatar, signature
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
