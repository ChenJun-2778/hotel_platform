import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { getOrderStatusInfo } from '../utils/orderStatus';
import { useRoomStore } from '../../../../stores/roomStore';

/**
 * 订单表格组件
 */
const OrderTable = ({ orders, loading, pagination, onPageChange, onViewDetail }) => {
  const getAssignedRoom = useRoomStore(state => state.getAssignedRoom);
  
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 180,
      fixed: 'left',
      render: (text) => (
        <span style={{ fontFamily: 'monospace', fontSize: 13 }}>{text}</span>
      ),
    },
    {
      title: '酒店',
      dataIndex: 'hotelName',
      key: 'hotelName',
      width: 150,
      ellipsis: true,
    },
    {
      title: '房型',
      dataIndex: 'roomType',
      key: 'roomType',
      width: 120,
    },
    {
      title: '房间号',
      dataIndex: 'assignedRoom',
      key: 'assignedRoom',
      width: 100,
      render: (assignedRoom, record) => {
        // 优先从 Context 获取前端分配的房间号
        const frontendAssignedRoom = getAssignedRoom(record.orderNo);
        const displayRoom = frontendAssignedRoom || assignedRoom;
        
        // 待确定状态显示"待分配"
        if (record.status === 2 && !displayRoom) {
          return <span style={{ color: '#8c8c8c' }}>待分配</span>;
        }
        
        // 显示房间号（前端分配的或后端返回的）
        return displayRoom ? (
          <span style={{ 
            color: frontendAssignedRoom ? '#1890ff' : 'inherit',
            fontWeight: frontendAssignedRoom ? 600 : 'normal',
            fontFamily: 'monospace'
          }}>
            {displayRoom}
          </span>
        ) : '-';
      },
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
      width: 100,
    },
    {
      title: '入住日期',
      dataIndex: 'checkIn',
      key: 'checkIn',
      width: 120,
    },
    {
      title: '退房日期',
      dataIndex: 'checkOut',
      key: 'checkOut',
      width: 120,
    },
    {
      title: '天数',
      dataIndex: 'nights',
      key: 'nights',
      width: 80,
      render: (nights) => `${nights}晚`,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 100,
      render: (amount) => (
        <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>
          ¥{amount}
        </span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        const info = getOrderStatusInfo(status);
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => onViewDetail && onViewDetail(record)}
          >
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={orders}
      loading={loading}
      pagination={{
        current: pagination?.current || 1,
        pageSize: pagination?.pageSize || 10,
        total: pagination?.total || 0,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['10', '20', '50', '100'],
        onChange: (page, pageSize) => {
          onPageChange && onPageChange(page, pageSize);
        },
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default OrderTable;
