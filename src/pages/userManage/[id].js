import React from 'react';
import { history } from 'umi';
import * as service from './services';
import { Form, message, Upload, Input, InputNumber, Button, Row, Col, Select } from 'antd';
import styles from './index.less';
import Breadcrumbs from '@/components/Breadcrumbs';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

class Page extends React.Component {

  state = {
    headpic: null,
    detail: {},
    type: null,
    roleList: []
  }
  componentDidMount() {
    if(this.props.match.params.id !== 'add'){
      this.getDetail();
    }else{
      this.setState({
        type: 'add'
      })
    }
    this.getRole();
  }
  // 获取用户信息
  getDetail = async () => {
    const { code, data } = await service.getDetail(this.props.match.params.id);
    if(code == 200){
      this.setState({
        detail: data,
        headpic: data.headpic,
        type: 'edit'
      })
      delete data.headpic;
      this.refs.form.setFieldsValue(data);
    }
  }
  // 获取角色
  getRole = async () => {
    const { code, data } = await service.getRole();
    if(code == 200){
      this.setState({
        roleList: data.data
      })
    }
  }
  
  normFile = ({ file }) => {
    this.setState({
      headpic: URL.createObjectURL(file)
    })
    return [file];
  };
  beforeUpload = (file, fileList) => {
    return false;
  }
  // 头像校验
  headpicValidator = (rule, value) => {
    if(!value || value.length==0){
      if(this.props.match.params.id !== 'add'){
        return Promise.resolve();
      }
      return Promise.reject('请选择头像');
    }
    const file = value[0]
    const index = file.name.lastIndexOf('.');
    const type = file.name.substr(index + 1);
    if(type != 'png' && type != 'PNG' && type !='jpg' && type != 'JPG' && type != 'jpeg' && type != 'JPEG'){
      this.setState({
        headpic: null
      })
      return Promise.reject('头像只能是jpg或png格式的图片');
    }
    if(file.size > 1024 * 1024 * 2){
      return Promise.reject('图片大小不能超过2M');
    }
    return Promise.resolve();
  }
  submit = async values => {
    if(this.state.type !== 'add' && !values.headpic){
      values.headpic = this.state.headpic
    }else{
      values.headpic = values.headpic[0];
    }
    if(this.state.type !== 'add' && !values.password){
      delete values.password;
    }
    const formData = new FormData();
    for(let key in values){
      formData.append(key, values[key]);
    }
    if(this.state.type === 'add'){
      const { code } = await service.add(formData);
      if(code == 200){
        message.success('新增成功');
        this.refs.form.resetFields();
        this.setState({
          headpic: null
        })
      }
    }else{
      const { code } = await service.update( this.props.match.params.id, formData);
      if(code == 200){
        message.success('修改成功');
        this.props.history.goBack();
      }
    }
  }
  render() {
    const id = this.props.match.params.id;
    return (
      <div className={styles.container}>
        <Breadcrumbs routes={[{ name: '用户管理', path: '/userManage' }, { name: id == 'add' ? '新增用户' : '修改用户' }]} />
        <Form 
          ref='form'
          className={styles.form}
          onFinish={this.submit}
          initialValues={{ sex: 0 }}
          validateTrigger='onBlur'
          layout='vertical'
        >
          <Row>
            <Col span={9}>
              <Form.Item
                name='username'
                label='用户名'
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input autoComplete='off' />
              </Form.Item>
              <Form.Item
                name='password'
                label='密码'
                rules={[{ required: this.state.type == 'add', message: '请输入密码' }]}
              >
                <Input.Password autoComplete='new-password' />
              </Form.Item>
              <Form.Item
                name='role_id'
                label='角色'
              >
                <Select>{this.state.roleList.map(v => <Option key={v.id}>{v.name}</Option>)}</Select>
              </Form.Item>
              <Form.Item
                name='email'
                label='邮箱'
                rules={[{ type: 'email', message: '邮箱格式不正确' }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name='sex'
                label='性别'
              >
                <Select>
                  <Option value={0}>未知</Option>
                  <Option value={1}>男</Option>
                  <Option value={2}>女</Option>
                </Select>
              </Form.Item>
              <Form.Item
                name='age'
                label='年龄'
              >
                <InputNumber precision={0} min={0} />
              </Form.Item>
            </Col>
            <Col span={8} offset={2}>
              <Form.Item 
                name='headpic' 
                rules={[{
                  validator: this.headpicValidator
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
                      this.state.headpic ? 
                      <img src={this.state.headpic} />
                      :
                      <div className={styles.upload}>
                        <PlusOutlined className={styles.uploadIcon} />
                        <span>选择文件</span>
                      </div>

                    }</div>
                    <div className={styles.headpicText}>
                      <Button><UploadOutlined /> 选择头像</Button>
                    </div>
                  </Upload>
              </Form.Item>
            </Col>
          </Row>
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
Page.auth = '/userManage'

export default Page;
