import { IGroupDto, IGroupExt, IGroupItem } from '@/types/group';
import request from '@/utils/request';

export async function addSelf2GroupApi(data: { groupId: number }) {
  const res = await request.post<{ groupId: number }>('/group/add-self', data);
  return res.data;
}

export async function fetchGroupListByNameApi(groupName: string) {
  const res = await request.get<IGroupDto[]>(`/group/name?name=${groupName}`);
  return res.data;
}

export async function fetchGroupListById(groupId: number) {
  const res = await request.get<IGroupExt>(`group/group/id?id=${groupId}`);
  return res.data;
}
