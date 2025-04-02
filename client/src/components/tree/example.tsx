import TreeDemo, { ITreeNode } from './tree';

export default function TreeExample() {
  const treeData: ITreeNode[] = [
    {
      key: 1,
      title: '1',
      selected: false,
      children: [
        {
          key: 11,
          title: '1.1',
          selected: false,
        },
        {
          key: 12,
          title: '1.2',
          selected: false,
          children: [
            {
              key: 121,
              title: '1.2.1',
              selected: false,
            },
            {
              key: 122,
              title: '1.2.2',
              selected: false,
            },
          ],
        },
      ],
    },
    {
      key: 2,
      title: '2',
      selected: false,
    },
    {
      key: 3,
      title: '3',
      selected: false,
    },
  ];
  return <TreeDemo treeData={treeData} />;
}
