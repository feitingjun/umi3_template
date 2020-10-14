import React from 'react';
import { Button, Input, Table, Modal, Form, message } from 'antd';
import {
  SearchOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  MenuOutlined,
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
    data: {
      // name: this.props.location.query.name
    },
    pageSize: 10,
    pageIndex: 1,
    keyword: null,
    visible: false,
    total: 0,
    currentRecord: null,
    selectedRowKeys: [],
  };
  componentDidMount() {
    this.getData();
  }
  // 请求表格数据
  getData = async query => {
    query = {
      category_id: this.props.match.params.categoryId,
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
    const keyword = this.keyword.state.value;
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
          您确认删除分类 <span className={styles.roleName}>{record.name}</span>{' '}
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
      message.error('请先选择需要删除的分类');
      return false;
    }
    Modal.confirm({
      title: '删除确认',
      centered: true,
      maskClosable: true,
      content: '您确认删除所有所选分类吗？',
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
    });
  };
  hideModal = () => {
    this.setState({
      visible: false,
    });
  };
  onOk = () => {
    const form = this.form;
    form.validateFields().then(async values => {
      if (this.state.currentRecord) values.id = this.state.currentRecord.id;
      values.category_id = this.props.match.params.categoryId;
      const { code, data } = await service[
        this.state.currentRecord ? 'update' : 'add'
      ](values);
      if (code == 200) {
        this.getData();
        this.setState({ visible: false });
      }
    });
  };

  onSortEnd = async ({ oldIndex, newIndex }) => {
    const { attr_keys } = this.state.data;
    if (oldIndex !== newIndex) {
      const newData = arrayMove([].concat(attr_keys), oldIndex, newIndex).filter(
        el => !!el,
      );
      const list = newData.map((v, i) => {
        return {
          id: v.id,
          sort: attr_keys[i].sort,
        };
      });
      this.setState({
        data: {...this.state.data, attr_keys: newData},
      });
      service.sort(list);
    }
  };

  DraggableBodyRow = ({ className, style, ...restProps }) => {
    const { attr_keys } = this.state.data;
    const index = attr_keys && attr_keys.findIndex(v => v.id === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
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
          return index + 1;
        },
      },
      {
        title: '属性名称',
        dataIndex: 'attr_key_name',
      },
      {
        title: '备注',
        dataIndex: 'remark',
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
                  this.props.history.push(`/category/${this.props.match.params.categoryId}/${record.id}`);
                }}
              >
                预设值
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
        <Breadcrumbs routes={[{ name: '商品分类', path: '/category' }, { name: this.state.data.name }]} />
        
        <div className={styles.search}>
          <div className={styles.left}>
            <span>属性名称：</span>
            <Input className={styles.keyword} ref={node => this.keyword = node} allowClear />
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
            dataSource={this.state.data.attr_keys}
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
              ? `修改属性-${this.state.currentRecord.attr_key_name}`
              : '新增属性'
          }
        >
          <Form
            ref={node => this.form = node}
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 15, offset: 1 }}
            initialValues={this.state.currentRecord}
          >
            <Form.Item
              label="属性名称"
              name="attr_key_name"
              rules={[{ required: true, message: '请输入属性名称' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="备注" name="remark">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Page;