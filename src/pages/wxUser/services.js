import request from '@/utils/request';

// 获取列表
export const get = params => {
  return request.get('/wxUser', { params });
};
export const del = id => {
  return request.delete(`/wxUser/${id}`);
};
export const removes = keys => {
  return request.delete(`/wxUser`, { data: { ids: keys } });
};
