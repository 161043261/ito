/* eslint-disable @typescript-eslint/no-unused-vars */
import useToast from '@/hooks/use_toast';
import useUserInfoStore from '@/store/user_info';
import { IChatRef, IContactRef } from '@/types/fc_expose';
import { IReceiverInfo } from '@/types/user';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import styled from 'styled-components';

const BgContainer = styled.div`
  background: var(--color-green5);
  width: 100vw;
  height: 100vh;
`;

const Home: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const userInfoStore = useUserInfoStore();

  // 更新密码的弹窗
  const [mountPwdModal, setMountPwdModal] = useState(false);
  // 更新用户信息的弹窗
  const [mountUserInfoModal, setMountUserInfoModal] = useState(false);
  // 音频聊天弹窗
  const [mountAudioModal, setMountAudioModal] = useState(false);
  // 视频聊天弹窗
  const [mountVideoModal, setMountVideoModal] = useState(false);
  // 选中的单聊或群聊
  const [selectedChat, setSelectedChat] = useState(false);
  // 房间号
  const [roomNum, setRoomNum] = useState<string>('');
  // 聊天模式: 音频; 视频; 音视频
  const [chatMode, setChatMode] = useState<string>('');
  // 接收者列表
  const [receiverList, setReceiverList] = useState<IReceiverInfo[]>([]);

  // useRef 只会在组件挂载时调用 1 次, 组件重新渲染时, 不会重新调用 useRef
  // websocket 实例
  const socket = useRef<WebSocket | null>(null);
  // 通讯录实例
  const contactSidebar = useRef<IContactRef>(null);
  // 聊天窗口实例
  const chatMain = useRef<IChatRef>(null);
  return (
    <BgContainer>
      <main>Homepage</main>
    </BgContainer>
  );
};

export default Home;
