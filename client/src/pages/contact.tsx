/* eslint-disable @typescript-eslint/no-unused-vars */
import ContactHeader from '@/components/contact_header';
import useToast from '@/hooks/use_toast';
import useUserInfoStore from '@/store/user_info';
import { TabType } from '@/types/chat';
import type { IFriendInfo, IFriendItem, ITagFriends } from '@/types/friend';
import type { IGroupInfo } from '@/types/group';
import type { ITagItem } from '@/types/tag';
import { Form } from 'antd';
import { useImperativeHandle, useMemo, useState } from 'react';

interface IProps {
  ref: React.Ref<IContactRef>;
  handleSelectChat: (chatInfo: IFriendInfo | IGroupInfo) => void;
}

interface IFriendForm {
  email: string;
  username: string;
  noteName: string;
  tagName: string;
}

export interface IContactRef {
  fetchFriendList: () => void; // 刷新好友列表
  fetchGroupList: () => void; // 刷新群聊列表
}

const Contact: React.FC<IProps> = ({ ref }: IProps /** props */) => {
  const userInfoStore = useUserInfoStore();
  const userInfo = userInfoStore.userInfo;
  const toast = useToast();

  // 当前标签页类型: 单聊或群聊
  const [curTab, setCurTab] = useState<string>(TabType.P2p);
  // 好友列表
  const [friendList, setFriendList] = useState<ITagFriends /** 某标签下的全部好友 */[]>([]);
  // 当前选中的好友信息
  const [curFriendInfo, setCurFriendInfo] = useState<IFriendInfo>();
  // 标签列表
  const [tagList, setTagList] = useState<ITagItem[]>([]);
  const [friendFormInst] = Form.useForm<IFriendForm>();

  // 新建标签的弹窗挂载/卸载
  const [mountCreateTagModal, setMountCreateTagModal] = useState(false);
  // 新建标签名
  const [newTagName, setNewTagName] = useState('');
  // 群聊列表
  const [groupList, setGroupList] = useState<IGroupInfo[]>([]);
  // 当前选中的群聊信息
  const [curGroupInfo, setCurGroupInfo] = useState<IGroupInfo>();
  const [mountCreateGroupModal, setMountCreateGroupModal] = useState(false);
  const fetchFriendList = () => {
    console.log('fetchFriendList');
  };
  const fetchGroupList = () => {
    console.log('fetchGroupList');
  };

  const ContactList = useMemo(() => {
    return (
      <div>
        <ContactHeader />
      </div>
    );
  }, [friendList, groupList, curGroupInfo]);
  useImperativeHandle(ref, () => {
    return {
      fetchFriendList,
      fetchGroupList,
    };
  });
  return (
    <div>
      <div>
        <ContactHeader />
      </div>
    </div>
  );
};

export default Contact;
