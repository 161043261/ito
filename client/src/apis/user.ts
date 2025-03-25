import { ILoginReqData, ILoginResData } from '@/types/user';
import request from '@/utils/req';

export async function loginApi(data: ILoginReqData) {
  const res = await request.post<ILoginReqData, ILoginResData>('/auth/login', data);
  return res.data;
}

export async function registerApi(data: IRegisterReqData) {
  
}
