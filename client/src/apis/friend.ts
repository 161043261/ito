import { FriendList, IAddFriendDto, IFriendExt, ITagItem, IUpdateFriendDto } from '@/types/friend';
import request from '@/utils/request';

export async function fetchFriendListByNameApi(username: string) {
  const res = await request.get<IFriendExt[]>(`/friend/name?username=${username}`);
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
export async function fetchFriendByIdApi(friendUserId: number) {
  const res = await request.get<IFriendExt>(`friend/id?id=${friendUserId}`);
  return res.data;
}

export async function fetchTagListApi() {
  const res = await request.get<ITagItem[]>('/tag-list');
  return res.data;
}

export async function createTagApi(tagDto: Omit<ITagItem, 'id'>) {
  const res = await request.post<Omit<ITagItem, 'id'>>('/friend/create-tag', tagDto);
  return res.data;
}

export async function updateFriendApi(friendDto: IUpdateFriendDto) {
  const res = await request.post<IUpdateFriendDto>('friend/update', friendDto);
  return res.data;
}
