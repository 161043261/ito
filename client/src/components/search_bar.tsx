import { Plus, Search } from '@icon-park/react';
import { Input, Tooltip } from 'antd';
import { useState } from 'react';
import AddModal from './add_modal';
import CreateGroupModal from './create_group_modal';

const SearchBar: React.FC = () => {
  const [mountAddModal, setMountAddModal] = useState(true);
  const [mountCreateModal, setMountCreateModal] = useState(false);
  const handleMountAddModal = (doMount: boolean) => {
    setMountAddModal(doMount);
  };
  const handleCreateModal = (doMount: boolean) => {
    setMountCreateModal(doMount);
  };
  const AddOrCreate = (
    <ul>
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
        <Tooltip placement="bottomLeft" title={AddOrCreate} arrow={false}>
          <Plus theme="outline" size="24" fill="#333" />
        </Tooltip>
      </div>
      {mountAddModal && <AddModal mountModal={mountAddModal} setMountModal={setMountAddModal} />}
      {mountCreateModal && <CreateGroupModal />}
    </div>
  );
};

export default SearchBar;
