import React, { useState, useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import Tree, { TreeNode } from '@/components/tree';
import { FormOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { connect } from 'dva';
import styles from './index.module.less';

export default connect(state => {
  const {
    user: { menuList },
  } = state.user;
  return { menuList };
})(props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [parentNode, setParentNode] = useState(null);
  // expandedIds展开的节点
  const [expandedIds, setExpandedIds] = useState([]);
  // selectedIds选中的节点
  const [selectedIds, setSelectedIds] = useState([]);

  const onSelect = (ids, e) => {
    if (selectedIds.indexOf(e.id) > -1) {
      const index = expandedIds.indexOf(e.id);
      if (index > -1) {
        setExpandedIds([
          ...expandedIds.slice(0, index),
          ...expandedIds.slice(index + 1),
        ]);
      } else {
        setExpandedIds([...expandedIds, e.id]);
      }
    } else {
      setSelectedIds([e.id]);
    }
  };
  const handleAdd = (v, e) => {
    setParentNode(v);
    setVisible(true);
    e.stopPropagation();
  };

  const handleNode = list => {
    return list.map((v, i) => {
      return (
        <TreeNode
          id={v.id}
          key={v.id}
          title={<span>{v.name}</span>}
          rightNode={
            selectedIds.indexOf(v.id) > -1 && (
              <span>
                <PlusOutlined
                  className={styles.icon}
                  onClick={e => {
                    handleAdd(v, e);
                  }}
                />
                <FormOutlined className={styles.icon} />
                <DeleteOutlined />
              </span>
            )
          }
        >
          {v.children && v.children.length > 0 && handleNode(v.children)}
        </TreeNode>
      );
    });
  };

  const onOk = () => {
    form.validateFields().then(values => {
      debugger;
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <Tree
          // expandedIds={ expandedIds }
          // selectedIds={ selectedIds }
          onSelect={onSelect}
        >
          {handleNode(props.menuList)}
        </Tree>
      </div>
      <Modal
        visible={visible}
        title={parentNode ? `${parentNode.name}-新增` : '新增菜单'}
        centered
        width={460}
        onOk={onOk}
        onCancel={() => {
          setVisible(false);
          setParentNode(null);
        }}
      >
        <Form form={form}>
          <Form.Item
            name="name"
            label="菜单名称"
            rules={[
              {
                required: true,
                message: '请输入菜单名称',
              },
            ]}
          >
            <Input placeholder="请输入菜单名称" />
          </Form.Item>
          <Form.Item
            name="route"
            label="前端路由"
            rules={[
              {
                required: true,
                message: '请输入前端路由',
              },
            ]}
          >
            <Input placeholder="请输入前端路由" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
});
