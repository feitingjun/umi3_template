import React from 'react';
import { NavLink } from 'umi';
import styles from './index.less';

export default props => {
  const routes = [{ name: '首页', path: '/' }, ...(props.routes || [])];
  return (
    <div className={styles.breadcrumb}>
      {routes.map((v, i) => {
        const split =
          i < routes.length - 1 ? <span className={styles.split}>/</span> : '';
        return v.path ? (
          <NavLink to={v.path} key={i}>
            {v.name}
            {split}
          </NavLink>
        ) : (
          <span key={i}>
            {v.name}
            {split}
          </span>
        );
      })}
    </div>
  );
};
