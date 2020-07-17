import React from 'react';
import { NavLink } from 'umi';
import { withRouter } from 'umi';
import { connect } from 'dva';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import styles from './index.css';

class Breadcrumbs extends React.Component {

  render() {
    let allBreadcrumbs = [
      { path: '/', breadcrumb: null },
      { path: '/404', breadcrumb: null },
      { path: '/userManage/:id', breadcrumb: '用户信息' }
    ];
    const userRoutes = [];
    const getData = list => {
      list.forEach(v => {
        allBreadcrumbs.push({
          path: v.route, breadcrumb: v.name
        })
        userRoutes.push(v.route);
        if (v.children) getData(v.children)
      })
    }
    this.props.user && this.props.user.menuList && getData(this.props.user.menuList);

    const allRoutes = [];
    const getRoutes = list => {
      list.map(v => {
        if (v.path) allRoutes.push(v.path);
        if (v.routes) getRoutes(v.routes);
      })
    }
    getRoutes(this.props.routes);

    const WithBreadcrumbs = withBreadcrumbs(allBreadcrumbs)(({ breadcrumbs }) => {
      if (breadcrumbs.length > 0 && userRoutes.indexOf(breadcrumbs[breadcrumbs.length - 1].match.path) == -1) {
        return null
      }
      return <div className={ styles.breadcrumb }>
        { breadcrumbs.map((breadcrumb, index) => {
          return <span key={ breadcrumb.key }>
            { allRoutes.indexOf(breadcrumb.match.url) > -1 && breadcrumb.match.url !== breadcrumb.location.pathname ? <NavLink to={ breadcrumb.match.url }>
              { breadcrumb.breadcrumb }
            </NavLink> : breadcrumb.breadcrumb }
            { (index < breadcrumbs.length - 1) && <i> / </i> }
          </span>
        }) }
      </div>
    })
    debugger
    return <div>
      <WithBreadcrumbs />
      {this.props.children}
    </div>
  }
}
const mapStateToProps = state => {
  const { user } = state.user;
  return { user }
}
export default withRouter(connect(mapStateToProps)(Breadcrumbs));