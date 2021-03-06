import React from 'react';
import {
  Button,
  Input,
  Table,
  Modal,
  Form,
  message,
  Select,
  Upload,
} from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  MenuOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import arrayMove from 'array-move';
import * as service from './services';
import styles from './index.less';
import Breadcrumbs from '@/components/Breadcrumbs';

const DragHandle = sortableHandle(() => (
  <MenuOutlined title="拖动排序" style={{ cursor: 'pointer', color: '#999' }} />
));
const SortableItem = sortableElement(props => <tr {...props} />);
const SortableContainer = sortableContainer(props => <tbody {...props} />);

class Page extends React.Component {
  state = {
    data: [],
    pageSize: 10,
    pageIndex: 1,
    keyword: null,
    visible: false,
    total: 0,
    currentRecord: null,
    currentImg: null,
    selectedRowKeys: [],
    goodsList: [],
  };
  componentDidMount() {
    this.getData();
    this.getGoodsList();
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
        data: data,
        // pageIndex: data.pageIndex,
        // pageSize: data.pageSize,
        // total: data.total,
      });
    }
  };
  // 点击搜索
  handleSearch = e => {
    const keyword = this.refs.keyword.state.value;
    this.setState(
      {
        keyword,
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
          您确认删除轮播图{' '}
          <span className={styles.roleName}>{record.name}</span> 吗？
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
      message.error('请先选择需要删除的轮播图');
      return false;
    }
    Modal.confirm({
      title: '删除确认',
      centered: true,
      maskClosable: true,
      content: '您确认删除所有所选轮播图吗？',
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
      currentRecord: record,
      currentImg: record && record.url,
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  // 搜索商品
  getGoodsList = async value => {
    const { code, data } = await service.getGoodsList(value);
    if (code == 200) {
      this.setState({
        goodsList: data.data,
      });
    }
  };
  onOk = () => {
    const form = this.refs.form;
    form.validateFields().then(async values => {
      if (!values.url) {
        values.url = this.state.currentImg;
      } else {
        values.url = values.url[0];
      }
      if (this.state.currentRecord) values.id = this.state.currentRecord.id;
      const formData = new FormData();
      for (let key in values) {
        formData.append(key, values[key]);
      }
      const { code, data } = await service[
        this.state.currentRecord ? 'update' : 'add'
      ](formData, values.id);
      if (code == 200) {
        this.getData();
        this.setState({ visible: false });
      }
    });
  };

  onSortEnd = async ({ oldIndex, newIndex }) => {
    const { data } = this.state;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(data), oldIndex, newIndex).filter(
        el => !!el,
      );
      const list = newData.map((v, i) => {
        return {
          id: v.id,
          sort: data[i].sort,
        };
      });
      this.setState({
        data: newData,
      });
      service.sort(list);
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { data } = this.state;
    const index = data.findIndex(v => v.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };

  normFile = ({ file }) => {
    this.setState({
      currentImg: URL.createObjectURL(file),
    });
    return [file];
  };
  beforeUpload = (file, fileList) => {
    return false;
  };
  // 图片校验
  ImgValidator = (rule, value) => {
    if (!value || value.length == 0) {
      if (this.state.currentRecord) {
        return Promise.resolve();
      }
      return Promise.reject('请选择图片');
    }
    const file = value[0];
    const index = file.name.lastIndexOf('.');
    const type = file.name.substr(index + 1);
    if (
      type != 'png' &&
      type != 'PNG' &&
      type != 'jpg' &&
      type != 'JPG' &&
      type != 'jpeg' &&
      type != 'JPEG'
    ) {
      this.setState({
        currentImg: null,
      });
      return Promise.reject('图片只能是jpg或png格式的图片');
    }
    if (file.size > 1024 * 1024 * 5) {
      return Promise.reject('图片大小不能超过5M');
    }
    return Promise.resolve();
  };
  render() {
    const columns = [
      {
        title: '排序',
        dataIndex: 'sort',
        render: () => <DragHandle />,
      },
      {
        title: '序号',
        render: (text, record, index) => {
          return (this.state.pageIndex - 1) * this.state.pageSize + index + 1;
        },
      },
      {
        title: '轮播图',
        dataIndex: 'url',
        render: value => {
          return (
            value && (
              <img
                src={value}
                className={styles.tableImg}
                onClick={() => {
                  window.open(value);
                }}
              />
            )
          );
        },
      },
      {
        title: '轮播图名称',
        dataIndex: 'name',
      },
      {
        title: '关联商品',
        dataIndex: 'goods',
        render: value => {
          return value && value.name;
        },
      },
      {
        title: '创建时间',
        dataIndex: 'created_at',
      },
      {
        title: '最近修改时间',
        dataIndex: 'updated_at',
      },
      {
        title: '操作',
        render: record => {
          return (
            <span className={styles.operation}>
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
    const DraggableContainer = props => (
      <SortableContainer
        useDragHandle
        helperClass={styles.rowDragging}
        onSortEnd={this.onSortEnd}
        {...props}
      />
    );
    return (
      <div className={styles.container}>
        <Breadcrumbs routes={[{ name: '首页轮播图管理' }]} />
        <div className={styles.search}>
          <div className={styles.left}>
            <span>轮播图名称：</span>
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
            components={{
              body: {
                wrapper: DraggableContainer,
                row: this.DraggableBodyRow,
              },
            }}
            pagination={false}
            // pagination={{
            //   current: this.state.pageIndex,
            //   pageSize: this.state.pageSize,
            //   total: this.state.total,
            //   showSizeChanger: true,
            //   showQuickJumper: {
            //     goButton: <Button style={{ marginLeft: '10px' }}>跳转</Button>,
            //   },
            //   onShowSizeChange: (current, size) => {
            //     this.getData({ pageSize: size, pageIndex: 1 });
            //   },
            //   onChange: page => {
            //     this.getData({ pageIndex: page });
            //   },
            // }}
          />
        </div>
        <Modal
          visible={this.state.visible}
          centered
          onCancel={this.hideModal}
          onOk={this.onOk}
          destroyOnClose
          title={
            this.state.currentRecord
              ? `修改轮播图-${this.state.currentRecord.name}`
              : '新增轮播图'
          }
        >
          <Form
            ref="form"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15, offset: 1 }}
            initialValues={{ ...this.state.currentRecord, url: undefined }}
          >
            <Form.Item
              label="轮播图名称"
              name="name"
              rules={[{ required: true, message: '请输入轮播图名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="url"
              label="图片"
              rules={[
                {
                  validator: this.ImgValidator,
                },
              ]}
              valuePropName="fileList"
              getValueFromEvent={this.normFile}
              className={styles.uploadFormItem}
            >
              <Upload
                accept="image/jpg, image/jpeg, image/png"
                beforeUpload={this.beforeUpload}
                showUploadList={false}
                className={styles.uploadBox}
              >
                <div className={styles.fileBox}>
                  {this.state.currentImg ? (
                    <img src={this.state.currentImg} />
                  ) : (
                    <div className={styles.upload}>
                      <PlusOutlined className={styles.uploadIcon} />
                      <span>选择文件</span>
                    </div>
                  )}
                </div>
              </Upload>
            </Form.Item>
            <Form.Item label="关联商品" name="goods_id">
              <Select
                showSearch
                placeholder="请输入商品名称或编号"
                optionFilterProp="children"
                allowClear
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.goodsList.map(v => {
                  return (
                    <Select.Option key={v.id} value={v.id}>
                      {v.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Page;
