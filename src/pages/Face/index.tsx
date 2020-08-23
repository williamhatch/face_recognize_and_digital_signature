import { PageContainer } from '@ant-design/pro-layout';
import React, { useState, useEffect } from 'react';
import { Spin } from 'antd';
import styles from './index.less';
import VideoInput from './components/VideoInput';

export default () => {
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);
  return (
    <PageContainer content="人脸识别中！" className={styles.main}>
      <div style={{ paddingTop: -200, textAlign: 'center' }}>
        <Spin spinning={loading} size="large" />
        <VideoInput />
      </div>
    </PageContainer>
  );
};
