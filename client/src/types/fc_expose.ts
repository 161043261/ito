// 聊天窗口
export interface IChatRef {
  refreshMsgList: () => void; // 刷新消息列表
}

// 通讯录
export interface IContactRef {
  refreshFriendList: () => void; // 刷新好友列表
  refreshGroupList: () => void; // 刷新群聊列表
}
