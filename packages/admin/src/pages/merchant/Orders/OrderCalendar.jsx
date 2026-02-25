import React, { useState } from 'react';
import { DatePicker, Select, Space, Card, Row, Col, Statistic, Spin } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import RoomTypeCard from '../../../components/common/RoomTypeCard';
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

  // 按房型分组房间数据
  const groupedByRoomType = React.useMemo(() => {
    const groups = {};
    roomBookings.forEach(room => {
      const key = room.type; // 使用房型作为分组键
      if (!groups[key]) {
        groups[key] = {
          room_type_code: room.roomNumber || room.type, // 使用房间号或房型作为编号
          room_type: room.type,
          base_price: room.price,
          room_numbers: [],
        };
      }
      groups[key].room_numbers.push(room);
    });
    return Object.values(groups);
  }, [roomBookings]);

  /**
   * 获取房间状态配置（日历模式）
   */
  const getRoomConfig = (room) => {
    if (room.order) {
      // 有订单：已预订或已入住
      return {
        color: '#faad14',
        bgColor: 'linear-gradient(135deg, #ffd666 0%, #ffa940 100%)',
        text: room.order.customer,
      };
    }
    // 空闲
    return {
      color: '#52c41a',
      bgColor: 'linear-gradient(135deg, #95de64 0%, #52c41a 100%)',
      text: '空闲',
    };
  };

  /**
   * 渲染房间 Tooltip（日历模式）
   */
  const renderRoomTooltip = (room, basePrice) => {
    if (room.order) {
      return (
        <div>
          <div><strong>房间号：</strong>{room.roomNumber}</div>
          <div><strong>入住人：</strong>{room.order.customer}</div>
          <div><strong>联系电话：</strong>{room.order.phone || '-'}</div>
          <div><strong>入住日期：</strong>{room.order.checkIn}</div>
          <div><strong>退房日期：</strong>{room.order.checkOut}</div>
          <div><strong>订单号：</strong>{room.order.orderNo}</div>
          <div><strong>订单金额：</strong>¥{room.order.amount}</div>
        </div>
      );
    }
    return (
      <div>
        <div><strong>房间号：</strong>{room.roomNumber}</div>
        <div><strong>状态：</strong>空闲</div>
        <div><strong>价格：</strong>¥{basePrice}/晚</div>
      </div>
    );
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

        {/* 房型卡片网格 */}
        <div style={{ marginBottom: 16 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#262626', marginBottom: 16 }}>
            {selectedDate.format('YYYY年MM月DD日')} 房间预订情况
          </h3>
          {groupedByRoomType.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                暂无房间数据
              </div>
            </Card>
          ) : (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
              gap: 24,
            }}>
              {groupedByRoomType.map((roomType, index) => (
                <RoomTypeCard 
                  key={index} 
                  roomType={roomType}
                  mode="calendar"
                  getRoomConfig={getRoomConfig}
                  renderRoomTooltip={renderRoomTooltip}
                />
              ))}
            </div>
          )}
        </div>
      </Spin>
    </PageContainer>
  );
};

export default OrderCalendar;
