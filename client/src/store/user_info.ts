import { create, StateCreator } from 'zustand';

const emptyUser = {
  email: '',
  password: '',
  avatar: '',
  username: '',
};

export interface IUserInfo {
  email: string;
  password: string;
  avatar: string;
  username: string;
}

export interface IUserInfoState extends IUserInfo {
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

const useAuthTokenStore = create<IUserInfoState>(createUserInfoStore);

export default useAuthTokenStore;
