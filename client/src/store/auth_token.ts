/* eslint-disable @typescript-eslint/no-unused-vars */
import { create, StateCreator } from 'zustand';

export interface IAuthTokenState {
  token: string;
  setToken: (token: string) => void;
  clearToken: () => void;
}

export const createAuthTokenStore: StateCreator<IAuthTokenState> = (set) => {
  return {
    token: sessionStorage.getItem('token') ?? '',
    setToken: (token: string) => {
      set((_state: IAuthTokenState) => {
        sessionStorage.setItem('token', token);
        return { token };
      });
    },
    clearToken: () => {
      set((_state: IAuthTokenState) => {
        sessionStorage.clear();
        return { token: '' };
      });
    },
  };
};

const useAuthTokenStore = create<IAuthTokenState>(createAuthTokenStore);

export default useAuthTokenStore;
