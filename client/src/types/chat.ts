export enum TabType {
  P2p = 'p2p',
  Group = 'group',
}

export interface ChatInfo {
  chatId: number; // 好友 ID 或群聊 ID
  chatName: string; // 好友备注 (好友名) 或群聊备注 (群聊名)
  receiverName: string; // 好友的用户名, 有该字段, 说明是单聊, 不是群聊
  isGroup: boolean; // 是不是群聊
  unreadCnt: number; // 未读消息数
  latestMsg: string; // 最新消息
  latestMsgType: string; // 最新消息的类型
  avatar: string; // 好友头像或群聊头像
}
