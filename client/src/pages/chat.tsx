import { useImperativeHandle } from 'react';

interface IProps {
  ref: React.Ref<IChatRef>;
}

export interface IChatRef {
  fetchMsgList: () => void; // 刷新消息列表
}

const Chat: React.FC<IProps> = ({ ref }: IProps /** props */) => {
  const fetchMsgList = () => {
    console.log('fetchMsgList');
  };
  useImperativeHandle(ref, () => {
    return { fetchMsgList };
  });
  return <div>Chat Page</div>;
};

export default Chat;
