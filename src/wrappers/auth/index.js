import { connect } from 'dva';
import { Button } from 'antd';
import styles from './index.css';
import img from '@/assets/403.png';

export default connect(state => {
  const { user } = state.user;
  const { menuList = [] } = user;
  let routes = [];
  const getAllRoute = list => {
    list.map(v => {
      if (v.route) routes.push(v.route);
      if (v.children && v.children.length > 0) {
        getAllRoute(v.children);
      }
    });
  };
  getAllRoute(menuList);
  routes = [...routes];
  return { routes };
})(props => {
  return (
    <div className={styles.authorized}>
      {props.routes.indexOf(props.route.path) > -1 ||
      props.routes.indexOf(props.route.auth) > -1 ? (
        props.children
      ) : (
        <div className={styles.noAccess}>
          <img src={img} />
          <div>对不起，您无权访问该页面！</div>
          <Button
            className={styles.backBtn}
            type="primary"
            onClick={() => {
              props.history.goBack();
            }}
          >
            返回
          </Button>
        </div>
      )}
    </div>
  );
});
