/* eslint-disable @typescript-eslint/no-unused-vars */
import { logoutApi } from '@/apis/user';
import ImageContainer from '@/components/image_container';
import useToast from '@/hooks/use_toast';
import useUserInfoStore from '@/store/user_info';
import { IFriendItem, IGroupItem } from '@/types/chat';
import { IChatBoxRef, IContactRef } from '@/types/fc_expose';
import { IReceiverInfo } from '@/types/user';
import { BaseState } from '@/utils/constants';
import { Button, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { IconItem, IconKey, IconList } from '@/utils/icons';

import styled from 'styled-components';
import ChatBox from './chat';
import Contact from './contact';

const BgContainer = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Home: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const userInfoStore = useUserInfoStore();
  const userInfo = userInfoStore.userInfo;

  // 选中的图标
  const [curIconKey, setCurIconKey] = useState<IconKey>('MessageEmoji');
  // 更新密码的弹窗
  const [mountPwdModal, setMountPwdModal] = useState(false);
  // 更新用户信息的弹窗
  const [mountUserInfoModal, setMountUserInfoModal] = useState(false);
  // 音频聊天弹窗
  const [mountAudioModal, setMountAudioModal] = useState(false);
  // 视频聊天弹窗
  const [mountVideoModal, setMountVideoModal] = useState(false);
  // 选中的单聊或群聊
  const [curChat, setCurChat] = useState<IFriendItem | IGroupItem | null>(null);
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
  const chatBoxRef = useRef<IChatBoxRef>(null); // main

  // 更新密码的弹窗挂载/卸载
  const handleMountPwdModal = (doMount: boolean) => setMountPwdModal(doMount);
  // 更新用户信息的弹窗挂载/卸载
  const handleMountUserInfoModal = (doMount: boolean) => setMountUserInfoModal(doMount);
  // 音频聊天弹窗挂载/卸载
  const handleMountAudioModal = (doMount: boolean) => setMountAudioModal(doMount);
  // 视频聊天弹窗挂载/卸载
  const handleMountVideoModal = (doMount: boolean) => setMountVideoModal(doMount);
  // 退出登录
  const confirmLogout = async () => {
    try {
      const res = await logoutApi(userInfo);
      if (res.code !== BaseState.Success) {
        toast.error('退出登录失败, 请重试');
        return;
      }
      userInfoStore.clearUserInfo();
      toast.success('退出登录成功');
      if (socket.current !== null) {
        // 关闭 websocket 连接
        socket.current.close();
        socket.current = null;
      }
    } catch (err) {
      console.error(err);
      toast.error('退出登录失败, 请重试');
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
          chatBoxRef.current?.refreshMsgList();
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

  const handleClickIcon = (item: IconItem) => {
    setCurIconKey(item.key);
    switch (item.key) {
      case 'MessageEmoji':
        return navigate('/chat');
      case 'AddressBook':
        return navigate('/contact');
      case 'Power':
        return confirmLogout();
    }
  };

  const handleSelectItem = (item: IFriendItem | IGroupItem) => {
    // navigate('/chat')
    // setSelectedChat(item);
  };

  return (
    <BgContainer>
      {/* 左侧 */}
      <div>
        <ul>
          {IconList.slice(0, 5).map((item) => (
            <li>
              <Tooltip key={item.key} placement="bottomLeft" title={item.title} arrow={false}>
                <item.IconInst
                  onClick={() => handleClickIcon(item)}
                  className={`${curIconKey === item.key ? 'text-ito5' : 'text-slate-500'}`}
                />
              </Tooltip>
            </li>
          ))}
        </ul>

        <ul>
          {IconList.slice(5).map((item) => (
            <li>
              <Tooltip key={item.key} placement="bottomLeft" title={item.title} arrow={false}>
                <item.IconInst
                  onClick={() => handleClickIcon(item)}
                  className={`${curIconKey === item.key ? 'text-ito5' : 'text-slate-500'}`}
                />
              </Tooltip>
            </li>
          ))}
        </ul>
      </div>
      {/* 右侧 */}
      <div>
        {(() => {
          switch (curIconKey) {
            case 'MessageEmoji':
              return <ChatBox ref={chatBoxRef} />;
            case 'AddressBook':
              return <Contact ref={contactRef} />;
          }
        })()}
      </div>
    </BgContainer>
  );
};

export default Home;
