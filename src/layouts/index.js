import { history } from 'umi';
import Login from './login';
import Home from './home';
import Loading from './loading';
import { connect } from 'dva';

export default connect(state => {
    const { user, isLogin } = state.user;
    return { user, isLogin };
})(props => {
    const { children, location, isLogin, user, routes } = props;
    if(!user && !isLogin && location.pathname.indexOf('/login') === -1){
        history.push('/login');
        return <Login />
    }
    if(!user && location.pathname.indexOf('/login') === -1){
        return <Loading />
    }
    let Container = location.pathname.indexOf('/login') === -1  ? Home : Login;
    return (
        <Container routes={routes}>{children}</Container>
    );
})
