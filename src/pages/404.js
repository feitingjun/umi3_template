import React from 'react';
import { Button } from 'antd';
import styles from './index.css';
import img from '@/assets/404.png';

export default (props) => {
    return <div className={styles.absence}>
       <img src={img}/>
       <div>对不起，您访问的页面不存在！</div>
       <Button className={styles.backBtn} type='primary' onClick={()=>{
           props.history.goBack();
       }}>返回</Button>
    </div>
}