import { ILoginReqData, ILoginResData } from './type';
import request from '@/utils/req';

export async function loginApi(data: ILoginReqData) {
  const res = await request.post<ILoginReqData, ILoginResData>('/auth/login', data);
  return res.data;
}
