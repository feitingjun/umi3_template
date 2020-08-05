import request from '@/utils/request';

// 获取列表
export const get = params => {
  return request.get('/user', { params });
};
// 获取单条
export const getDetail = id => {
  return request.get(`/user/${id}`);
};
export const add = data => {
  return request.post('/user', {
    data,
    headers: {
      'Content-Type': 'no',
    },
  });
};
export const update = (id, data) => {
  return request.put(`/user/${id}`, {
    data,
    headers: {
      'Content-Type': 'no',
    },
  });
};
export const del = id => {
  return request.delete(`/user/${id}`);
};
export const removes = keys => {
  return request.delete(`/user`, { data: { ids: keys } });
};
// 获取角色列表
export const getRole = params => {
  return request.get('/role', { params: { pageSize: 100000 } });
};
