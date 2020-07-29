import request from '@/utils/request';

export function login(data) {
  return request.post('/login', {
    data: data,
  });
}
export function info(data) {
  return request.get('/info');
}
