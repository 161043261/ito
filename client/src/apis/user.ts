import { ILoginReqData, ILoginResData, IRegisterReqData, IRegisterResData } from '@/types/user';
import request from '@/utils/request';

export async function loginApi(payload: ILoginReqData) {
  const res = await request.post<ILoginReqData, ILoginResData>('/auth/login', payload);
  return res.data;
}

export async function registerApi(payload: IRegisterReqData) {
  const res = await request.post<IRegisterReqData, IRegisterResData>('/auth/register', payload);
  return res.data;
}
