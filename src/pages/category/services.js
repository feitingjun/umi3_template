import request from '@/utils/request';

export const get = params => {
  return request.get('/category', { params });
};
export const add = data => {
  return request.post('/category', { data });
};
export const update = values => {
  return request.put(`/category/${values.id}`, { data: values });
};
export const del = id => {
  return request.delete(`/category/${id}`);
};
export const removes = keys => {
  return request.delete(`/category`, { data: { ids: keys } });
};
export const sort = list => {
  return request.post(`/category/sort`, { data: { list } });
};
