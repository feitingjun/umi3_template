import { useEffect } from 'react';
import { history } from 'umi';
import Login from './login';
import Home from './home';
import Loading from './loading';
import { connect } from 'dva';

export default connect(state => {
  const { user } = state.user;
  return { user };
})(props => {
  const token = localStorage.getItem('_t');
  const { children, location, user, routes } = props;

  if (!user && location.pathname.indexOf('/login') === -1) {
    if (token) {
      return <Loading />;
    } else {
      history.replace('/login');
      return <Login />;
    }
  }
  let Container = location.pathname.indexOf('/login') === -1 ? Home : Login;
  return <Container routes={routes}>{children}</Container>;
});
