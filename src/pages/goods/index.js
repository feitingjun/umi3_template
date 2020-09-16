import React from 'react';
import { Button, Input, Table, Modal, message, Select, Form } from 'antd';
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
    total: 0,
    selectedRowKeys: [],
    category: [],
  };
  componentDidMount() {
    this.getData();
    this.getCategory();
  }
  getCategory = async () => {
    const { code, data } = await service.getCategory();
    if (code == 200) {
      this.setState({
        category: data,
      });
    }
  };
  // 请求表格数据
  getData = async query => {
    query = {
      keyword: this.state.keyword,
      pageSize: this.state.pageSize,
      pageIndex: this.state.pageIndex,
      category_id: this.state.category_id,
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
  handleSearch = values => {
    this.setState(
      {
        ...values,
      },
      () => {
        this.getData({ pageIndex: 0 });
      },
    );
  };
  // 单条删除
  handleDel = record => {
    Modal.confirm({
      title: '删除确认',
      centered: true,
      maskClosable: true,
      content: (
        <span>
          您确认删除商品 <span className={styles.name}>{record.name}</span> 吗？
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
      message.error('请先选择需要删除的商品');
      return false;
    }
    Modal.confirm({
      title: '删除确认',
      centered: true,
      maskClosable: true,
      content: '您确认删除所有所选商品吗？',
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
        title: '序号',
        render: (text, record, index) => {
          return (this.state.pageIndex - 1) * this.state.pageSize + index + 1;
        },
      },
      {
        title: '缩略图',
        dataIndex: 'thumb',
        render: value => {
          return (
            value && (
              <img
                src={value}
                className={styles.tableThumb}
                onClick={() => {
                  window.open(value);
                }}
              />
            )
          );
        },
      },
      {
        title: '商品编号',
        dataIndex: 'code',
      },
      {
        title: '商品名称',
        dataIndex: 'name',
      },
      {
        title: '所属分类',
        dataIndex: 'category',
        render: value => {
          return value && value.name;
        },
      },
      {
        title: '价格',
        dataIndex: 'price',
      },
      {
        title: '原价',
        dataIndex: 'original_price',
      },
      {
        title: '是否首页推荐',
        dataIndex: 'recommend',
        render: text => {
          return text == 1 ? '是' : '否';
        },
      },
      {
        title: '轮播图',
        dataIndex: 'banner',
        render: value => {
          return (
            value &&
            value.split(',').map((v, i) => {
              return (
                <img
                  src={v}
                  key={i}
                  className={styles.tableBanner}
                  onClick={() => {
                    window.open(v);
                  }}
                />
              );
            })
          );
        },
      },
      {
        title: '操作',
        render: record => {
          return (
            <span className={styles.operation}>
              <span
                onClick={() => {
                  this.props.history.push(`/goods/${record.id}`);
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
        <Breadcrumbs routes={[{ name: '商品管理' }]} />
        <div className={styles.search}>
          <Form
            className={styles.left}
            layout="inline"
            onFinish={this.handleSearch}
          >
            <Form.Item name="keyword" label="商品名称或编号">
              <Input allowClear />
            </Form.Item>
            <Form.Item name="category_id" label="商品分类">
              <Select style={{ width: '200px' }} allowClear>
                {this.state.category.map(v => {
                  return (
                    <Select.Option key={v.id} value={v.id}>
                      {v.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              <SearchOutlined />
              搜索
            </Button>
          </Form>
          <div className={styles.right}>
            <Button
              type="primary"
              onClick={() => {
                this.props.history.push(`/goods/add`);
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
            pagination={{
              current: this.state.pageIndex,
              pageSize: this.state.pageSize,
              total: this.state.total,
              showSizeChanger: true,
              showQuickJumper: {
                goButton: <Button style={{ marginLeft: '10px' }}>跳转</Button>,
              },
              onShowSizeChange: (current, size) => {
                this.getData({ pageSize: size, pageIndex: 1 });
              },
              onChange: page => {
                this.getData({ pageIndex: page });
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default Page;
