import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { getOrderStatusInfo } from '../utils/orderStatus';

/**
 * 订单表格组件
 */
const OrderTable = ({ orders, loading, onViewDetail }) => {
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      width: 160,
      fixed: 'left',
    },
    {
      title: '酒店',
      dataIndex: 'hotel',
      key: 'hotel',
      width: 150,
    },
    {
      title: '房间',
      dataIndex: 'room',
      key: 'room',
      width: 100,
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
      key: 'days',
      width: 80,
      render: (_, record) => {
        const checkIn = new Date(record.checkIn);
        const checkOut = new Date(record.checkOut);
        const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
        return `${days}晚`;
      },
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
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default OrderTable;
