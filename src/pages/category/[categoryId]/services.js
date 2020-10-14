import request from '@/utils/request';

export const get = params => {
  return request.get('/attr_key', { params });
};
export const add = data => {
  return request.post('/attr_key', { data });
};
export const update = values => {
  return request.put(`/attr_key/${values.id}`, { data: values });
};
export const del = id => {
  return request.delete(`/attr_key/${id}`);
};
export const removes = keys => {
  return request.delete(`/attr_key`, { data: { ids: keys } });
};
export const sort = list => {
  return request.post(`/attr_key/sort`, { data: { list } });
};
