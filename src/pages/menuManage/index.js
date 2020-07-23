import React, { useState } from 'react';
import Tree, { TreeNode } from '@/components/tree';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import styles from './index.module.less';

export default props => {
  // expandedKeys展开的节点
  const [expandedKeys, setExpandedKeys] = useState([0]);

  // selectedKeys选中的节点
  const [selectedKeys, setSelectedKeys] = useState([0]);

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Tree
        // expandedIds={ [] }
        // selectedIds={ [] }
        >
          <TreeNode
            id="1111"
            title="菜单管理"
            rightNode={
              <span>
                <EditOutlined className={styles.edit} />
                <DeleteOutlined />
              </span>
            }
          >
            <TreeNode
              id="2222"
              title="子菜单1"
              rightNode={
                <span>
                  <EditOutlined className={styles.edit} />
                  <DeleteOutlined />
                </span>
              }
            >
              <TreeNode
                id="4444"
                title="子菜单1"
                rightNode={
                  <span>
                    <EditOutlined className={styles.edit} />
                    <DeleteOutlined />
                  </span>
                }
              ></TreeNode>
            </TreeNode>
          </TreeNode>
          <TreeNode
            id="3333"
            title="父菜单1"
            rightNode={
              <span>
                <EditOutlined className={styles.edit} />
                <DeleteOutlined />
              </span>
            }
          ></TreeNode>
        </Tree>
      </div>
    </div>
  );
};
