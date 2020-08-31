import request from '@/utils/request';

// 获取列表
export const get = keyword => {
  return request.get('/wxUser', { params: { keyword } });
};
export const del = id => {
  return request.delete(`/wxUser/${id}`);
};
export const removes = keys => {
  return request.delete(`/wxUser`, { data: { ids: keys } });
};
