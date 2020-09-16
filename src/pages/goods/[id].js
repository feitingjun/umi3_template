import React from 'react';
import { history } from 'umi';
import E from '@/utils/wangEditor';
import * as service from './services';
import { Form, message, Upload, Input, InputNumber, Button, Row, Col, Select, Checkbox } from 'antd';
import styles from './index.less';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PlusOutlined, UploadOutlined, PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

class Page extends React.Component {

  state = {
    thumb: null,
    detail: {},
    type: null,
    category: [],
    propertyList: [new Date().getTime()],
    banner: [],
    uploadBanner: []
  }
  componentDidMount() {
    if(this.props.match.params.id !== 'add'){
      this.getDetail();
    }else{
      this.setState({
        type: 'add'
      })
    }
    this.initEditor()
    this.getCategory();
  }
  componentWillUnmount(){
    if(this.state.uploadBanner.length>0){
      service.delFile(this.state.uploadBanner);
    }
  }
  initEditor = () => {
    const elem = this.refs.editorElem
    const editor = new E(elem)
 
    this.editor = editor
 
    editor.customConfig.zIndex = 100
    // 限制一次最多上传 1 张图片
    editor.customConfig.uploadImgMaxLength = 1
    // 隐藏“网络图片”tab
    editor.customConfig.showLinkImg = false
    editor.customConfig.customUploadImg = async (files, insert) => {
      if (files[0]) {
        const { code, data } = await service.upload(files[0]);
        if(code == 200){
          insert(data.file)
        }
      } else {
        message.info('请选择要上传的图片')
      }
    }
    editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      // 'quote', // 引用
      // 'emoticon', // 表情
      'image', // 插入图片
      // 'table', // 表格
      // 'video', // 插入视频
      // 'code', // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    editor.create()
  }
  // 获取商品信息
  getDetail = async () => {
    const { code, data } = await service.getDetail(this.props.match.params.id);
    if(code == 200){
      this.setState({
        thumb: data.thumb,
        type: 'edit'
      })
      delete data.thumb;
      const property = JSON.parse(data.property);
      const propertyList = [];
      const obj = {};
      property.map((v,i) => {
        propertyList.push(i);
        obj[`property_name_${i}`] = v.name;
        obj[`property_value_${i}`] = v.value;
      })
      this.setState({
        banner: data.banner ? data.banner.split(',').map((v, i) => ({
          uid: -i,
          url: v,
          status: 'done',
          name: v.substr(v.lastIndexOf('/' || '\\') +1)
        })) : [],
        propertyList
      })
      this.editor.txt.html(data.detail);
      this.refs.form.setFieldsValue({ 
        ...data, 
        recommend: data.recommend == 1,
        ...obj
      });
    }
  }
  // 获取商品分类
  getCategory = async () => {
    const { code, data } = await service.getCategory();
    if(code == 200){
      this.setState({
        category: data
      })
    }
  }
  
