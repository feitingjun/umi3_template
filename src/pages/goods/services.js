import request from '@/utils/request';

// 获取列表
export const get = params => {
  return request.get('/goods', { params });
};
// 获取单条
export const getDetail = id => {
  return request.get(`/goods/${id}`);
};
export const add = data => {
  return request.post('/goods', {
    data,
    headers: {
      'Content-Type': 'no',
    },
  });
};
export const update = (id, data) => {
  return request.put(`/goods/${id}`, {
    data,
    headers: {
      'Content-Type': 'no',
    },
  });
};
export const del = id => {
  return request.delete(`/goods/${id}`);
};
export const removes = keys => {
  return request.delete(`/goods`, { data: { ids: keys } });
};
// 获取分类列表
export const getCategory = params => {
  return request.get('/category');
};
// 上传文件
export const upload = file => {
  const formData = new FormData();
  formData.append('file', file);
  return request.post('/upload', {
    data: formData,
    headers: {
      'Content-Type': 'no',
    },
  });
};
// 删除文件
export const delFile = filenames => {
  return request.delete('/upload', { data: { filenames } });
};
