import SearchBar from '@/components/search_bar';
import useToast from '@/hooks/use_toast';
import useUserInfoStore from '@/store/user_info';
import type { IFriendExt, ITaggedFriends } from '@/types/friend';
import type { IGroupExt, IGroupItem } from '@/types/group';
import type { ITagItem } from '@/types/friend';
import { Button, Empty, Form, Input, Modal, Select, Tabs, TabsProps, Tooltip } from 'antd';
import { useEffect, useImperativeHandle, useMemo, useState } from 'react';
import ImgContainer from '@/components/img_container';
import {
  addTagApi,
  fetchFriendByIdApi,
  fetchFriendListApi,
  fetchTagListApi,
  updateFriendApi,
} from '@/apis/friend';
import { BaseState } from '@/utils/constants';
import type { DirectoryTreeProps } from 'antd/es/tree';
import { fetchGroupById, fetchGroupListApi } from '@/apis/group';
import DirectoryTree from 'antd/es/tree/DirectoryTree';
import { Wechat } from '@icon-park/react';
import CreateGroupModal from '@/components/create_group_modal';

export interface IContactRef {
  fetchFriendList: () => void; // 获取好友列表
  fetchGroupList: () => void; // 获取群聊列表
}

interface IProps {
  ref: React.Ref<IContactRef>;
  startChat: (chat: IFriendExt | IGroupExt) => void;
}

interface IFriendForm {
  email: string;
  username: string;
  noteName: string;
  tagId: number;
}

enum TabKey {
  Friend = 'friend', // 好友标签页
  Group = 'group', // 群聊标签页
}

enum SubTabKey {
  GroupIndex = 'groupIndex',
  GroupDetail = 'groupDetail',
}

