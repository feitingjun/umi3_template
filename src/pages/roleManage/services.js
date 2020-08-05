import request from '@/utils/request';

export const get = params => {
  return request.get('/role', { params });
};
export const add = data => {
  return request.post('/role', { data });
};
export const update = values => {
  return request.put(`/role/${values.id}`, { data: values });
};
export const del = id => {
  return request.delete(`/role/${id}`);
};
export const removes = keys => {
  return request.delete(`/role`, { data: { ids: keys } });
};
export const getMenu = data => {
  return request.get('/menu');
};
