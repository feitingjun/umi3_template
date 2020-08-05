import React from 'react';
import { Button, Input, Table, Modal, Form, message } from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import * as service from './services';
import styles from './index.less';
import Breadcrumbs from '@/components/Breadcrumbs';
import AuthModal from './authModal';

class Page extends React.Component {
  state = {
    data: [],
    pageSize: 10,
    pageIndex: 1,
    keyword: null,
    visible: false,
    currentRole: null,
    total: 0,
    selectedRowKeys: [],
    authRecord: null,
    authVisible: false,
  };
  componentDidMount() {
    this.getData();
  }
  // 请求表格数据
  getData = async query => {
    query = {
      keyword: this.state.keyword,
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex,
      ...query,
    };
    const { data, code } = await service.get(query);
    if (code == 200) {
      this.setState({
        data: data.data,
        pageIndex: data.pageIndex,
        pageSize: data.pageSize,
        total: data.total,
      });
    }
  };
  // 点击搜索
  handleSearch = e => {
    const keyword = this.refs.keyword.state.value;
    this.getData({ pageIndex: 0, keyword });
  };
  // 单条删除
  handleDel = record => {
    Modal.confirm({
      title: '删除确认',
      centered: true,
      maskClosable: true,
      content: (
        <span>
          您确认删除角色 <span className={styles.roleName}>{record.name}</span>{' '}
          吗？
        </span>
      ),
      onOk: async () => {
        const { code } = await service.del(record.id);
        if (code == 200) {
          message.success('删除成功');
          this.getData();
        }
      },
    });
  };
  // 批量删除
  removes = () => {
    if (this.state.selectedRowKeys.length == 0) {
      message.error('请先选择需要删除的角色');
      return false;
    }
    Modal.confirm({
      title: '删除确认',
      centered: true,
      maskClosable: true,
      content: '您确认删除所有所选角色吗？',
      onOk: async () => {
        const { code } = await service.removes(this.state.selectedRowKeys);
        if (code == 200) {
          message.success('删除成功'), this.getData();
          this.setState({ selectedRowKeys: [] });
        }
      },
    });
  };
  // 选中项变化
  rowSelectionChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };
  showModal = record => {
    this.setState({
      visible: true,
      currentRole: record,
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  onOk = () => {
    const form = this.refs.form;
    form.validateFields().then(async values => {
      if (this.state.currentRole) values.id = this.state.currentRole.id;
      const { code, data } = await service[
        this.state.currentRole ? 'update' : 'add'
      ](values);
      if (code == 200) {
        this.getData();
        this.setState({ visible: false });
      }
    });
  };
  render() {
    const columns = [
      {
        title: '角色名称',
        dataIndex: 'name',
      },
      {
        title: '权限',
        dataIndex: 'auth',
        render: record => {
          return record && record.map(v => v.name).join('，');
        },
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: record => {
          return (
            <span className={styles.operation}>
              <span
                onClick={() => {
                  this.setState({ authRecord: record, authVisible: true });
                }}
              >
                分配权限
              </span>
              <span
                onClick={() => {
                  this.showModal(record);
                }}
              >
                编辑
              </span>
              <span
                className={styles.delete}
                onClick={() => {
                  this.handleDel(record);
                }}
              >
                删除
              </span>
            </span>
          );
        },
      },
    ];
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Breadcrumbs routes={[{ name: '角色管理' }]} />
        </div>
        <div className={styles.search}>
          <div className={styles.left}>
            <span>角色名称：</span>
            <Input className={styles.keyword} ref="keyword" allowClear />
            <Button onClick={this.handleSearch} type="primary">
              <SearchOutlined />
              搜索
            </Button>
          </div>
          <div className={styles.right}>
            <Button
              type="primary"
              onClick={() => {
                this.showModal(null);
              }}
            >
              <PlusCircleOutlined />
              新增
            </Button>
            <Button type="primary" danger onClick={this.removes}>
              <DeleteOutlined />
              删除
            </Button>
          </div>
        </div>
        <div className={styles.tableBox}>
          <Table
            rowKey={record => record.id}
            columns={columns}
            dataSource={this.state.data}
            rowSelection={{
              preserveSelectedRowKeys: false,
              selectedRowKeys: this.state.selectedRowKeys,
              onChange: this.rowSelectionChange,
            }}
          />
        </div>
        <Modal
          visible={this.state.visible}
          centered
          onCancel={this.hideModal}
          onOk={this.onOk}
          destroyOnClose
          title={
            this.state.currentRole
              ? `修改角色-${this.state.currentRole.name}`
              : '新增角色'
          }
        >
          <Form
            ref="form"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15, offset: 1 }}
            initialValues={this.state.currentRole}
          >
            <Form.Item
              label="角色名称"
              name="name"
              rules={[{ required: true, message: '请输入角色名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="备注" name="remark">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
        <AuthModal
          visible={this.state.authVisible}
          record={this.state.authRecord}
          onCancel={() => {
            this.setState({ authVisible: false });
          }}
          getData={this.getData}
        />
      </div>
    );
  }
}

export default Page;