  normFile = ({ file }) => {
    this.setState({
      thumb: URL.createObjectURL(file)
    })
    return [file];
  };
  normFile1 = e => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  beforeUpload = (file, fileList) => {
    return false;
  }
  // 缩略图校验
  thumbValidator = (rule, value) => {
    if(!value || value.length==0){
      if(this.props.match.params.id !== 'add'){
        return Promise.resolve();
      }
      return Promise.reject('请选择商品缩略图');
    }
    const file = value[0]
    const index = file.name.lastIndexOf('.');
    const type = file.name.substr(index + 1);
    if(type != 'png' && type != 'PNG' && type !='jpg' && type != 'JPG' && type != 'jpeg' && type != 'JPEG'){
      this.setState({
        thumb: null
      })
      return Promise.reject('图片只能是jpg或png格式的图片');
    }
    if(file.size > 1024 * 1024 * 5){
      return Promise.reject('图片大小不能超过5M');
    }
    return Promise.resolve();
  }
  // 提价数据
  submit = async values => {
    if(this.state.type !== 'add' && !values.thumb){
      values.thumb = this.state.thumb
    }else{
      values.thumb = values.thumb[0];
    }
    const property = [];
    this.state.propertyList.map(v => {
      if(values[`property_name_${v}`] || values[`property_value_${v}`]){
        property.push({
          name: values[`property_name_${v}`],
          value: values[`property_value_${v}`]
        })
      }
      delete values[`property_name_${v}`];
      delete values[`property_value_${v}`]
    })
    values.property = JSON.stringify(property);
    values.banner = this.state.banner.map(v => v.url).join(',');
    values.detail = this.editor.txt.html();
    values.recommend = values.recommend ? 1 : 0;
    const formData = new FormData();
    for(let key in values){
      formData.append(key, values[key]);
    }
    if(this.state.type === 'add'){
      const { code } = await service.add(formData);
      if(code == 200){
        message.success('新增成功');
        this.refs.form.resetFields();
        this.editor.txt.html('');
        this.setState({
          thumb: null,
          banner: [],
          uploadBanner: this.state.uploadBanner.filter(v => values.banner.indexOf(v) == -1),
          propertyList: [new Date().getTime()]
        })
      }
    }else{
      const { code } = await service.update( this.props.match.params.id, formData);
      if(code == 200){
        message.success('修改成功');
        this.setState({
          uploadBanner: this.state.uploadBanner.filter(v => values.banner.indexOf(v) == -1)
        },() => {
          this.props.history.goBack();
        })
      }
    }
  }
  // 上传轮播图文件
  uploadFile = e => {
    const length = this.state.banner.length;
    this.setState({
      banner: [...this.state.banner, { 
        uid: new Date().getTime(),
        name: e.file.name,
        status: 'uploading',
        url: URL.createObjectURL(e.file)
      }]
    }, async () => {
      const { code, data } = await service.upload(e.file).catch(err => { 
        this.setState({ banner: [...this.state.banner.slice(0, this.state.banner.length-1)] })
      });
      if(code == 200){
        const banner = [...this.state.banner];
        banner[length].status = 'done';
        banner[length].url = data.file;
        this.setState({ 
          banner,
          uploadBanner: [...this.state.uploadBanner, data.file]
        })
      }else{
        this.setState({ banner: [...this.state.banner.slice(0, this.state.banner.length-1)] })
      }
    })
  }
  // 删除文件
  onRemove = async file => {
    // 删除服务器上的文件
    if(file.status === 'done'){
      service.delFile([file.url]);
    }
    this.setState({
      banner: this.state.banner.filter(v => v.uid != file.uid)
    })
  }
  render() {
    const id = this.props.match.params.id;
    return (
      <div className={styles.container}>
        <Breadcrumbs routes={[{ name: '商品管理', path: '/goods' }, { name: id == 'add' ? '新增商品' : '修改商品' }]} />
        <Form 
          ref='form'
          className={styles.form}
          onFinish={this.submit}
          initialValues={{ sex: 0 }}
          validateTrigger='onBlur'
          layout='vertical'
        >
          <div className={styles.row}>
            <div>
              <Form.Item
                name='name'
                label='商品名称'
                rules={[{ required: true, message: '请输入商品名称' }]}
              >
                <Input autoComplete='off' />
              </Form.Item>
              <Form.Item
                name='category_id'
                label='所属分类'
                rules={[{ required: true, message: '请选择分类' }]}
              >
                <Select>{this.state.category.map(v => <Option key={v.id}>{v.name}</Option>)}</Select>
              </Form.Item>
              <Form.Item
                name='price'
                label='价格'
                rules={[{ required: true, message: '请输入价格' }]}
              >
                <InputNumber min={0} precision='2' autoComplete='off' />
              </Form.Item>
              <Form.Item
                name='original_price'
                label='原价'
              >
                <InputNumber min={0} precision='2' autoComplete='off' />
              </Form.Item>
              <Form.Item
                name='sales'
                label='销量'
              >
                <InputNumber min={0} autoComplete='off' />
              </Form.Item>
              <div>
                <div className={styles.label}>商品属性</div>
                <div>{this.state.propertyList.map((v, i) => (
                  <Row key={v} className={styles.property}>
                   <div>
                    <Form.Item
                        name={`property_name_${v}`}
                      >
                        <Input placeholder='属性名' />
                      </Form.Item>
                   </div>
                    <div>
                      <Form.Item
                        name={`property_value_${v}`}
                      >
                        <Input placeholder='属性值' />
                      </Form.Item>
                    </div>
                    <div>
                      <PlusCircleOutlined onClick={() => {
                        this.setState({
                          propertyList: [...this.state.propertyList.slice(0, i+1), new Date().getTime(), ...this.state.propertyList.slice(i+1)]
                        })
                      }} className={styles.addItem} />
                      {this.state.propertyList.length>1 && <MinusCircleOutlined onClick={() => {
                        this.setState({
                          propertyList: [...this.state.propertyList.slice(0, i), ...this.state.propertyList.slice(i+1)]
                        })
                      }} className={styles.delItem} />}
                    </div>
                  </Row>
                ))}</div>
              </div>
              <Form.Item
                name='recommend'
                valuePropName='checked'
                noStyle
              >
                <Checkbox>是否首页推荐</Checkbox>
              </Form.Item>
            </div>
            <div>
              <Form.Item 
                name='thumb'
                label='缩略图'
                rules={[{
                  validator: this.thumbValidator
                }]}
                valuePropName='fileList'
                getValueFromEvent={this.normFile}
                className={styles.uploadFormItem}
              >
                  <Upload
                    accept='image/jpg, image/jpeg, image/png'
                    beforeUpload={this.beforeUpload}
                    showUploadList={false}
                    className={styles.uploadBox}
                  >
                    <div className={styles.fileBox}>{
                      this.state.thumb ? 
                      <img src={this.state.thumb} />
                      :
                      <div className={styles.upload}>
                        <PlusOutlined className={styles.uploadIcon} />
                        <span>选择文件</span>
                        <span className={styles.suggest}>（ 建议尺寸 1 : 1 ）</span>
                      </div>

                    }</div>
                  </Upload>
              </Form.Item>
              
              <div>
                <div className={styles.label}>商品轮播图</div>
                <div>
                  <Upload
                    customRequest={this.uploadFile}
                    listType='picture'
                    fileList={this.state.banner}
                    onRemove={this.onRemove}
                    multiple
                  >
                    <Button icon={<UploadOutlined />}>上传轮播图片</Button>
                  </Upload>
                </div>
              </div>
            </div> 
            <div>
              <div ref='editorElem' className={styles.editorElem} />
            </div>
          </div>
          <div className={styles.btns}>
            <Button size='large' type='primary' htmlType='submit'>确认</Button>
            <Button size='large' onClick={() => { this.props.history.goBack() }}>返回</Button>
          </div>
        </Form>
      </div>
    )
  }
}

// 是否需要权限验证，有这一行表示当前路由需要做权限验证
Page.wrappers = ['@/wrappers/auth/index']

// 如果当前路由没有配置权限，可以用auth指定的路由做当前路由的权限验证
Page.auth = '/goods'

export default Page;
