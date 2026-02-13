import React, { useState } from 'react';
import { Card, Row, Col, DatePicker, Space } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import OrderTrendChart from './components/OrderTrendChart';
import RevenuePieChart from './components/RevenuePieChart';
import OccupancyRateChart from './components/OccupancyRateChart';
import UserGrowthChart from './components/UserGrowthChart';
import useStatistics from './hooks/useStatistics';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

/**
 * 数据统计页面
 */
const Statistics = () => {
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, 'day'),
    dayjs()
  ]);

  const { 
    orderTrendData, 
    revenueData, 
    occupancyData, 
    userGrowthData 
  } = useStatistics(dateRange);

  /**
   * 日期范围变化
   */
  const handleDateChange = (dates) => {
    if (dates) {
      setDateRange(dates);
    }
  };

  return (
    <PageContainer
      title="数据统计"
      titleExtra={
        <Space>
          <RangePicker
            value={dateRange}
            onChange={handleDateChange}
            format="YYYY-MM-DD"
            style={{ width: 300 }}
          />
        </Space>
      }
      showSearch={false}
      showAddButton={false}
    >
      {/* 订单趋势 */}
      <Card 
        title="订单趋势" 
        style={{ marginBottom: 24 }}
      >
        <OrderTrendChart data={orderTrendData} />
      </Card>

      {/* 收入统计和入住率 */}
      <Row gutter={24} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="收入统计" style={{ height: '100%' }}>
            <RevenuePieChart data={revenueData} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="房间入住率" style={{ height: '100%' }}>
            <OccupancyRateChart data={occupancyData} />
          </Card>
        </Col>
      </Row>

      {/* 用户增长 */}
      <Card title="用户增长趋势">
        <UserGrowthChart data={userGrowthData} />
      </Card>
    </PageContainer>
  );
};

export default Statistics;
