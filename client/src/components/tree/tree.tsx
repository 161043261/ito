import { useState } from 'react';

export interface ITreeNode {
  key: string | number;
  title: React.ReactNode;
  children?: ITreeNode[];
  selected: boolean;
}

export interface ITreeProps {
  treeData: ITreeNode[];
}

const TreeDemo: React.FC<ITreeProps> = ({ treeData: treeData_ }: ITreeProps) => {
  const [treeData, setTreeData] = useState<ITreeNode[]>(treeData_);
  const handleChange = (node: ITreeNode, selected: boolean) => {
    setTreeData(
      (() => {
        const recursive = (node: ITreeNode) => {
          node.selected = selected;
          if (node.children) {
            for (const child of node.children) {
              recursive(child);
            }
          }
        };
        return treeData.map((item) => {
          if (item.key === node.key) {
            recursive(item);
          }
          return item;
        });
      })(), // IIFE
    );
  };
  return (
    <div>
      {treeData.map((item) => (
        <div key={item.key} className="ml-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={item.selected}
              onChange={(ev) => handleChange(item, ev.target.checked)}
            />
            <div>{item.title}</div>
          </div>
          <div>{item.children && <TreeDemo treeData={item.children} />}</div>
        </div>
      ))}
    </div>
  );
};

export default TreeDemo;
