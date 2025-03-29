import SearchBar from '@/components/search_bar';
import useToast from '@/hooks/use_toast';
import useUserInfoStore from '@/store/user_info';
import type { IFriendExt, ITaggedFriends } from '@/types/friend';
import type { IGroupExt, IGroupItem } from '@/types/group';
import type { ITagItem } from '@/types/friend';
import { Form, TabsProps } from 'antd';
import { useImperativeHandle, useMemo, useState } from 'react';
import ImgBox from '@/components/base64img';
import {
  createTagApi,
  fetchFriendByIdApi,
  fetchFriendListApi,
  fetchTagListApi,
  updateFriendApi,
} from '@/apis/friend';
import { BaseState } from '@/utils/constants';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { fetchGroupListById } from '@/apis/group';

export interface IContactRef {
  fetchFriendList: () => void; // 刷新好友列表
  fetchGroupList: () => void; // 刷新群聊列表
}

interface IProps {
  ref: React.Ref<IContactRef>;
  handleSelectChat: (chat: IFriendExt | IGroupExt) => void;
}

interface IFriendForm {
  email: string;
  username: string;
  noteName: string;
  tagId: number;
}

const Contact: React.FC<IProps> = ({ ref, handleSelectChat }: IProps /** props */) => {
  const userInfoStore = useUserInfoStore();
  const userInfo = userInfoStore.userInfo;
  const toast = useToast();

  // 当前标签页类型: 好友或群聊
  const [curTab, setCurTab] = useState<string>(TabType.Friend);
  // 好友列表
  const [friendList, setFriendList] = useState<ITaggedFriends /** 某标签下的全部好友 */[]>([]);
  // 当前选中的好友
  const [curFriend, setCurFriend] = useState<IFriendExt>();
  // 标签列表
  const [tagList, setTagList] = useState<ITagItem[]>([]);
  const [friendFormInst] = Form.useForm<IFriendForm>();
  // 新建标签的弹窗挂载/卸载
  const [mountCreateTagModal, setMountCreateTagModal] = useState(false);
  // 新建标签名
  const [newTagName, setNewTagName] = useState('');
  // 群聊列表
  const [groupList, setGroupList] = useState<IGroupExt[]>([]);
  // 当前选中的群聊
  const [curGroup, setCurGroup] = useState<IGroupExt>();
  // 新建群聊的弹窗挂载/卸载
  const [mountCreateGroupModal, setMountCreateGroupModal] = useState(false);

  // Tree 组件的数据
  const treeData = friendList.map((taggedFriends) => {
    return {
      key: taggedFriends.tagName,
      title: (
        <div className="flex">
          <div>标签名 {taggedFriends.tagName}</div>
          <div>
            在线人数/总人数 {taggedFriends.onlineCnt} / {taggedFriends.friends.length}
          </div>
        </div>
      ),
      selectable: false,
      children: taggedFriends.friends.map((friend) => ({
        key: friend.id, // number
        title: (
          <div>
            <ImgBox src={friend.avatar} />
            <div>{friend.noteName}</div>
            <div>{friend.state === 'online' ? '在线' : '离线请留言'}</div>
          </div>
        ),
      })),
      isLeaf: true,
    };
  });

  // 根据节点的 key 获取节点的数据
  const _fetchNodeById = async (keyId: number) => {
    try {
      const res = await fetchFriendByIdApi(keyId);
      console.log('fetchNodeById:', res.data);
      if (res.code === BaseState.Success && res.data) {
        setCurFriend(res.data);
        friendFormInst.setFieldsValue({
          email: res.data.email,
          username: res.data.username,
          noteName: res.data.noteName,
          tagId: res.data.tagId,
        });
      } else {
        toast.error('获取好友详情失败');
      }
    } catch (err) {
      console.error(err);
      toast.error('获取好友详情失败');
    }
  };

  const handleSelect: DirectoryTreeProps['onSelect'] = (selectedKeys, info) => {
    //! type Key = string | number | bigint;
    _fetchNodeById(info.node.key as number);
  };

  // 获取好友列表
  const fetchFriendList = async () => {
    try {
      const res = await fetchFriendListApi();
      console.log('fetchFriendList:', res.data);
      if (res.code === BaseState.Success && res.data) {
        setFriendList(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('获取好友列表失败');
    }
  };

  // 获取标签列表
  const _fetchTagList = async () => {
    try {
      const res = await fetchTagListApi();
      console.log('fetchTagList:', res);
      if (res.code === BaseState.Success && res.data) {
        setTagList(res.data);
      } else {
        toast.error('获取标签列表');
      }
    } catch (err) {
      console.error(err);
      toast.error('获取标签列表失败');
    }
  };

  // 更新好友详情
  const updateFriend = () => {
    friendFormInst.validateFields().then(async (values) => {
      try {
        const params = {
          friendId: curFriend!.friendId,
          noteName: values.noteName ? values.noteName : curFriend!.email,
          tagId: values.tagId,
        };
        const res = await updateFriendApi(params);
        console.log('updateFriend:', res);
        if (res.code === BaseState.Success && res.data) {
          toast.success('更新好友详情成功');
          fetchFriendList();
        } else {
          toast.error('更新好友详情失败');
        }
      } catch (err) {
        console.error(err);
        toast.error('更新好友详情失败');
      }
    });
  };

  // 新建标签
  const createTag = async () => {
    if (!newTagName) {
      toast.warning('请输入标签名');
      return;
    }
    try {
      const params = {
        userId: userInfo.id,
        userEmail: userInfo.email,
        name: newTagName,
      };
      const res = await createTagApi(params);
      if (res.code === BaseState.Success) {
        toast.success('新建标签成功');
        fetchFriendList();
        _fetchTagList();
        setMountCreateTagModal(false);
      } else {
        toast.error('新建标签失败');
      }
    } catch (err) {
      console.error(err);
      toast.error('新建标签失败');
    }
  };

  // 获取群聊列表
  const fetchGroupList = async () => {
    try {
      const res = await fetchFriendListApi();
      console.log('fetchGroupList:', res);
      if (res.code === BaseState.Success) {
        setFriendList(res.data);
      } else {
        toast.error('获取群聊列表失败');
      }
    } catch (err) {
      console.error(err);
      toast.error('获取群聊列表失败');
    }
  };

  const handleSelectGroup = async (item: IGroupItem) => {
    try {
      const res = await fetchGroupListById(item.id);
      if (res.code === BaseState.Success) {
        setCurGroup(res.data);
      } else {
        toast.error('获取群聊详情失败');
      }
    } catch (err) {
      console.error(err);
      toast.error('获取群聊详情失败');
    }
  };

  const handleCreateGroupModal = (doMount: boolean) => {
    setMountCreateGroupModal(doMount);
  };

  enum TabType {
    Index = 'index',
    Detail = 'detail',
  }

  const tabItems: TabsProps['items'] = [
    {
      key: TabType.Index,
      label: '主页',
      children: (
        <div>
          <div>群主: {curGroup?.ownerEmail}</div>
          <div>创建时间: {curGroup?.createdAt}</div>
          <div>群聊人数: {curGroup?.members.length}</div>
        </div>
      ),
    },
    {
      key: TabType.Detail,
      label: '成员',
      children: (
        <div>
          <ul className="flex items-center justify-between">
            <li>用户名</li>
            <li>群昵称</li>
            <li>加入时间</li>
            <li>最后发言时间</li>
          </ul>
          <div>
            {curGroup?.members.map((item) => (
              <ul key={item.userId}>
                <li>{item.username}</li>
                <li>{item.nickname}</li>
                <li>{item.createAt.split('.')[0].replace('T', ' ')}</li>
                <li>{item.latestMsgTime?.split('.')[0].replace('T', '') || '没有发言记录'}</li>
              </ul>
            ))}
          </div>
        </div>
      ),
    },
  ];

  const ContactList = useMemo(() => {
    return (
      <div>
        <SearchBar />
      </div>
    );
  }, [friendList, groupList, curGroup]);
  useImperativeHandle(ref, () => {
    return {
      fetchFriendList,
      fetchGroupList,
    };
  });
  return (
    <div>
      <div>
        <SearchBar />
      </div>
    </div>
  );
};

export default Contact;
