import React from 'react';
import { Button, Input, Table, Modal, message } from 'antd';
import { SearchOutlined, DeleteOutlined } from '@ant-design/icons';
import * as service from './services';
import styles from './index.less';
import Breadcrumbs from '@/components/Breadcrumbs';

class Page extends React.Component {
  state = {
    data: [],
    keyword: null,
    selectedRowKeys: [],
  };
  componentDidMount() {
    this.getData();
  }
  // 请求表格数据
  getData = async () => {
    const { data, code } = await service.get(this.state.keyword);
    if (code == 200) {
      this.setState({
        data: data,
      });
    }
  };
  // 点击搜索
  handleSearch = e => {
    const keyword = this.refs.keyword.state.value;
    this.setState({ keyword }, () => {
      this.getData();
    });
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
        dataIndex: 'avatarUrl',
        render: value => {
          return value && <img src={value} className={styles.tableHeadpic} />;
        },
      },
      {
        title: '昵称',
        dataIndex: 'nickName',
      },
      {
        title: '性别',
        dataIndex: 'gender',
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
        title: '所在城市',
        render: record => {
          return record.city ? record.province + '，' + record.city : '';
        },
      },
      {
        title: '最近登录时间',
        dataIndex: 'login_at',
      },
      {
        title: '操作',
        render: record => {
          return (
            <span className={styles.operation}>
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
        <Breadcrumbs routes={[{ name: '微信用户管理' }]} />
        <div className={styles.search}>
          <div className={styles.left}>
            <span>微信昵称：</span>
            <Input className={styles.keyword} ref="keyword" allowClear />
            <Button onClick={this.handleSearch} type="primary">
              <SearchOutlined />
              搜索
            </Button>
          </div>
          <div className={styles.right}>
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
