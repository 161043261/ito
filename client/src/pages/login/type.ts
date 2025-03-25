import { IUserInfo } from '@/store/user_info';

export interface ILoginReqData {
  email: string;
  password: string;
}

export interface ILoginResData {
  token: string;
  userInfo: IUserInfo;
}
