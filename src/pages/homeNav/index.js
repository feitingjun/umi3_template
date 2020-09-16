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
    navDataList: [],
  };
  componentDidMount() {
    this.getData();
    this.getNavDataList();
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
          您确认删除导航菜单{' '}
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
      message.error('请先选择需要删除的导航菜单');
      return false;
    }
    Modal.confirm({
      title: '删除确认',
      centered: true,
      maskClosable: true,
      content: '您确认删除所有所选导航菜单吗？',
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
      currentImg: record && record.icon,
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  // 搜索商品
  getNavDataList = async value => {
    const { code, data } = await service.getNavDataList(value);
    if (code == 200) {
      this.setState({
        navDataList: data,
      });
    }
  };
  onOk = () => {
    const form = this.refs.form;
    form.validateFields().then(async values => {
      if (!values.icon) {
        values.icon = this.state.currentImg;
      } else {
        values.icon = values.icon[0];
      }
      const pageData = this.state.navDataList.find(v => v.id == values.page);
      if (pageData) {
        values.page = pageData.page;
        values.page_name = pageData.name;
        values.param = pageData.param;
      } else {
        values.page = null;
        values.page_name = null;
        values.param = null;
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
        title: '导航菜单图标',
        dataIndex: 'icon',
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
        title: '导航菜单名称',
        dataIndex: 'name',
      },
      {
        title: '页面',
        dataIndex: 'page_name',
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
    const currentPage =
      this.state.currentRecord &&
      this.state.navDataList.find(v => v.page == this.state.currentRecord.page);
    return (
      <div className={styles.container}>
        <Breadcrumbs routes={[{ name: '首页导航菜单管理' }]} />
        <div className={styles.search}>
          <div className={styles.left}>
            <span>导航菜单名称：</span>
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
              ? `修改导航菜单-${this.state.currentRecord.name}`
              : '新增导航菜单'
          }
        >
          <Form
            ref="form"
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15, offset: 1 }}
            initialValues={{
              ...this.state.currentRecord,
              icon: undefined,
              page: currentPage ? currentPage.id : '',
            }}
          >
            <Form.Item
              label="导航菜单名称"
              name="name"
              rules={[{ required: true, message: '请输入导航菜单名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="icon"
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
            <Form.Item label="页面" name="page">
              <Select
                showSearch
                allowClear
                placeholder="请输入页面名称"
                optionFilterProp="children"
                rules={[{ required: true, message: '请选择关联页面' }]}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.navDataList.map(v => {
                  return (
                    <Select.Option key={v.id} value={v.id} data={v}>
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
