import { history } from 'umi';
import React from 'react';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import page404 from './pages/404.js';
export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

//用于运行时修改路由。和 render 配合使用，请求服务端根据响应动态更新路由
export function patchRoutes({ routes }) {
  routes[0].routes.push({
    component: page404,
  });
}
// 用于改写把整个应用 render 到 dom 树里的方法。
export async function render(oldRender) {
  const token = localStorage.getItem('_t');
  if (token) {
    oldRender();
  } else {
    history.push('/login');
    oldRender();
  }
  // 可以在这儿根据token请求初始用户数据

  const theme = localStorage.getItem('theme') || 'theme1';
  let head = document.getElementsByTagName('head')[0];
  let body = document.getElementsByTagName('body')[0];
  let title = document.getElementsByTagName('title')[0];
  let styleLink = document.createElement('link');
  styleLink.type = 'text/css';
  styleLink.rel = 'stylesheet';
  styleLink.id = 'theme-style';
  styleLink.href = `./theme/${theme}.css`;
  body.className = `body-wrap-${theme}`;
  head.insertBefore(styleLink, title);
}
export function onRouteChange(a) {}

export function rootContainer(container) {
  return React.createElement(ConfigProvider, { locale: zhCN }, container);
}
