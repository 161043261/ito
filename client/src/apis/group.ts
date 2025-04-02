import { IAddSelf2groupDto, IGroupDto, IGroupExt, IGroupItem } from '@/types/group';
import request from '@/utils/request';

export async function addSelf2GroupApi(data: IAddSelf2groupDto) {
  const res = await request.post<IAddSelf2groupDto>('/group/add-self', data);
  return res.data;
}

export async function fetchGroupListByNameApi(groupName: string) {
  const res = await request.get<IGroupDto[]>(`/group/name?name=${groupName}`);
  return res.data;
}

export async function fetchGroupById(groupId: number) {
  const res = await request.get<IGroupExt>(`group/id?id=${groupId}`);
  return res.data;
}

export async function fetchGroupListApi() {
  const res = await request.get<IGroupItem[]>('group/list');
  return res.data;
}
