import React, { useState, useEffect } from 'react';
import { Modal, Tree, message } from 'antd';
import * as service from './services';

const { TreeNode } = Tree;

export default props => {
  const [checkedKeys, setCheckedKeys] = useState([]);
  const [menus, setMenus] = useState([]);

  // 请求菜单数据
  const getMenus = async () => {
    const { code, data } = await service.getMenu();
    if (code == 200) {
      setMenus(data);
    }
  };
  useEffect(() => {
    getMenus();
  }, []);
  useEffect(() => {
    if (props.record)
      setCheckedKeys(props.record.auth ? props.record.auth.map(v => v.id) : []);
  }, [props.visible]);

  const treeData = list => {
    list.map(v => {
      v.title = v.name;
      v.key = v.id;
      if (v.children && v.children.length > 0) {
        treeData(v.children);
      }
    });
    return list;
  };
  const onCancel = () => {
    props.onCancel();
  };
  const onOk = async () => {
    const { code } = await service.update({
      id: props.record.id,
      auth: checkedKeys.join(','),
    });
    if (code == 200) {
      onCancel();
      message.success('分配权限成功');
      props.getData();
    }
  };
  const onCheck = (checkedKeys, e) => {
    setCheckedKeys(checkedKeys.checked);
  };

  const record = props.record || {};
  return (
    <Modal
      title={`分配权限-${record.name}`}
      centered
      destroyOnClose
      visible={props.visible}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Tree
        key={record.id}
        checkable
        checkStrictly
        checkedKeys={checkedKeys}
        onCheck={onCheck}
        treeData={treeData(menus)}
      />
    </Modal>
  );
};
