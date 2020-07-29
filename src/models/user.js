import * as server from '@/services/user';
import { history } from 'umi';

export default {
  namespace: 'user',
  state: {
    user: null,
  },
  reducers: {
    save(state, { payload: values }) {
      state.user = values;
    },
  },
  effects: {
    *login({ payload: values }, { call, put }) {
      const { data } = yield call(server.login, values);
      if (data) {
        yield put({ type: 'save', payload: data });
        localStorage.setItem('_t', data.token);
        return data;
      }
    },
    *info({}, { call, put }) {
      const { data } = yield call(server.info);
      if (data) {
        yield put({ type: 'save', payload: data });
        return data;
      } else {
        history.push('/login');
      }
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        // if (pathname === '/login') {
        //   dispatch({type:'save', payload: null});
        // }
      });
    },
  },
};
