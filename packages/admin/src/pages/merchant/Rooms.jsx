import React, { useState } from 'react';
import { Card, Select, Space, Badge, Tooltip, Row, Col, Tag } from 'antd';
import { HomeOutlined } from '@ant-design/icons';

const Rooms = () => {
  const [selectedHotel, setSelectedHotel] = useState('hotel1');

  // 模拟酒店数据
  const hotels = [
    { value: 'hotel1', label: '我的豪华酒店', totalRooms: 20 },
    { value: 'hotel2', label: '舒适商务酒店', totalRooms: 15 },
    { value: 'hotel3', label: '新开业酒店', totalRooms: 12 },
  ];

  // 模拟房间数据
  const roomsData = {
    hotel1: [
      { roomNumber: '101', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '102', status: 'occupied', type: '大床房', price: 399, guest: '张三' },
      { roomNumber: '103', status: 'reserved', type: '标准间', price: 299, guest: '李四' },
      { roomNumber: '104', status: 'available', type: '豪华套房', price: 699 },
      { roomNumber: '105', status: 'occupied', type: '大床房', price: 399, guest: '王五' },
      { roomNumber: '201', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '202', status: 'reserved', type: '大床房', price: 399, guest: '赵六' },
      { roomNumber: '203', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '204', status: 'occupied', type: '豪华套房', price: 699, guest: '孙七' },
      { roomNumber: '205', status: 'available', type: '大床房', price: 399 },
      { roomNumber: '301', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '302', status: 'available', type: '大床房', price: 399 },
      { roomNumber: '303', status: 'reserved', type: '标准间', price: 299, guest: '周八' },
      { roomNumber: '304', status: 'available', type: '豪华套房', price: 699 },
      { roomNumber: '305', status: 'available', type: '大床房', price: 399 },
      { roomNumber: '401', status: 'occupied', type: '标准间', price: 299, guest: '吴九' },
      { roomNumber: '402', status: 'available', type: '大床房', price: 399 },
      { roomNumber: '403', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '404', status: 'available', type: '豪华套房', price: 699 },
      { roomNumber: '405', status: 'reserved', type: '大床房', price: 399, guest: '郑十' },
    ],
    hotel2: [
      { roomNumber: '101', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '102', status: 'occupied', type: '商务间', price: 399, guest: '客户A' },
      { roomNumber: '103', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '201', status: 'reserved', type: '商务套房', price: 599, guest: '客户B' },
      { roomNumber: '202', status: 'available', type: '商务套房', price: 599 },
      { roomNumber: '203', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '301', status: 'occupied', type: '商务间', price: 399, guest: '客户C' },
      { roomNumber: '302', status: 'available', type: '商务套房', price: 599 },
      { roomNumber: '303', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '401', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '402', status: 'reserved', type: '商务套房', price: 599, guest: '客户D' },
      { roomNumber: '403', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '501', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '502', status: 'available', type: '商务套房', price: 599 },
      { roomNumber: '503', status: 'occupied', type: '商务间', price: 399, guest: '客户E' },
    ],
    hotel3: [
      { roomNumber: '101', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '102', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '103', status: 'reserved', type: '精品套房', price: 799, guest: '新客A' },
      { roomNumber: '201', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '202', status: 'available', type: '精品套房', price: 799 },
      { roomNumber: '203', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '301', status: 'occupied', type: '精品间', price: 499, guest: '新客B' },
      { roomNumber: '302', status: 'available', type: '精品套房', price: 799 },
      { roomNumber: '303', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '401', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '402', status: 'available', type: '精品套房', price: 799 },
      { roomNumber: '403', status: 'reserved', type: '精品间', price: 499, guest: '新客C' },
    ],
  };

  // 状态配置
  const statusConfig = {
    available: { color: '#52c41a', text: '空闲', bgColor: '#f6ffed', borderColor: '#b7eb8f' },
    occupied: { color: '#ff4d4f', text: '已入住', bgColor: '#fff1f0', borderColor: '#ffa39e' },
    reserved: { color: '#faad14', text: '已预订', bgColor: '#fffbe6', borderColor: '#ffe58f' },
  };

  const currentRooms = roomsData[selectedHotel] || [];
  const currentHotel = hotels.find(h => h.value === selectedHotel);

  // 统计数据
  const stats = {
    total: currentRooms.length,
    available: currentRooms.filter(r => r.status === 'available').length,
    occupied: currentRooms.filter(r => r.status === 'occupied').length,
    reserved: currentRooms.filter(r => r.status === 'reserved').length,
  };

  // 门图标组件
  const DoorIcon = ({ room }) => {
    const config = statusConfig[room.status];
    return (
      <Tooltip
        title={
          <div>
            <div><strong>房间号：</strong>{room.roomNumber}</div>
            <div><strong>房型：</strong>{room.type}</div>
            <div><strong>价格：</strong>¥{room.price}/晚</div>
            <div><strong>状态：</strong>{config.text}</div>
            {room.guest && <div><strong>客人：</strong>{room.guest}</div>}
          </div>
        }
      >
        <div
          style={{
            width: 100,
            height: 140,
            backgroundColor: config.bgColor,
            border: `3px solid ${config.borderColor}`,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* 门把手 */}
          <div
            style={{
              position: 'absolute',
              right: 15,
              top: '50%',
              width: 8,
              height: 8,
              backgroundColor: config.color,
              borderRadius: '50%',
            }}
          />
          
          {/* 房间号 */}
          <div style={{ fontSize: 24, fontWeight: 'bold', color: config.color, marginBottom: 8 }}>
            {room.roomNumber}
          </div>
          
          {/* 房型 */}
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            {room.type}
          </div>
          
          {/* 价格 */}
          <div style={{ fontSize: 14, color: config.color, fontWeight: 'bold' }}>
            ¥{room.price}
          </div>
          
          {/* 状态标签 */}
          <Tag color={config.color} style={{ marginTop: 8, fontSize: 10 }}>
            {config.text}
          </Tag>
        </div>
      </Tooltip>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card
        title={
          <Space>
            <span>房间管理</span>
            <Select
              value={selectedHotel}
              onChange={setSelectedHotel}
              style={{ width: 200 }}
              options={hotels}
            />
          </Space>
        }
      >
        {/* 统计信息 */}
        <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#fafafa', borderRadius: 8 }}>
          <Row gutter={16}>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#1890ff' }}>{stats.total}</div>
                <div style={{ color: '#666' }}>总房间数</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#52c41a' }}>{stats.available}</div>
                <div style={{ color: '#666' }}>空闲</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#ff4d4f' }}>{stats.occupied}</div>
                <div style={{ color: '#666' }}>已入住</div>
              </div>
            </Col>
            <Col span={6}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 28, fontWeight: 'bold', color: '#faad14' }}>{stats.reserved}</div>
                <div style={{ color: '#666' }}>已预订</div>
              </div>
            </Col>
          </Row>
        </div>

        {/* 房间网格 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 16 }}>
          {currentRooms.map((room) => (
            <DoorIcon key={room.roomNumber} room={room} />
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Rooms;
