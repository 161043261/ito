import { Plus, Search } from '@icon-park/react';
import { Input, Tooltip } from 'antd';
import { useState } from 'react';
import AddModal from './add_modal';
import CreateGroupModal from './create_group_modal';

const SearchBar: React.FC = () => {
  const [mountAddModal, setMountAddModal] = useState(false);
  const [mountCreateGroupModal, setMountCreateGroupModal] = useState(false);
  const handleMountAddModal = (doMount: boolean) => {
    setMountAddModal(doMount);
  };
  const handleCreateModal = (doMount: boolean) => {
    setMountCreateGroupModal(doMount);
  };

  /**
   * @description Add friend to group, add self to group, or create group
   */
  const AddOrCreateGroup = (
    <ul className="cursor-pointer">
      <li onClick={() => handleMountAddModal(true)}>加好友/群聊</li>
      <li onClick={() => handleCreateModal(true)}>创建群聊</li>
    </ul>
  );
  return (
    <div>
      <div className="flex items-center gap-5">
        <Input
          placeholder="搜索好友/群聊"
          prefix={<Search theme="outline" size="24" fill="#333" />}
        />
        <Tooltip placement="bottomLeft" title={AddOrCreateGroup} arrow={false}>
          <Plus theme="outline" size="24" fill="#333" className="cursor-pointer" />
        </Tooltip>
      </div>
      {mountAddModal && <AddModal mountModal={mountAddModal} setMountModal={setMountAddModal} />}
      {mountCreateGroupModal && (
        <CreateGroupModal
          mountModal={mountCreateGroupModal}
          setMountModal={setMountCreateGroupModal}
          type="createGroup"
        />
      )}
    </div>
  );
};

export default SearchBar;
