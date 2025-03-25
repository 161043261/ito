import { IUserInfo } from '@/types/user';
import { create, StateCreator } from 'zustand';

const emptyUserInfo = {
  email: '',
  password: '',
  avatar: '',
  username: '',
  signature: '',
};

export interface IUserInfoState {
  userInfo: IUserInfo;
  setUserInfo: (userInfo: IUserInfo) => void;
  clearUserInfo: () => void;
}

export const createUserInfoStore: StateCreator<IUserInfoState> = (set) => {
  const userInfo = {
    ...emptyUserInfo,
    ...JSON.parse(sessionStorage.getItem('userInfo') ?? '{}'),
  };
  const { email, password, avatar, username, signature } = userInfo;
  return {
    userInfo: {
      email,
      password,
      avatar,
      username,
      signature,
    },
    setUserInfo: (userInfo_: IUserInfo) => {
      set((state: IUserInfoState) => {
        const userInfo = { ...state, ...userInfo_ };
        sessionStorage.setItem('userInfo', JSON.stringify(userInfo));
        return userInfo;
      });
    },
    clearUserInfo: () => {
      sessionStorage.clear();
      return { ...emptyUserInfo };
    },
  };
};

const useUserInfoStore = create<IUserInfoState>(createUserInfoStore);

export default useUserInfoStore;
