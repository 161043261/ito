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
