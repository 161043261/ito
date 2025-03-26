import { useImperativeHandle } from 'react';

interface IProps {
  ref: React.Ref<IChatBoxRef>;
}

export interface IChatBoxRef {
  refreshMsgList: () => void; // 刷新消息列表
}

const ChatBox: React.FC<IProps> = ({ ref }: IProps /** props */) => {
  const refreshMsgList = () => {
    console.log('refreshMsgList');
  };
  useImperativeHandle(ref, () => {
    return { refreshMsgList };
  });
  return <div>ChatBox</div>;
};

export default ChatBox;
