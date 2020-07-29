import React from 'react';
import styles from './index.less';

class Page extends React.Component {

  state = {

  }
  render() {
    return <div className={ styles.container }>
      444444444
        </div>
  }
}

// 是否需要权限验证，有这一行表示当前路由需要做权限验证
Page.wrappers = ['@/wrappers/auth/index']

// 如果当前路由没有配置权限，可以用auth指定的路由做当前路由的权限验证
Page.auth = '/userManage'

// 面包屑名称
Page.bname = 'bnamefield === "add" ? "新增用户" : "修改用户"'
// bnamefield存在时bname可使用三元运算，bnamefield的值为路由参数名
Page.bnamefield = 'id'

export default Page;