const Contact: React.FC<IProps> = ({ ref, startChat }: IProps /** props */) => {
  const userInfoStore = useUserInfoStore();
  const userInfo = userInfoStore.userInfo;
  const toast = useToast();

  // 当前标签页类型: 好友或群聊
  const [curTab, setCurTab] = useState<string>(TabKey.Friend);
  // 好友列表
  const [friendList, setFriendList] = useState<ITaggedFriends /** 某标签下的全部好友 */[]>([]);
  // 当前选中的好友
  const [curFriend, setCurFriend] = useState<IFriendExt>();
  // 标签列表
  const [tagList, setTagList] = useState<ITagItem[]>([]);
  // 好友表单实例
  const [friendFormInst] = Form.useForm<IFriendForm>();
  const [addTagFormInst] = Form.useForm<{ tagName: string }>();

  // 新建标签的弹窗挂载/卸载
  const [mountAddTagModal, setMountAddTagModal] = useState(false);
  // 新建标签名
  const [newTagName, setNewTagName] = useState('');
  // 群聊列表
  const [groupList, setGroupList] = useState<IGroupItem[]>([]);
  // 当前选中的群聊
  const [curGroup, setCurGroup] = useState<IGroupExt>();
  // 创建群聊的弹窗挂载/卸载
  const [mountCreateGroupModal, setMountCreateGroupModal] = useState(false);

  // Tree 组件的数据
  const treeData = friendList.map((taggedFriends) => {
    return {
      key: taggedFriends.tagName,
      title: (
        <div className="flex items-center justify-between">
          <div>{taggedFriends.tagName}</div>
          <div>
            {taggedFriends.onlineCnt} / {taggedFriends.friends.length}
          </div>
        </div>
      ),
      selectable: false,
      children: taggedFriends.friends.map((friend) => ({
        key: friend.id, // number
        title: (
          <div className="flex items-center justify-between">
            <ImgContainer src={friend.avatar} className="h-20" />
            <div>{friend.noteName}</div>
            <div>{friend.state === 'online' ? '在线' : '离线'}</div>
          </div>
        ),
        isLeaf: true,
      })),
    };
  });

  /**
   *
   * @param keyId friend.id
   * @description 根据节点的 key (好友 ID) 获取节点的数据
   */
  const _fetchNodeById = async (keyId: number) => {
    try {
      const res = await fetchFriendByIdApi(keyId);
      if (res.code === BaseState.Ok && res.data) {
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

  const handleSelectNode: DirectoryTreeProps['onSelect'] = (_selectedKeys, info) => {
    //! type Key = string | number | bigint;
    _fetchNodeById(info.node.key as number);
  };

  // 获取好友列表
  const fetchFriendList = async () => {
    try {
      const res = await fetchFriendListApi();
      if (res.code === BaseState.Ok && res.data) {
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
      if (res.code === BaseState.Ok && res.data) {
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
        if (res.code === BaseState.Ok /**  && res.data */) {
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
  const addTag = async () => {
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
      const res = await addTagApi(params);
      if (res.code === BaseState.Ok) {
        toast.success('新建标签成功');
        fetchFriendList();
        _fetchTagList();
        setMountAddTagModal(false);
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
      const res = await fetchGroupListApi();
      if (res.code === BaseState.Ok) {
        setGroupList(res.data);
      } else {
        toast.error('获取群聊列表失败');
      }
    } catch (err) {
      console.error(err);
      toast.error('获取群聊列表失败');
    }
  };

  const handleClickGroup = async (item: IGroupItem) => {
    try {
      const res = await fetchGroupById(item.id);
      if (res.code === BaseState.Ok) {
        setCurGroup(res.data);
      } else {
        toast.error('获取群聊详情失败');
      }
    } catch (err) {
      console.error(err);
      toast.error('获取群聊详情失败');
    }
  };

  const handleAddFriends2group = (doMount: boolean) => {
    setMountCreateGroupModal(doMount);
  };

  const ctxMenu = (tabKey: TabKey) => {
    return tabKey === TabKey.Friend ? (
      <ul>
        <li onClick={fetchFriendList}>刷新好友列表</li>
        <li onClick={() => setMountAddTagModal(true)}>新建标签</li>
      </ul>
    ) : (
      <ul>
        <li onClick={fetchGroupList}>刷新群聊列表</li>
      </ul>
    );
  };

  const tabLabel = (tabKey: TabKey) => {
    return (
      <Tooltip placement="bottomLeft" title={ctxMenu(tabKey)} arrow={false} trigger={'contextMenu'}>
        {tabKey === TabKey.Friend ? '好友' : '群聊'}
      </Tooltip>
    );
  };

  const handleTabChange = (tabKey: string) => setCurTab(tabKey);

  const tabItems: TabsProps['items'] = [
    {
      key: TabKey.Friend,
      label: tabLabel(TabKey.Friend),
      children:
        treeData.length === 0 ? (
          <Empty />
        ) : (
          <DirectoryTree
            onSelect={handleSelectNode}
            treeData={treeData}
            icon={null}
            showIcon={false}
            className="w-[100%]"
          />
        ),
    },
    {
      key: TabKey.Group,
      label: tabLabel(TabKey.Group),
      children:
        groupList.length === 0 ? (
          <Empty />
        ) : (
          <div>
            {groupList.map((item) => (
              <div
                key={item.id}
                onClick={() => handleClickGroup(item)}
                className="flex h-20 cursor-pointer items-center justify-between rounded-3xl hover:bg-slate-100"
              >
                <div className="flex-1">
                  <ImgContainer src={item.avatar} className="h-18" />
                </div>
                <div className="flex-2 truncate">{item.name}</div>
              </div>
            ))}
          </div>
        ),
    },
  ];

  const subTabItems: TabsProps['items'] = [
    {
      key: SubTabKey.GroupIndex,
      label: '群聊主页',
      children: (
        <div>
          <div>群主: {curGroup?.ownerEmail}</div>
          <div>群聊人数: {curGroup?.memberList.length}</div>
          <div>创建时间: {curGroup?.createdAt.split('.')[0].replace('T', '')}</div>
        </div>
      ),
    },
    {
      key: SubTabKey.GroupDetail,
      label: '群聊详情',
      children: (
        <div>
          <ul className="flex">
            <li className="flex-1 font-bold">用户名</li>
            <li className="flex-1 font-bold">群昵称</li>
            <li className="flex-1 font-bold">加入时间</li>
            <li className="flex-1 font-bold">最后发言时间</li>
          </ul>
          <div>
            {curGroup?.memberList.map((item) => (
              <ul key={item.userId} className="flex">
                <li className="flex-1">{item.username}</li>
                <li className="flex-1">{item.nickname}</li>
                <li className="flex-1">{item.createdAt.split('.')[0].replace('T', ' ')}</li>
                <li className="flex-1">
                  {item.latestMsgTime?.split('.')[0].replace('T', '') || '没有发言记录'}
                </li>
              </ul>
            ))}
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    // 获取好友列表
    fetchFriendList();
    // 获取标签列表
    _fetchTagList();
    // 获取群聊列表
    fetchGroupList();
  }, []); //! onMounted

  //! defineExpose
  useImperativeHandle(ref, () => {
    return {
      fetchFriendList,
      fetchGroupList,
    };
  });

  const LeftContainer = useMemo(
    () => (
      <div className="flex-1 overflow-auto bg-blue-200 p-3">
        <SearchBar />
        <Tabs
          centered
          defaultActiveKey={TabKey.Friend}
          items={tabItems}
          onChange={handleTabChange}
        />
      </div>
    ),
    [friendList, groupList, curGroup],
  );

  return (
    <div>
      <div className="flex h-dvh">
        {LeftContainer}
        {/* rightContainer */}
        <div className="flex-3">
          {curTab === TabKey.Friend && curFriend && (
            <div className="mx-[20%]">
              <div className="flex items-center py-10">
                <ImgContainer src={curFriend.avatar} className="h-40 w-40" />
                <div className="ml-10">
                  <div>{curFriend.username}</div>
                  <div>{curFriend.signature ?? '这个人很神秘, 没有签名'}</div>
                </div>
              </div>
              <div>
                <Form form={friendFormInst}>
                  <Form.Item label="邮箱" name="email">
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item label="用户名" name="username">
                    <Input readOnly />
                  </Form.Item>
                  <Form.Item label="备注" name="noteName">
                    <Input placeholder="请输入备注" />
                  </Form.Item>
                  <Form.Item label="标签" name="tagId">
                    <Select
                      notFoundContent="没有标签"
                      placeholder="请选择标签"
                      options={tagList.map((item) => ({
                        label: item.name,
                        value: item.id,
                      }))}
                    />
                  </Form.Item>
                </Form>
                <div>
                  <Button onClick={updateFriend}>更新资料</Button>
                  <Button onClick={() => startChat(curFriend)}>发送消息</Button>
                </div>
              </div>
            </div>
          )}
          {curTab === TabKey.Group && curGroup && (
            <div className="mx-[20%]">
              <div className="flex items-center py-10">
                <ImgContainer src={curGroup.avatar} className="h-40 w-40" />
                <div className="ml-10">
                  <div>{curGroup.name}</div>
                  <div>{curGroup.readme ?? '这个群很神秘, 没有群公告'}</div>
                </div>
              </div>
              <div>
                <Tabs centered defaultActiveKey={SubTabKey.GroupIndex} items={subTabItems} />
              </div>
              <div>
                <Button onClick={() => handleAddFriends2group(true)}>邀请好友</Button>
                <Button type="primary" onClick={() => startChat(curGroup)}>
                  发送消息
                </Button>
              </div>
            </div>
          )}
          {!curFriend && !curGroup && <Wechat />}
        </div>
        {mountAddTagModal && (
          // width
          <Modal
            title="新建标签"
            open={mountAddTagModal}
            onCancel={() => setMountAddTagModal(false)}
            onOk={() => addTag()}
            cancelText="取消"
            okText="确定"
          >
            <Form name="addTagForm" form={addTagFormInst}>
              <Form.Item name="tagName">
                <Input
                  placeholder="请输入标签名"
                  onChange={(ev) => setNewTagName(ev.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}
        {mountCreateGroupModal && (
          <CreateGroupModal
            mountModal={mountCreateGroupModal}
            groupDetail={curGroup}
            setMountModal={setMountCreateGroupModal}
            type="addFriends"
          />
        )}
      </div>
    </div>
  );
};

export default Contact;
