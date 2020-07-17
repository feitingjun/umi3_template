import * as server from '@/services/user';

export default {
    namespace: 'user',
    state: {
        user: null,
        isLogin: localStorage.getItem('is_login') === 'true'
    },
    reducers: {
        save(state, { payload: values }) {
            localStorage.setItem('is_login', values ? true : false );
            state.isLogin = !!values;
            state.user = values;
        }
    },
    effects: {
        *login ({ payload: values },{ call, put}){
            const { data } = yield call(server.login, values);
            if (data) {
                yield put({ type: 'save', payload: data });
                localStorage.setItem('_t', data.token)
                return data;
            }
        },
        *info ({  },{ call, put}){
            const { data } = yield call(server.info);
            if (data) {
                yield put({ type: 'save', payload: data });
                return data;
            }
        },
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
            // if (pathname === '/') {
                // dispatch({type:'login', payload: { username:'用户' }});
            // }
            });
        },
    },
};