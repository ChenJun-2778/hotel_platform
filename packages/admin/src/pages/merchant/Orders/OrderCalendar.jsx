import React, { useState } from 'react';
import { DatePicker, Select, Space, Card, Row, Col, Statistic } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import RoomBookingCard from './components/RoomBookingCard';
import useOrderList from './hooks/useOrderList';
import dayjs from 'dayjs';

/**
 * 订单日历视图页面
 * 选择日期查看当天所有房间的预订情况
 */
const OrderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  const { orders } = useOrderList();

  // 模拟酒店列表
  const hotels = [
    { value: null, label: '全部酒店' },
    { value: '1', label: '我的豪华酒店' },
    { value: '2', label: '舒适商务酒店' },
  ];

  // 模拟房间列表（实际应该从后端获取）
  const allRooms = [
    { id: 1, hotelId: '1', hotel: '我的豪华酒店', roomNumber: '2808', roomType: '行政豪华大床房', price: 888 },
    { id: 2, hotelId: '1', hotel: '我的豪华酒店', roomNumber: '2809', roomType: '豪华双床房', price: 688 },
    { id: 3, hotelId: '1', hotel: '我的豪华酒店', roomNumber: '2810', roomType: '行政套房', price: 1288 },
    { id: 4, hotelId: '1', hotel: '我的豪华酒店', roomNumber: '2811', roomType: '豪华大床房', price: 588 },
    { id: 5, hotelId: '1', hotel: '我的豪华酒店', roomNumber: '2812', roomType: '标准双床房', price: 488 },
    { id: 6, hotelId: '2', hotel: '舒适商务酒店', roomNumber: '1501', roomType: '商务大床房', price: 499 },
    { id: 7, hotelId: '2', hotel: '舒适商务酒店', roomNumber: '1502', roomType: '商务双床房', price: 499 },
    { id: 8, hotelId: '2', hotel: '舒适商务酒店', roomNumber: '1503', roomType: '豪华套房', price: 799 },
  ];

  /**
   * 获取指定日期的房间预订情况
   */
  const getRoomBookingStatus = () => {
    const dateStr = selectedDate.format('YYYY-MM-DD');
    
    // 过滤房间（如果选择了酒店）
    let rooms = allRooms;
    if (selectedHotel) {
      rooms = allRooms.filter(room => room.hotelId === selectedHotel);
    }

    // 为每个房间添加预订信息
    return rooms.map(room => {
      // 查找该房间在选定日期的订单
      const order = orders.find(order => 
        order.room === room.roomNumber &&
        order.hotelId === room.hotelId &&
        dateStr >= order.checkIn && 
        dateStr < order.checkOut
      );

      return {
        id: room.id,
        roomNumber: room.roomNumber,
        type: room.roomType,
        price: room.price,
        hotel: room.hotel,
        status: order ? 2 : 1, // 2=已入住, 1=可预订
        order: order || null,
      };
    });
  };

  const roomBookings = getRoomBookingStatus();

  /**
   * 统计信息
   */
  const stats = {
    total: roomBookings.length,
    available: roomBookings.filter(r => !r.order).length,
    booked: roomBookings.filter(r => r.order).length,
    occupancyRate: roomBookings.length > 0 
      ? ((roomBookings.filter(r => r.order).length / roomBookings.length) * 100).toFixed(1)
      : 0,
  };

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
            disabledDate={(current) => {
              // 禁用今天之前的日期
              if (current && current < dayjs().startOf('day')) {
                return true;
              }
              // 禁用7天之后的日期
              if (current && current > dayjs().add(7, 'day').endOf('day')) {
                return true;
              }
              return false;
            }}
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
              title="已预订"
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
      </Card>
    </PageContainer>
  );
};

export default OrderCalendar;
