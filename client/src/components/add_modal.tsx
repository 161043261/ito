import useToast from '@/hooks/use_toast';
import { IFriendInfo, IFriendItem } from '@/types/friend';
import { IGroupItem } from '@/types/group';
import { ChangeEvent, useState } from 'react';
import { Button, Input, Modal, Tabs, TabsProps } from 'antd';
import { fetchFriendListApi, fetchFriendListByNameApi } from '@/apis/friend';
import { BaseState } from '@/utils/constants';
import { Search } from '@icon-park/react';

interface IProps {
  mountModal: boolean;
  setMountModal: (doModal: boolean) => void;
}

const AddFriendOrGroupModal: React.FC<IProps> = (props: IProps) => {
  const { mountModal, setMountModal } = props;
  const toast = useToast();
  const [friendList, setFriendList] = useState<Partial<IFriendItem>[]>([]);
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

  const handleAddFriend = async (username: string) => {
    try {
      if (username === '') {
        setFriendList([]);
        return;
      }
      const res = await fetchFriendListByNameApi(username);
      if (res.code === BaseState.Success && res.data) {
        setFriendList(res.data);
        console.log(res.data);
      } else {
        toast.error('查询失败, 请重试');
        setFriendList([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: '加好友',
      children: (
        <div>
          <Input
            placeholder="请输入好友的用户名"
            prefix={<Search theme="outline" size="24" fill="#333" />}
            onChange={(ev) => handleFriendNameChange(ev)}
          />
          <Button type="primary" onClick={() => handleAddFriend(friendName)} />
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
        <Tabs defaultActiveKey="1" items={items} />
      </Modal>
    </div>
  );
};

export default AddFriendOrGroupModal;
