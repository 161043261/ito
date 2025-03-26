import {
  AddressBook,
  FileCode,
  FriendsCircle,
  Iphone,
  MessageEmoji,
  Power,
  WeixinFavorites,
  WeixinMiniApp,
} from '@icon-park/react';
import type { Icon } from '@icon-park/react/lib/runtime';

export type IconKey =
  | 'MessageEmoji'
  | 'AddressBook'
  | 'WeixinFavorites'
  | 'FileCode'
  | 'FriendsCircle'
  | 'WeixinMiniApp'
  | 'Iphone'
  | 'Power';

export type IconItem = {
  key: IconKey;
  title: string;
  IconInst: Icon;
};

export const IconList: IconItem[] = [
  {
    key: 'MessageEmoji', // 不要修改
    title: '聊天',
    IconInst: MessageEmoji,
  },

  {
    key: 'AddressBook',
    title: '通讯录', // 不要修改
    IconInst: AddressBook,
  },
  {
    key: 'WeixinFavorites',
    title: '收藏',
    IconInst: WeixinFavorites,
  },
  {
    key: 'FileCode',
    title: '聊天文件',
    IconInst: FileCode,
  },
  {
    key: 'FriendsCircle',
    title: '朋友圈',
    IconInst: FriendsCircle,
  },
  {
    key: 'WeixinMiniApp',
    title: '小程序',
    IconInst: WeixinMiniApp,
  },
  {
    key: 'Iphone',
    title: '手机',
    IconInst: Iphone,
  },
  {
    key: 'Power',
    title: '退出登录',
    IconInst: Power,
  },
];
