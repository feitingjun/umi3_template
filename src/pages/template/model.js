import * as server from '@/services/user';

export default {
    namespace: 'template',
    state: {
        user: {},
    },
    reducers: {
        save(state, { payload: values }) {
            state.user = values
        }
    },
    effects: {
        *login ({ payload: values },{ call, put}){
            // const { data } = yield call(server.login, values);
            // if (data) {
            //     yield put({ type: 'save', payload: data });
            // }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            return history.listen(({ pathname, query }) => {
            
            });
        },
    },
};