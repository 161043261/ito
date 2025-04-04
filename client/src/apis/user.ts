import { ILoginParams, ILoginRes, IRegisterParams, IRegisterRes, IUserInfo } from '@/types/user';
import request from '@/utils/request';

export async function loginApi(reqData: ILoginParams) {
  const res = await request.post<ILoginParams, ILoginRes>('/user/login', reqData);
  return res.data;
}

export async function registerApi(reqData: IRegisterParams) {
  const res = await request.post<IRegisterParams, IRegisterRes>('/user/register', reqData);
  return res.data;
}

export async function logoutApi(params: IUserInfo) {
  const res = await request.post<IUserInfo>('/user/logout', params);
  return res.data;
}

export async function updatePwdApi() {}

export async function updateUserInfoApi() {}

export async function startPubApi() {}
