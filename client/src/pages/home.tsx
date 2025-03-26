/* eslint-disable @typescript-eslint/no-unused-vars */
import { logoutApi } from '@/apis/user';
import ImageContainer from '@/components/image_container';
import useToast from '@/hooks/use_toast';
import useUserInfoStore from '@/store/user_info';
import { IFriendItem, IGroupItem } from '@/types/chat';
import { IChatRef, IContactRef } from '@/types/fc_expose';
import { IReceiverInfo } from '@/types/user';
import { BaseState } from '@/utils/constants';
import { Button } from 'antd';
import { useEffect, useRef, useState } from 'react';
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
  const userInfo = userInfoStore.userInfo;

  // 更新密码的弹窗
  const [mountPwdModal, setMountPwdModal] = useState(false);
  // 更新用户信息的弹窗
  const [mountUserInfoModal, setMountUserInfoModal] = useState(false);
  // 音频聊天弹窗
  const [mountAudioModal, setMountAudioModal] = useState(false);
  // 视频聊天弹窗
  const [mountVideoModal, setMountVideoModal] = useState(false);
  // 选中的单聊或群聊
  const [selectedChat, setSelectedChat] = useState<IFriendItem | IGroupItem | null>(null);
  // 房间号
  const [roomKey, setRoomKey] = useState<string>('');
  // 聊天模式: 音频; 视频; 音视频
  const [chatMode, setChatMode] = useState<string>('');
  // 接收者列表
  const [receiverList, setReceiverList] = useState<IReceiverInfo[]>([]);

  // useRef 只会在组件挂载时调用 1 次, 组件重新渲染时, 不会重新调用 useRef
  // websocket 实例
  const socket = useRef<WebSocket | null>(null);
  // 通讯录实例
  const contactRef = useRef<IContactRef>(null); // sidebar
  // 聊天窗口实例
  const chatRef = useRef<IChatRef>(null); // main

  // 更新密码的弹窗挂载/卸载
  const handleMountPwdModal = (doMount: boolean) => setMountPwdModal(doMount);
  // 更新用户信息的弹窗挂载/卸载
  const handleMountUserInfoModal = (doMount: boolean) => setMountUserInfoModal(doMount);
  // 音频聊天弹窗挂载/卸载
  const handleMountAudioModal = (doMount: boolean) => setMountAudioModal(doMount);
  // 视频聊天弹窗挂载/卸载
  const handleMountVideoModal = (doMount: boolean) => setMountVideoModal(doMount);
  // 登出
  const onBeforeLogout = async () => {
    try {
      const res = await logoutApi(userInfo);
      if (res.code !== BaseState.Success) {
        toast.error('登出失败, 请重试');
        return;
      }
      userInfoStore.clearUserInfo();
      toast.success('登出成功');
      if (socket.current !== null) {
        // 关闭 websocket 连接
        socket.current.close();
        socket.current = null;
      }
    } catch (err) {
      console.error(err);
      toast.error('登出失败, 请重试');
    }
  };

  const UserInfoModal = (
    <div>
      <div className="flex">
        <ImageContainer src={userInfo.avatar} />
        <div>
          <div>{userInfo.username}</div>
          <div>{userInfo.signature ?? ''}</div>
        </div>
      </div>
      <div>
        <Button onClick={() => handleMountPwdModal(true)}>修改密码</Button>
        <Button onClick={() => handleMountUserInfoModal(true)}>修改用户信息</Button>
      </div>
    </div>
  );

  // 主页挂载时,
  const setupSocket = () => {
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_BASE_URL}/user/chan?email=${userInfo.email}`,
    );
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      switch (msg.type) {
        case 'friendList':
          // 刷新好友列表
          contactRef.current?.refreshFriendList();
          break;
        case 'groupList':
          // 刷新群聊列表
          contactRef.current?.refreshGroupList();
          break;
        case 'msgList':
          // 刷新消息列表
          chatRef.current?.refreshMsgList();
          break;
        case 'chatRoom':
          try {
            const { receiverList, roomKey, mode } = msg;
            setReceiverList(receiverList);
            setChatMode(mode);
            setRoomKey(roomKey);
          } catch (err) {
            console.error(err);
            toast.error('音视频聊天失败, 请重试');
          }
          break;
      }
    };
    socket.current = ws;
  };
  useEffect(() => setupSocket(), []); // onMounted

  const handleSelectItem = (item: IFriendItem | IGroupItem) => {
    // navigate('/chat')
    // setSelectedChat(item);
  }

  return (
    <BgContainer>
      <main>Homepage</main>
    </BgContainer>
  );
};

export default Home;
