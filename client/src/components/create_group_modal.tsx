import { FriendList, IFriendItem } from '@/types/friend';
import { IGroupExt } from '@/types/group';
import { Button, Form, Modal, Tree } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import ImgContainer from './img_container';
import useToast from '@/hooks/use_toast';
import { fetchFriendListApi } from '@/apis/friend';
import { BaseState } from '@/utils/constants';

interface IProps {
  mountModal: boolean;
  setMountModal: (doMount: boolean) => void;
  type: 'addFriends' | 'createGroup';
  // type === 'addFriends' 时, 需要传递群聊详情
  groupDetail?: IGroupExt;
}

const CreateGroupModal: React.FC<IProps> = (props: IProps) => {
  const { mountModal, setMountModal, type, groupDetail } = props;
  const toast = useToast();

  const [friendList, setFriendList] = useState<FriendList>([]);
  const [checkedFriendList, setCheckedFriendList] = useState<IFriendItem[]>([]);
  const [friendId2friend, setFriendId2friend] = useState<Record<number, IFriendItem>>({});

  const [isLoading, setIsLoading] = useState(false);
  const [createGroupFormInst] = Form.useForm<IProps>();
  const stepRef = useRef<HTMLDivElement | null>(null); // 第一步
  const stepRef2 = useRef<HTMLDivElement | null>(null); // 第二步

  const treeData = friendList.map((taggedFriends) => {
    return {
      title: <div>{taggedFriends.tagName}</div>,
      key: taggedFriends.tagName,
      selectable: false,
      disabled: taggedFriends.friends.length === 0,
      children: taggedFriends.friends.map((friend) => ({
        title: (
          <div>
            <ImgContainer src={friend.avatar} />
            <div>{friend.noteName}</div>
          </div>
        ),
        key: friend.id, // number
        isLeaf: true,
        selectable: false,
      })),
    };
  });

  const fetchFriendList = async () => {
    try {
      const res = await fetchFriendListApi();
      if (res.code === BaseState.Ok && res.data) {
        const friendList = res.data;
        setFriendList(friendList);
        const newFriendId2friend: Record<number, IFriendItem> = {};
        for (const taggedFriends of friendList) {
          for (const friend of taggedFriends.friends) {
            newFriendId2friend[friend.id] = friend;
          }
        }
        setFriendId2friend(newFriendId2friend);
      }
    } catch (err) {
      console.error(err);
      toast.error('获取好友列表失败');
    }
  };

  useEffect(() => {
    fetchFriendList();
  }, []);

  const handleCancel = () => {
    setMountModal(false);
  };

  const switchStep = (step: 0 | 1 | 2) => {
    switch (step) {
      case 0:
        toast.error('至少邀请 1 位好友');
        break;

      case 1:
        if (stepRef.current && stepRef2.current) {
          stepRef.current.style.opacity = '1'; // 不透明度 1
          stepRef2.current.style.opacity = '0'; // 不透明度 0
          setTimeout(() => {
            stepRef.current!.style.display = 'block';
            stepRef2.current!.style.display = 'none';
          }, 500);
        }
        break;

      case 2:
        if (stepRef.current && stepRef2.current) {
          stepRef.current.style.display = '0'; // 不透明度 0
          stepRef2.current.style.display = '1'; // 不透明度 1
          setTimeout(() => {
            stepRef.current!.style.display = 'none';
            stepRef2.current!.style.display = 'block';
          }, 500);
        }
        break;
    }
  };

  const FriendsTree = useMemo(() => {
    return (
      <Tree
        checkable
        defaultExpandAll={true}
        treeData={treeData}
        onCheck={(checkedKeys) => {
          const checkedIdList = (checkedKeys as (number | string)[]).filter(
            Number.isInteger,
          ) as number[];
          setCheckedFriendList(checkedIdList.map((checkedId) => friendId2friend[checkedId]));
        }}
      ></Tree>
    );
  }, [friendList]);

  const createGroup = async () => {};
  const addFriends2group = async () => {};

  return (
    <div>
      <Modal
        title={type === 'addFriends' ? '邀请好友' : '创建群聊'}
        open={mountModal}
        onCancel={handleCancel}
      >
        <div className="flex">
          <div className="flex-1">
            <div>好友列表</div>
            {FriendsTree}
          </div>
          <div className="flex-1">
            <div>已选择的好友</div>
            {checkedFriendList.map((item) => {
              return (
                <div key={item.id} className="mt-2 flex items-center justify-between">
                  <ImgContainer className="w-10" src={item.avatar} />
                  <div>{item.noteName}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {type === 'addFriends' ? (
            <Button onClick={addFriends2group} loading={isLoading}>
              邀请
            </Button>
          ) : (
            <Button onClick={() => switchStep(2)}>下一步</Button>
          )}
        </div>
        <div ref={stepRef}>
          <Form form={createGroupFormInst} onFinish={createGroup}>
            <Form.Item
              label="头像"
              rules={[{ required: true, message: '请上传群聊头像' }]}
              name="avatar"
            ></Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default CreateGroupModal;
