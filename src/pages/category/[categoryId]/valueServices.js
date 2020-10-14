import request from '@/utils/request';

export const get = params => {
  return request.get('/attr_value', { params });
};
export const add = data => {
  return request.post('/attr_value', { data });
};
export const update = values => {
  return request.put(`/attr_value/${values.id}`, { data: values });
};
export const del = id => {
  return request.delete(`/attr_value/${id}`);
};
export const removes = keys => {
  return request.delete(`/attr_value`, { data: { ids: keys } });
};
export const sort = list => {
  return request.post(`/attr_value/sort`, { data: { list } });
};
