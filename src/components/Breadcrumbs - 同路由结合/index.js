import React from 'react';
import { NavLink, Link } from 'umi';
import { withRouter } from 'umi';
import { connect } from 'dva';
import withBreadcrumbs from 'react-router-breadcrumbs-hoc';
import styles from './index.css';

class Breadcrumbs extends React.Component {
  render() {
    let allBreadcrumbsObj = {
      '/': {
        path: '/',
        breadcrumb: null,
      },
      '/404': {
        path: '/404',
        breadcrumb: null,
      },
    };
    const getData = list => {
      list.forEach(v => {
        allBreadcrumbsObj[v.route] = {
          path: v.route.substr(0, 1) === '/' ? v.route : '/' + v.route,
          breadcrumb: v.name,
        };
        if (v.children) getData(v.children);
      });
    };
    this.props.user &&
      this.props.user.menuList &&
      getData(this.props.user.menuList);

    const allRoutes = [];
    const getRoutes = list => {
      list.map(v => {
        if (v.path) allRoutes.push(v.path);
        if (v.routes) getRoutes(v.routes);
        if (allBreadcrumbsObj[v.path] && v.bname) {
          allBreadcrumbsObj[v.path].breadcrumb = v.bname;
          if (v.bnamefield) allBreadcrumbsObj[v.path].bnamefield = v.bnamefield;
        } else if (!allBreadcrumbsObj[v.path] && v.bname) {
          allBreadcrumbsObj[v.path] = {
            path: v.path,
            breadcrumb: v.bname,
          };
          if (v.bnamefield) allBreadcrumbsObj[v.path].bnamefield = v.bnamefield;
        }
      });
    };
    getRoutes(this.props.routes);
    let allBreadcrumbs = [];
    for (let key in allBreadcrumbsObj) {
      allBreadcrumbs.push(allBreadcrumbsObj[key]);
    }
    const WithBreadcrumbs = withBreadcrumbs(allBreadcrumbs)(
      ({ breadcrumbs }) => {
        return (
          <div className={styles.breadcrumb}>
            {breadcrumbs.map((breadcrumb, index) => {
              try {
                const bnamefield =
                  breadcrumb.match.params[breadcrumb.bnamefield];
                if (bnamefield) {
                  const bname = eval(breadcrumb.breadcrumb.props.children);
                  breadcrumb.breadcrumb = <span>{bname}</span>;
                }
              } catch (error) {}
              return (
                <span key={breadcrumb.key}>
                  {allRoutes.indexOf(breadcrumb.match.url) > -1 &&
                  breadcrumb.match.url !== breadcrumb.location.pathname ? (
                    <NavLink to={breadcrumb.match.url}>
                      {breadcrumb.breadcrumb}
                    </NavLink>
                  ) : (
                    breadcrumb.breadcrumb
                  )}
                  {index < breadcrumbs.length - 1 && <i> / </i>}
                </span>
              );
            })}
          </div>
        );
      },
    );
    return <WithBreadcrumbs />;
  }
}
const mapStateToProps = state => {
  const { user } = state.user;
  return { user };
};
export default withRouter(connect(mapStateToProps)(Breadcrumbs));
