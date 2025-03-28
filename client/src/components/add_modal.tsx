import useToast from '@/hooks/use_toast';
import { IFriendInfo, IFriendItem } from '@/types/friend';
import { IGroupItem } from '@/types/group';
import { ChangeEvent, useState } from 'react';
import { Button, Empty, Input, Modal, Tabs, TabsProps } from 'antd';
import { addFriendApi, fetchFriendListApi, fetchFriendListByNameApi } from '@/apis/friend';
import { BaseState } from '@/utils/constants';
import { Search } from '@icon-park/react';
import Base64Img from './base64img';

interface IProps {
  mountModal: boolean;
  setMountModal: (doModal: boolean) => void;
}

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
  // todo: specify the generic
  const [groupList, setGroupList] = useState<Partial<IGroupItem[]>>([]);
  const [friendName, setFriendName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFriendNameChange = (ev: { target: { value: string } }) => {
    setFriendName(ev.target.value);
    if (ev.target.value === '') {
      setFriendList([]);
    }
  };

  const handleFetchFriendListByName = async (username: string) => {
    try {
      if (username === '') {
        setFriendList([]);
        return;
      }
      const res = await fetchFriendListByNameApi(username);
      if (res.code === BaseState.Success && res.data) {
        setFriendList(res.data);
      } else {
        toast.error('查询失败, 请重试');
        setFriendList([]);
      }
    } catch (err) {
      console.error(err);
      toast.error('查询失败, 请重试');
      setFriendList([]);
    }
  };

  const addFriend2group = async (id: number, email: string, avatar: string) => {
    setLoading(true);
    try {
      const res = await addFriendApi({ id, email, avatar });
      if (res.code === BaseState.Success) {
        toast.success('添加成功');
        setLoading(false);
        setMountModal(false);
      } else {
        toast.error('添加失败, 请重试');
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('添加失败, 请重试');
      setLoading(false);
    }
  };

  const handleGroupNameChange = (ev: { target: { value: string } }) => {
    setGroupName(ev.target.value);
    if (ev.target.value === '') {
      setGroupList([]);
    }
  };

  const handleFetchGroupListByName = async (groupName: string) => {
    console.log(groupName);
  };

  const addSelf2group = async (groupId: number) => {
    console.log(groupId);
  };

  const items: TabsProps['items'] = [
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
            <Button type="primary" onClick={() => handleFetchFriendListByName(friendName)}>
              查找
            </Button>
          </div>
          {friendList.length === 0 ? (
            <Empty />
          ) : (
            <div className="mt-3 flex flex-col gap-y-3">
              {friendList.map((item) => (
                // items-center: align-items: center;
                <div key={item.id} className="grid grid-cols-4 items-center">
                  <Base64Img src={item.avatar} className="h-20 rounded-full" />
                  <div className="col-span-2 truncate">
                    <div>邮箱 {item.email}</div>
                    <div>用户名 {item.username}</div>
                  </div>
                  {item.flag ? (
                    <div className="justify-self-center">已经是好友了</div>
                  ) : (
                    <Button
                      className="justify-self-center"
                      onClick={() => addFriend2group(item.id, item.email, item.avatar)}
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
        <div className="mt-3 flex flex-col gap-y-3">
          {groupList.map((item) => (
            <div key={item?.id}></div>
          ))}
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
        <Tabs defaultActiveKey="addFriend" items={items} />
      </Modal>
    </div>
  );
};

export default AddModal;
