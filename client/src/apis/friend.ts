import {
  FriendList,
  IAddFriendDto,
  IFriendInfo,
  IFriendItem,
  ITagItem,
  IUpdateFriendDto,
} from '@/types/friend';
import request from '@/utils/request';

export async function fetchFriendListByNameApi(username: string) {
  const res = await request.get<IFriendInfo[]>(`/friend/name?username=${username}`);
  return res.data;
}

export async function addFriendApi(friendDto: IAddFriendDto) {
  const res = await request.post<IAddFriendDto>('/friend/add', friendDto);
  return res.data;
}

export async function fetchFriendListApi() {
  const res = await request.get<FriendList>('/friend/list');
  return res.data;
}

/**
 *
 * @param friendUserId Friend's user ID
 * @returns Find friend by friend's user ID
 */
export async function findFriendByIdApi(friendUserId: number) {
  const res = await request.get<IFriendInfo>(`friend/id?id=${friendUserId}`);
  return res.data;
}

export async function fetchTagListApi() {
  const res = await request.get<ITagItem[]>('/tag-list');
  return res.data;
}

export async function addTagApi(tagDto: Omit<ITagItem, 'id'>) {
  const res = await request.post<Omit<ITagItem, 'id'>>('/friend/add-tag', tagDto);
  return res.data;
}

export async function updateFriendApi(friendDto: IUpdateFriendDto) {
  const res = await request.post<IUpdateFriendDto>('friend/update', friendDto);
  return res.data;
}
