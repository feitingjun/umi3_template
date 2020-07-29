import React from 'react';
import { connect } from 'dva';
import { history } from 'umi';
import { Form, Input, Icon, Checkbox, Button } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import styles from './index.less';

const FormItem = Form.Item;

class Page extends React.Component {
  formRef = React.createRef();
  state = {};
  componentWillMount() {
    localStorage.removeItem('_t');
  }
  componentDidMount() {
    this.props.dispatch({
      type: 'user/save',
    });

    const userInfo =
      (localStorage.getItem('_r') && JSON.parse(localStorage.getItem('_r'))) ||
      {};
    this.formRef.current.setFieldsValue(userInfo);
  }
  handleSubmit = () => {
    this.formRef.current.validateFields().then(values => {
      this.props
        .dispatch({
          type: 'user/login',
          payload: {
            username: values.username,
            password: values.password,
          },
        })
        .then(data => {
          if (data) {
            if (values.remember) {
              localStorage.setItem('_r', JSON.stringify(values));
            } else {
              localStorage.setItem('_r', null);
            }
            history.push({ pathname: '/' });
          }
        });
    });
  };
  render() {
    return (
      <div className={styles.login}>
        <div className={styles.content}>
          <div className={styles.title}>后台系统</div>
          <Form
            ref={this.formRef}
            className={styles.form}
            onFinish={this.handleSubmit}
          >
            <FormItem
              name="username"
              rules={[
                {
                  required: true,
                  message: '请输入用户名',
                },
                {
                  pattern: /^[a-zA-Z]{1}([a-zA-Z0-9]|[._]){4,19}$/,
                  message: '用户名格式错误',
                },
              ]}
            >
              <Input
                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="用户名"
              />
            </FormItem>
            <FormItem
              name="password"
              rules={[
                {
                  required: true,
                  message: '请输入密码',
                },
                {
                  // pattern: /^(\w){6,20}$/, message: '密码格式不正确'
                },
              ]}
            >
              <Input
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                type="password"
                placeholder="密码"
              />
            </FormItem>
            <FormItem name="remember" valuePropName="checked">
              <Checkbox>记住密码</Checkbox>
            </FormItem>
            <Button
              size="large"
              className={styles.btn}
              type="primary"
              htmlType="submit"
            >
              登录
            </Button>
          </Form>
        </div>
      </div>
    );
  }
}
export default connect()(Page);
