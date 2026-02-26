import React, { useState } from 'react';
import { DatePicker, Select, Space, Card, Row, Col, Statistic, Spin } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import RoomTypeCard from '../../../components/common/RoomTypeCard';
import useCalendarData from './hooks/useCalendarData';
import dayjs from 'dayjs';
import { formatDateTime } from '../../../utils/dateFormat';

/**
 * 订单日历视图页面
 * 选择日期查看当天所有房间的预订情况
 */
const OrderCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedHotel, setSelectedHotel] = useState(null);
  
  const { hotels, roomBookings, hotelGroups, stats, loading } = useCalendarData(selectedDate, selectedHotel);

  /**
   * 获取房间状态配置（日历模式）
   */
  const getRoomConfig = (room) => {
    if (!room.available) {
      return {
        color: '#ff4d4f',
        bgColor: 'linear-gradient(135deg, #ff7875 0%, #ff4d4f 100%)',
        text: room.order?.guest_name || '已预订',
      };
    }
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
    if (!room.available && room.order) {
      const checkIn = dayjs(room.order.check_in_date);
      const checkOut = dayjs(room.order.check_out_date);
      const nights = checkOut.diff(checkIn, 'day');
      
      return (
        <div>
          <div><strong>房间号：</strong>{room.roomNumber}</div>
          <div><strong>状态：</strong>已预订</div>
          <div><strong>预订人：</strong>{room.order.guest_name || '-'}</div>
          <div><strong>入住天数：</strong>{nights}晚</div>
          <div><strong>联系电话：</strong>{room.order.guest_phone || '-'}</div>
          <div><strong>入住时间：</strong>{formatDateTime(room.order.check_in_date)}</div>
          <div><strong>退房时间：</strong>{formatDateTime(room.order.check_out_date)}</div>
          <div><strong>订单号：</strong>{room.order.order_no || '-'}</div>
          <div><strong>订单金额：</strong>¥{room.order.total_price || 0}</div>
        </div>
      );
    }
    
    if (!room.available) {
      return (
        <div>
          <div><strong>房间号：</strong>{room.roomNumber}</div>
          <div><strong>状态：</strong>已预订</div>
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
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
            }
            optionFilterProp="label"
            placeholder="选择酒店"
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
          
          {/* 单个酒店模式 */}
          {selectedHotel && (
            <>
              {roomBookings.length === 0 ? (
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
                  {roomBookings.map((roomType, index) => (
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
            </>
          )}
          
          {/* 全部酒店模式 - 按酒店分组显示 */}
          {!selectedHotel && (
            <>
              {!hotelGroups || hotelGroups.length === 0 ? (
                <Card>
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
                    暂无房间数据
                  </div>
                </Card>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                  {hotelGroups.map((hotelGroup, hotelIndex) => (
                    <div key={hotelIndex} style={{
                      background: '#fff',
                      borderRadius: 12,
                      padding: '24px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}>
                      {/* 酒店名称标题 */}
                      <div style={{
                        fontSize: 22,
                        fontWeight: 700,
                        color: '#1890ff',
                        marginBottom: 20,
                        paddingBottom: 16,
                        borderBottom: '2px solid #e8e8e8',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                      }}>
                        <div style={{
                          width: 4,
                          height: 24,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 2,
                        }} />
                        {hotelGroup.hotelName}
                        <span style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: '#8c8c8c',
                          marginLeft: 8,
                        }}>
                          ({hotelGroup.roomTypes.length} 种房型)
                        </span>
                      </div>
                      
                      {/* 该酒店的房型卡片 */}
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
                        gap: 24,
                      }}>
                        {hotelGroup.roomTypes.map((roomType, index) => (
                          <RoomTypeCard 
                            key={index} 
                            roomType={roomType}
                            mode="calendar"
                            getRoomConfig={getRoomConfig}
                            renderRoomTooltip={renderRoomTooltip}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </Spin>
    </PageContainer>
  );
};

export default OrderCalendar;
