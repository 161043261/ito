import { useImperativeHandle } from 'react';

interface IProps {
  ref: React.Ref<IContactRef>;
}

export interface IContactRef {
  refreshFriendList: () => void; // 刷新好友列表
  refreshGroupList: () => void; // 刷新群聊列表
}

const Contact: React.FC<IProps> = ({ ref }: IProps /** props */) => {
  const refreshFriendList = () => {
    console.log('refreshFriendList');
  };
  const refreshGroupList = () => {
    console.log('refreshGroupList');
  };
  useImperativeHandle(ref, () => {
    return {
      refreshFriendList,
      refreshGroupList,
    };
  });
  return <div>Contact Page</div>;
};

export default Contact;
