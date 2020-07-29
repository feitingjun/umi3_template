import React from 'react';
import styles from './index.less';
import Breadcrumbs from '@/components/Breadcrumbs';

class Page extends React.Component {
  state = {};

  render() {
    return (
      <div className={styles.container}>
        <div className={styles.breadcrumb}>
          <Breadcrumbs routes={[{ name: '角色管理' }]} />
        </div>
      </div>
    );
  }
}

export default Page;
