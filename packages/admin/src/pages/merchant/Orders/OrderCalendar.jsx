import React, { useState } from 'react';
import { DatePicker, Select, Space, Card, Row, Col, Statistic, Spin } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import RoomBookingCard from './components/RoomBookingCard';
import useCalendarData from './hooks/useCalendarData';
import dayjs from 'dayjs';

/**
 * 订单日历视图页面
 * 选择日期查看当天所有房间的预订情况
 */
const OrderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  const { hotels, roomBookings, stats, loading } = useCalendarData(selectedDate, selectedHotel);

  return (
    <PageContainer
      title="日历视图"
      titleExtra={
        <Space>
          <DatePicker
            value={selectedDate}
            onChange={(date) => setSelectedDate(date || dayjs())}
            format="YYYY-MM-DD"
            style={{ width: 200 }}
            placeholder="选择日期"
          />
          <Select
            value={selectedHotel}
            onChange={setSelectedHotel}
            style={{ width: 200 }}
            options={hotels}
          />
        </Space>
      }
      showSearch={false}
      showAddButton={false}
    >
      {/* 统计面板 */}
      <Spin spinning={loading}>
        <Card style={{ marginBottom: 24 }}>
          <Row gutter={16}>
            <Col span={6}>
              <Statistic
                title="总房间数"
                value={stats.total}
                suffix="间"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="空闲房间"
                value={stats.available}
                suffix="间"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="已预订/入住"
                value={stats.booked}
                suffix="间"
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
            <Col span={6}>
              <Statistic
                title="入住率"
                value={stats.occupancyRate}
                suffix="%"
                valueStyle={{ color: '#13c2c2' }}
              />
            </Col>
          </Row>
        </Card>

        {/* 房间卡片网格 */}
        <Card title={`${selectedDate.format('YYYY年MM月DD日')} 房间预订情况`}>
          {roomBookings.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
              暂无房间数据
            </div>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
              gap: 24,
              padding: '12px 0',
            }}>
              {roomBookings.map((room) => (
                <RoomBookingCard 
                  key={room.id} 
                  room={room}
                />
              ))}
            </div>
          )}
        </Card>
      </Spin>
    </PageContainer>
  );
};

export default OrderCalendar;
