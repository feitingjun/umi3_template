import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, message, Button } from 'antd';
import * as service from './services';
import { connect } from 'dva';
import Tree, { TreeNode } from '@/components/tree';
import { FormOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import Breadcrumbs from '@/components/Breadcrumbs';
import styles from './index.less';

export default connect()(props => {
  const [form] = Form.useForm();
  const [selectNode, setSelectNode] = useState(null);
  const [menuList, setMenuList] = useState([]);
  // selectedIds选中的节点
  const [selectedIds, setSelectedIds] = useState([]);

  const getMenuList = async () => {
    const { data, code } = await service.get();
    if (code == 200) setMenuList(data);
  };
  useEffect(() => {
    getMenuList();
  }, []);

  // 节点选中时函数
  const onSelect = (ids, e) => {
    setSelectedIds([e.id]);
  };

  // 点击节点的新增按钮
  const clickAdd = (v, e) => {
    setSelectNode({ pid: v.id, pname: v.name });
    form.resetFields();
    e.stopPropagation();
  };
  // 新增菜单
  const addMenu = async values => {
    const { code } = await service.add({ ...values, pid: selectNode.pid });
    if (code == 200) {
      props.dispatch({ type: 'user/info' });
      getMenuList();
      message.success('新增成功');
      form.resetFields();
    }
  };
  // 更新菜单
  const updateMenu = async (id, values) => {
    const { code, data } = await service.update(id, values);
    if (code == 200) {
      props.dispatch({ type: 'user/info' });
      getMenuList();
      setSelectNode(data);
      message.success('更新成功');
    }
  };
  // 点击确认
  const onOk = () => {
    form.validateFields().then(async values => {
      if (selectNode.pname) {
        addMenu(values);
      } else {
        updateMenu(selectNode.id, values);
      }
    });
  };
  // 删除菜单
  const delMenu = (v, e) => {
    e.stopPropagation();
    Modal.confirm({
      title: '系统消息',
      content: '您确认删除这个菜单吗？',
      centered: true,
      onOk: async () => {
        const { code } = await service.del(v.id);
        if (code == 200) {
          props.dispatch({ type: 'user/info' });
          message.success('删除成功');
          getMenuList();
          if (
            selectNode &&
            (v.id === selectNode.id ||
              (selectNode.pname && selectNode.pid === v.id))
          ) {
            setSelectNode(null);
          }
        }
      },
    });
  };
  // 排序
  const onDrop = async (id, target) => {
    const { code, data } = await service.sort({ id, target });
    if (code == 200) {
      setMenuList(data);
      props.dispatch({ type: 'user/info' });
    }
  };
  // 根据数据生成节点
  const handleNode = list => {
    return list.map((v, i) => {
      const rightNode = (
        <span>
          {v.id != 1 && (
            <PlusOutlined
              className={styles.icon}
              onClick={e => {
                clickAdd(v, e);
              }}
            />
          )}
          <FormOutlined
            className={styles.icon}
            onClick={e => {
              setSelectNode(v);
              form.setFieldsValue(v);
              e.stopPropagation();
            }}
          />
          {v.id != 1 && (
            <DeleteOutlined
              onClick={e => {
                delMenu(v, e);
              }}
            />
          )}
        </span>
      );
      return (
        <TreeNode
          id={v.id}
          key={v.id}
          title={<span>{v.name}</span>}
          rightNode={selectedIds.indexOf(v.id) > -1 && rightNode}
        >
          {v.children && v.children.length > 0 && handleNode(v.children)}
        </TreeNode>
      );
    });
  };
  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Breadcrumbs routes={[{ name: '菜单管理' }]} />
      </div>
      <div className={styles.left}>
        <Button
          className={styles.addRoot}
          onClick={e => {
            setSelectNode({ pid: 0, pname: '一级菜单' });
            form.resetFields();
          }}
          type="primary"
        >
          新增
        </Button>
        <div>
          <Tree
            onSelect={onSelect}
            onDrop={onDrop}
            // selectedIds={ selectedIds }
          >
            {handleNode(menuList)}
          </Tree>
        </div>
      </div>
      {selectNode && (
        <div className={styles.right}>
          <div className={styles.detailsName}>
            {selectNode.pname
              ? `${selectNode.pname}--新增`
              : `${selectNode.name}--修改`}
          </div>
          <Form className={styles.form} form={form} layout="vertical">
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
              <Input
                disabled={selectNode.id == 1}
                placeholder="请输入前端路由"
              />
            </Form.Item>
            <Form.Item name="icon" label="图标">
              <Input placeholder="请输入图标" />
            </Form.Item>
          </Form>
          <div className={styles.btns}>
            <Button size="large" type="primary" onClick={onOk}>
              确定
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});
