import request from '@/utils/request';

export const get = data => {
  return request.get('/menu');
};
export const add = data => {
  return request.post('/menu', { data });
};
export const update = (id, values) => {
  return request.put(`/menu/${id}`, { data: values });
};
export const del = id => {
  return request.delete(`/menu/${id}`);
};
export const sort = values => {
  return request.post('/menu/sort', { data: values });
};
