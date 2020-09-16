import request from '@/utils/request';

export const get = params => {
  return request.get('/banner', { params });
};
export const add = data => {
  return request.post('/banner', {
    data,
    headers: {
      'Content-Type': 'no',
    },
  });
};
export const update = (data, id) => {
  return request.put(`/banner/${id}`, {
    data,
    headers: {
      'Content-Type': 'no',
    },
  });
};
export const del = id => {
  return request.delete(`/banner/${id}`);
};
export const removes = keys => {
  return request.delete(`/banner`, { data: { ids: keys } });
};
export const sort = list => {
  return request.post(`/banner/sort`, { data: { list } });
};
// 获取商品列表
export const getGoodsList = keyword => {
  return request.get('/goods', {
    params: { keyword, pageIndex: 1, pageSize: 100000 },
  });
};
