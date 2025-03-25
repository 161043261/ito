import { IUserInfo } from '@/types/user';
import { create, StateCreator } from 'zustand';

const emptyUser = {
  email: '',
  password: '',
  avatar: '',
  username: '',
};

export interface IUserInfoState extends IUserInfo {
  getUserInfo: () => IUserInfo;
  setUserInfo: (userInfo: IUserInfo) => void;
  clearUserInfo: () => void;
}

export const createUserInfoStore: StateCreator<IUserInfoState> = (set) => {
  const user = {
    ...emptyUser,
    ...JSON.parse(sessionStorage.getItem('userInfo') ?? '{}'),
  };
  const { email, password, avatar, username } = user;
  return {
    email,
    password,
    avatar,
    username,
    getUserInfo: () => {
      return {
        email,
        password,
        avatar,
        username,
      };
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
      return { ...emptyUser };
    },
  };
};

const useUserInfoStore = create<IUserInfoState>(createUserInfoStore);

export default useUserInfoStore;
