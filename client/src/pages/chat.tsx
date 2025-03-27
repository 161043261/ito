import { useImperativeHandle } from 'react';

interface IProps {
  ref: React.Ref<IChatBoxRef>;
}

export interface IChatBoxRef {
  fetchMsgList: () => void; // 刷新消息列表
}

const ChatBox: React.FC<IProps> = ({ ref }: IProps /** props */) => {
  const fetchMsgList = () => {
    console.log('fetchMsgList');
  };
  useImperativeHandle(ref, () => {
    return { fetchMsgList };
  });
  return <div>Chat Page</div>;
};

export default ChatBox;
