export interface IUserInfo {
  // users 表字段
  id: number; // users 表字段 id, 用户 ID
  email: string; // users 表字段 email, 用户邮箱
  password: string; // users 表字段 password, 用户密码
  avatar: string; // users 表字段 avatar, 用户头像
  username: string; // users 表字段 username, 用户名
  signature?: string; // users 表字段 signature, 签名
  createdAt?: string;
}

export interface ILoginParams {
  email: string;
  password: string;
}

export interface ILoginRes {
  token: string;
  userInfo: IUserInfo;
}

export interface IRegisterParams {
  email: string;
  password: string;
  avatar: string; // random
}

export interface IRegisterRes {
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

export interface IReceiver {
  email: string;
  username: string; // 用户名 username
  alias: string; // 备注 noteName 或群昵称 nickname 或用户名 username
  avatar: string;
}
