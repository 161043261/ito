import { IGroupExt } from '@/types/group';

interface IProps {
  mountModal: boolean;
  setMountModal: (doMount: boolean) => void;
  type: 'addFriends' | 'createGroup';
  group?: IGroupExt;
}
const CreateGroupModal: React.FC<IProps> = (props: IProps) => {
  console.log(props);
  return (
    <div>
      <div>CreateGroupModal</div>
    </div>
  );
};

export default CreateGroupModal;
