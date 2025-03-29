import useToast from '@/hooks/use_toast';
import { IGroupDto } from '@/types/group';
import { useState } from 'react';
import { Button, Empty, Input, Modal, Tabs, TabsProps } from 'antd';
import { addFriendApi, fetchFriendListByNameApi } from '@/apis/friend';
import { BaseState } from '@/utils/constants';
import { Search } from '@icon-park/react';
import ImgBox from './base64img';
import { addSelf2GroupApi, fetchGroupListByNameApi } from '@/apis/group';

interface IProps {
  mountModal: boolean;
  setMountModal: (doModal: boolean) => void;
}

/**
 *
 * @description Add friend, or add self to group
 */
const AddModal: React.FC<IProps> = (props: IProps) => {
  const { mountModal, setMountModal } = props;
  const toast = useToast();
  const [friendList, setFriendList] = useState<
    {
      id: number;
      avatar: string;
      email: string;
      flag: boolean;
      username: string;
    }[]
  >([]);
  const [groupList, setGroupList] = useState<IGroupDto[]>([]);
  const [friendName, setFriendName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleFriendNameChange = (ev: { target: { value: string } }) => {
    setFriendName(ev.target.value);
    if (ev.target.value === '') {
      setFriendList([]);
    }
  };

  const _fetchFriendListByName = async (username: string) => {
    try {
      if (username === '') {
        setFriendList([]);
        return;
      }
      const res = await fetchFriendListByNameApi(username);
      if (res.code === BaseState.Success && res.data) {
        setFriendList(res.data);
      } else {
        toast.error('查询失败');
        setFriendList([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('查询失败');
      setFriendList([]);
    }
  };

  const handleAddFriend = async (id: number, email: string, avatar: string) => {
    setLoading(true);
    try {
      const res = await addFriendApi({ id, email, avatar });
      if (res.code === BaseState.Success) {
        toast.success('添加成功');
        setLoading(false);
        setMountModal(false);
      } else {
        toast.error('添加失败');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('添加失败');
      setLoading(false);
    }
  };

  const handleGroupNameChange = (ev: { target: { value: string } }) => {
    setGroupName(ev.target.value);
    if (ev.target.value === '') {
      setGroupList([]);
    }
  };

  const _fetchGroupListByName = async (groupName: string) => {
    try {
      if (groupName === '') {
        setGroupList([]);
        return;
      }
      const res = await fetchGroupListByNameApi(groupName);
      if (res.code === BaseState.Success && res.data) {
        setGroupList(res.data);
      } else {
        toast.error('查询失败');
        setGroupList([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('查询失败');
      setGroupList([]);
    }
  };

  const handleAddSelf2group = async (groupId: number) => {
    setLoading(true);
    try {
      const res = await addSelf2GroupApi({ groupId });
      if (res.code === BaseState.Success) {
        toast.success('加入群聊成功');
        setLoading(false);
        setMountModal(false);
      } else {
        toast.error('加入群聊失败');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('加入群聊失败');
      setLoading(false);
    }
  };

  const tabItems: TabsProps['items'] = [
    {
      key: 'addFriend',
      label: '加好友',
      children: (
        <div>
          <div className="flex items-center justify-between gap-5">
            <Input
              placeholder="请输入好友的用户名"
              prefix={<Search theme="outline" size="24" fill="#333" />}
              onChange={(ev) => handleFriendNameChange(ev)}
            />
            <Button type="primary" onClick={() => _fetchFriendListByName(friendName)}>
              查找
            </Button>
          </div>
          {friendList.length === 0 ? (
            <Empty />
          ) : (
            <div className="mt-3 flex flex-col gap-y-3">
              {friendList.map((item) => (
                <div key={item.id} className="grid grid-cols-4 items-center">
                  <ImgBox src={item.avatar} className="h-20 rounded-full" />
                  <div className="col-span-2 truncate">
                    <div>邮箱 {item.email}</div>
                    <div>用户名 {item.username}</div>
                  </div>
                  {item.flag ? (
                    <div className="justify-self-center">已经是好友了</div>
                  ) : (
                    <Button
                      className="justify-self-center"
                      onClick={() => handleAddFriend(item.id, item.email, item.avatar)}
                      loading={isLoading}
                    >
                      加好友
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'addGroup',
      label: '加群',
      children: (
        <div>
          <div className="flex items-center justify-between gap-5">
            <Input
              placeholder="请输入群聊名"
              prefix={<Search theme="outline" size="24" fill="#333" />}
              onChange={handleGroupNameChange}
            />
            <Button type="primary" onClick={() => _fetchGroupListByName(groupName)}>
              查找
            </Button>
          </div>
          {groupList.length === 0 ? (
            <Empty />
          ) : (
            <div className="mt-3 flex flex-col gap-y-3">
              {groupList.map((item) => (
                <div key={item.id} className="grid grid-cols-4 items-center">
                  <ImgBox src={item.avatar} className="h-20 rounded-full" />
                  <div className="col-span-2 truncate">
                    <div>群聊名 {item.name}</div>
                    <div>群聊人数 {item.memberNum} </div>
                  </div>
                  {item.flag ? (
                    <div className="justify-self-center">已经在群聊中了</div>
                  ) : (
                    <Button
                      className="justify-self-center"
                      onClick={() => handleAddSelf2group(item.id)}
                      loading={isLoading}
                    >
                      加入群聊
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <Modal
        open={mountModal}
        footer={null}
        onCancel={() => {
          setMountModal(false);
        }}
      >
        <Tabs defaultActiveKey="addFriend" items={tabItems} />
      </Modal>
    </div>
  );
};

export default AddModal;
