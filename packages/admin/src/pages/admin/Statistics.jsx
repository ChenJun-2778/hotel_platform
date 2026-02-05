import React from 'react';
import { Card, Row, Col } from 'antd';

const Statistics = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ marginBottom: '24px' }}>数据统计</h1>
      
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="平台数据概览">
            <p>这里将展示平台的各项数据统计图表</p>
            <p>包括：订单趋势、收入统计、用户增长等</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Statistics;
