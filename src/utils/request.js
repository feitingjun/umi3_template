/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { Modal } from 'antd';
import { history } from 'umi';

let is_due = false;

function parseJSON(response) {
  return response.json();
}

async function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(
    response.message || response.msg || response.statusText,
  );
  error.response = response;
  throw error;
}
/**
 * 异常处理程序
 */

const errorHandler = async err => {
  if (
    err &&
    err.response &&
    err.response.url &&
    err.response.url.indexOf('/info') !== -1
  ) {
    return false;
  }
  if (err && err.response && err.response.status == 401) {
    goLogin();
    return false;
  }
  let error;
  try {
    error = await parseJSON(err.response);
  } catch (e) {
    error = err;
  }
  const msg = error.statusText || error.message || error.msg || '服务器错误';
  const wra = document.getElementsByClassName('ant-modal-confirm-error');
  if (wra.length == 0) {
    Modal.error({
      okText: '确定',
      title: '系统消息',
      centered: true,
      content: msg,
    });
  }
  return false;
};
/**
 * 配置request请求时的默认参数
 */

function goLogin() {
  is_due = true;
  let time = 5;
  const modal = Modal.error({
    title: '系统消息',
    content: `你的账号在其他地方登录或登录验证已过期，${time}秒后跳转到登录页`,
    okText: '立即跳转',
    centered: true,
    onOk: () => {
      clearInterval(timer);
      modal.destroy();
      history.push('/login');
      is_due = false;
    },
  });
  const timer = setInterval(() => {
    if (time > 0) {
      time -= 1;
      modal.update({
        content: `你的账号在其他地方登录或登录验证已过期，${time}秒后跳转到登录页`,
      });
    } else {
      clearInterval(timer);
      modal.destroy();
      history.push('/login');
      is_due = false;
    }
  }, 1000);
}
const request = extend({
  prefix: '/admin',
  errorHandler,
  // getResponse: true,
  validateCache: () => false,
  // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});
request.interceptors.request.use(async (url, options) => {
  let headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('_t')}`,
    ...options.headers,
  };
  if (options && options.headers && options.headers['Content-Type'] === 'no')
    delete headers['Content-Type'];
  return {
    url,
    options: {
      ...options,
      headers,
    },
  };
});
request.interceptors.response.use(async (response, options) => {
  response = await checkStatus(response);
  response = await parseJSON(response);
  if (response.code != 200) {
    throw response;
  }
  return response;
});

export default request;
