import {
  ILoginReqData,
  ILoginResData,
  IRegisterReqData,
  IRegisterResData,
  IUserInfo,
} from '@/types/user';
import request from '@/utils/request';

export async function loginApi(reqData: ILoginReqData) {
  const res = await request.post<ILoginReqData, ILoginResData>('/user/login', reqData);
  return res.data;
}

export async function registerApi(reqData: IRegisterReqData) {
  const res = await request.post<IRegisterReqData, IRegisterResData>('/user/register', reqData);
  return res.data;
}

export async function logoutApi(reqData: IUserInfo) {
  const res = await request.post<IUserInfo>('/user/logout', reqData);
  return res.data;
}

export async function updatePwdApi() {}

export async function updateUserInfoApi() {}

export async function startPubApi() {}
