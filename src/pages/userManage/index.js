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

class Page extends React.Component {
  state = {
    data: [],
    pageSize: 10,
    pageIndex: 1,
    keyword: null,
    visible: false,
    currentUser: null,
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
          您确认删除用户 <span className={styles.name}>{record.name}</span> 吗？
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
      message.error('请先选择需要删除的用户');
      return false;
    }
    Modal.confirm({
      title: '删除确认',
      centered: true,
      maskClosable: true,
      content: '您确认删除所有所选用户吗？',
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
  render() {
    const columns = [
      {
        title: '头像',
        dataIndex: 'headpic',
        render: value => {
          return <img src={value} className={styles.tableHeadpic} />;
        },
      },
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        render: value => {
          if (value == 1) {
            return '男';
          } else if (value == 2) {
            return '女';
          } else {
            return '未知';
          }
        },
      },
      {
        title: '年龄',
        dataIndex: 'age',
      },
      {
        title: '角色',
        dataIndex: 'role',
        render: value => {
          return value && value.name;
        },
      },
      {
        title: '操作',
        render: record => {
          return (
            <span className={styles.operation}>
              <span
                onClick={() => {
                  this.props.history.push(`/userManage/${record.id}`);
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
          <Breadcrumbs routes={[{ name: '用户管理' }]} />
        </div>
        <div className={styles.search}>
          <div className={styles.left}>
            <span>用户名称：</span>
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
                this.props.history.push(`/userManage/add`);
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
      </div>
    );
  }
}

export default Page;
