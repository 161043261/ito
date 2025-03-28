import { IGroupDto } from '@/types/group';
import request from '@/utils/request';

export async function fetchGroupListByNameApi(groupName: string) {
  const res = await request.get<IGroupDto[]>(`/group/name?name=${groupName}`);
  return res.data;
}
