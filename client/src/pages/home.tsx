/* eslint-disable @typescript-eslint/no-unused-vars */
import { logoutApi } from '@/apis/user';
import ImgBox from '@/components/base64img';
import useToast from '@/hooks/use_toast';
import useUserInfoStore from '@/store/user_info';

import type { IChatBoxRef, IContactRef } from '@/types/fc_expose';
import type { IReceiver } from '@/types/user';
import { BaseState } from '@/utils/constants';

import { Button, Popover, Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { IconItem, IconKey, IconList } from '@/utils/icons';

import ChatBox from './chat';
import Contact from './contact';
import PwdModal from '@/components/pwd_modal';
import UserInfoModal from '@/components/user_info_modal';
import AudioModal from '@/components/audio_modal';
import VideoModal from '@/components/video_modal';

import type { IGroupExt, IGroupItem } from '@/types/group';
import type { IFriendExt, IFriendItem } from '@/types/friend';

const Home: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const userInfoStore = useUserInfoStore();
  const userInfo = userInfoStore.userInfo;

  // 当前选中的图标
  const [curIconKey, setCurIconKey] = useState<IconKey>('MessageEmoji');
  // 更新密码的弹窗
  const [mountPwdModal, setMountPwdModal] = useState(false);
  // 更新用户信息的弹窗
  const [mountUserInfoModal, setMountUserInfoModal] = useState(false);
  // 音频聊天弹窗
  const [mountAudioModal, setMountAudioModal] = useState(false);
  // 视频聊天弹窗
  const [mountVideoModal, setMountVideoModal] = useState(false);
  // 当前选中的好友或群聊
  const [curChat, setCurChat] = useState<IFriendItem | IGroupItem | null>(null);
  // 房间号
  const [roomKey, setRoomKey] = useState<string>('');
  // 聊天模式: 音频; 视频; 音视频
  const [chatMode, setChatMode] = useState<string>('');
  // 接收者列表
  const [receiverList, setReceiverList] = useState<IReceiver[]>([]);

  // useRef 只会在组件挂载时调用 1 次, 组件重新渲染时, 不会重新调用 useRef
  // websocket 实例
  const socket = useRef<WebSocket | null>(null);
  // 通讯录实例
  const contactRef = useRef<IContactRef>(null); // sidebar
  // 聊天窗口实例
  const chatBoxRef = useRef<IChatBoxRef>(null); // main

  // 更新密码的弹窗挂载/卸载
  //! @/components/pwd_modal.tsx
  const handleMountPwdModal = (doMount: boolean) => setMountPwdModal(doMount);
  // 更新用户信息的弹窗挂载/卸载
  //! @/components/user_info_modal.tsx
  const handleMountUserInfoModal = (doMount: boolean) => setMountUserInfoModal(doMount);
  // 音频聊天弹窗挂载/卸载
  //! @/components/audio_modal.tsx
  const handleMountAudioModal = (doMount: boolean) => setMountAudioModal(doMount);
  // 视频聊天弹窗挂载/卸载
  //! @/components/video_modal.tsx
  const handleMountVideoModal = (doMount: boolean) => setMountVideoModal(doMount);
  // 退出登录
  const logout = async () => {
    try {
      const res = await logoutApi(userInfo);
      if (res.code !== BaseState.Success) {
        toast.error('退出登录失败');
        return;
      }
      userInfoStore.clearUserInfo();
      toast.success('退出登录成功');
      navigate('/login');
      if (socket.current !== null) {
        // 关闭 websocket 连接
        socket.current.close();
        socket.current = null;
      }
    } catch (err) {
      console.error(err);
      toast.error('退出登录失败');
    }
  };

  const UserInfoContent = (
    <div>
      <div className="flex h-30 w-100 gap-5">
        <ImgBox src={userInfo.avatar} className="h-30 w-30" />
        <div className="flex h-30 w-65 flex-col justify-between">
          <div className="flex flex-col gap-3">
            <div>{userInfo.username}</div>
            <div className="truncate">
              {userInfo.signature?.length ? userInfo.signature : '这个人很神秘, 什么都没有写'}
            </div>
          </div>
          <div className="flex justify-between">
            <Button onClick={() => handleMountPwdModal(true)}>修改密码</Button>
            <Button onClick={() => handleMountUserInfoModal(true)}>修改用户信息</Button>
          </div>
        </div>
      </div>
    </div>
  );

  const setupSocket = () => {
    const ws = new WebSocket(
      `${import.meta.env.VITE_WS_BASE_URL}/user/chan?email=${userInfo.email}`,
    );
    ws.onmessage = (ev) => {
      const msg = JSON.parse(ev.data);
      switch (msg.type) {
        case 'wsFriendList':
          // 刷新好友列表
          contactRef.current?.fetchFriendList();
          break;
        case 'wsGroupList':
          // 刷新群聊列表
          contactRef.current?.fetchGroupList();
          break;
        case 'wsMsgList':
          // 刷新消息列表
          chatBoxRef.current?.fetchMsgList();
          break;
        case 'wsChatRooms':
          try {
            const { receiverList, roomKey, mode } = msg;
            setReceiverList(receiverList);
            setChatMode(mode);
            setRoomKey(roomKey);
          } catch (err) {
            console.error(err);
            toast.error('音视频聊天失败');
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
        return logout();
    }
  };

  const handleSelectChat = (chat: IFriendExt | IGroupExt) => {
    navigate('/chat');
    setCurChat(chat);
  };

  return (
    <div>
      <div className="flex h-dvh w-dvw">
        {/* 左侧 */}
        <div className="bg-theme2 flex flex-col items-center justify-between py-5">
          <ul className="flex flex-col items-center gap-5">
            <li>
              <Popover content={UserInfoContent} placement="right">
                <div>
                  <ImgBox src={userInfo.avatar} className="h-25 w-25 cursor-pointer" />
                </div>
              </Popover>
            </li>
            {IconList.slice(0, 5).map((item) => (
              <li key={item.key}>
                <Tooltip placement="right" title={item.title} arrow={false}>
                  <item.IconInst
                    onClick={() => handleClickIcon(item)}
                    className={`${curIconKey === item.key ? 'text-theme5' : 'text-slate-500'} cursor-pointer text-5xl`}
                  />
                </Tooltip>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col items-center gap-5">
            {IconList.slice(5).map((item) => (
              <li key={item.key}>
                <Tooltip placement="right" title={item.title} arrow={false}>
                  <item.IconInst
                    onClick={() => handleClickIcon(item)}
                    className={`${curIconKey === item.key ? 'text-theme5' : 'text-slate-500'} cursor-pointer text-5xl`}
                  />
                </Tooltip>
              </li>
            ))}
          </ul>
        </div>
        {/* 右侧 */}
        <div>
          {
            (() => {
              switch (curIconKey) {
                case 'MessageEmoji':
                  return <ChatBox ref={chatBoxRef} />;
                case 'AddressBook':
                  return <Contact ref={contactRef} handleSelectChat={handleSelectChat} />;
              }
            })() /** IIFE */
          }
        </div>
      </div>
      {mountPwdModal && <PwdModal />}
      {mountUserInfoModal && <UserInfoModal />}
      {mountAudioModal && <AudioModal />}
      {mountVideoModal && <VideoModal />}
    </div>
  );
};

export default Home;
