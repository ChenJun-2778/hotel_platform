import React from 'react';
import { Row, Col } from 'antd';

/**
 * 房间统计面板组件
 */
const RoomStatsPanel = ({ stats }) => {
  return (
    <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#fafafa', borderRadius: 8 }}>
      <Row gutter={16}>
        <Col span={4}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff' }}>
              {stats.total}
            </div>
            <div style={{ color: '#666' }}>总房间数</div>
          </div>
        </Col>
        <Col span={5}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>
              {stats.available}
            </div>
            <div style={{ color: '#666' }}>可预订</div>
          </div>
        </Col>
        <Col span={5}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ff4d4f' }}>
              {stats.occupied}
            </div>
            <div style={{ color: '#666' }}>已入住</div>
          </div>
        </Col>
        <Col span={5}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#faad14' }}>
              {stats.reserved}
            </div>
            <div style={{ color: '#666' }}>已预订</div>
          </div>
        </Col>
        <Col span={5}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff' }}>
              {stats.cleaning}
            </div>
            <div style={{ color: '#666' }}>清洁中</div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default RoomStatsPanel;
