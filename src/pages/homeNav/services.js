import request from '@/utils/request';

export const get = params => {
  return request.get('/home_nav', { params });
};
export const add = data => {
  return request.post('/home_nav', {
    data,
    headers: {
      'Content-Type': 'no',
    },
  });
};
export const update = (data, id) => {
  return request.put(`/home_nav/${id}`, {
    data,
    headers: {
      'Content-Type': 'no',
    },
  });
};
export const del = id => {
  return request.delete(`/home_nav/${id}`);
};
export const removes = keys => {
  return request.delete(`/home_nav`, { data: { ids: keys } });
};
export const sort = list => {
  return request.post(`/home_nav/sort`, { data: { list } });
};
// 获取数据列表
export const getNavDataList = keyword => {
  return request.get('/home_nav/data', {
    params: { keyword, pageIndex: 1, pageSize: 100000 },
  });
};
