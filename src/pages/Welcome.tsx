import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card } from 'antd';

export default (): React.ReactNode => (
  <PageContainer>
    <Card hoverable style={{ width: '100%' }} cover={<img alt="example" src="/workflow.png" />} />
  </PageContainer>
);
