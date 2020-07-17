import React, { useState } from 'react';
import { Tree } from 'antd';
import { FormOutlined } from '@ant-design/icons';
import styles from './index.module.less';

const { DirectoryTree } = Tree;

export default props => {

  // expandedKeys展开的节点
  const [ expandedKeys, setExpandedKeys ] = useState([0])

  // selectedKeys选中的节点
  const [ selectedKeys, setSelectedKeys ] = useState([0])

  const treeData = [
    {
      title: <div className={styles.title}>
        <span>菜单管理</span>
        { selectedKeys.indexOf('0-0')>-1 && <span className={styles.icons}><FormOutlined /></span>}
      </div>,
      key: '0-0',
      children: [
        {
          title: 'leaf 0-0',
          key: '0-0-0',
          isLeaf: true,
        },
        {
          title: 'leaf 0-1',
          key: '0-0-1',
          isLeaf: true,
        },
      ],
    }
  ];

  const onSelect = (keys, e) => {
    setSelectedKeys([e.node.key])
    // if(selectedKeys.indexOf(e.node.key)>-1){
      const index = expandedKeys.indexOf(e.node.key);
      if(index === -1){
        setExpandedKeys([...expandedKeys, e.node.key])
      // }else if(selectedKeys.indexOf(e.node.key)>-1){
      //   setExpandedKeys([...expandedKeys.slice(0, index), ...expandedKeys.slice(index+1)])
      }else{
        setExpandedKeys([...expandedKeys.slice(0, index), ...expandedKeys.slice(index+1)])
      }
    // }
  }
  const onExpand = (keys, e) => {
    
  }
  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <DirectoryTree
          multiple
          selectedKeys={selectedKeys}
          expandedKeys={expandedKeys}
          showIcon={false}
          defaultExpandAll
          onSelect={onSelect}
          onExpand={onExpand}
          treeData={treeData}
        />
      </div>
    </div>
  )
}