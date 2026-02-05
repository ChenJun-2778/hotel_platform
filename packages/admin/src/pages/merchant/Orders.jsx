import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';

const Orders = () => {
  const columns = [
    {
      title: '订单号',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
    {
      title: '酒店',
      dataIndex: 'hotel',
      key: 'hotel',
    },
    {
      title: '房间',
      dataIndex: 'room',
      key: 'room',
    },
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '入住日期',
      dataIndex: 'checkIn',
      key: 'checkIn',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { color: 'orange', text: '待确认' },
          confirmed: { color: 'blue', text: '已确认' },
          checkedIn: { color: 'green', text: '已入住' },
          completed: { color: 'default', text: '已完成' },
          cancelled: { color: 'red', text: '已取消' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看详情</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      orderNo: 'ORD20240205001',
      hotel: '我的豪华酒店',
      room: '101',
      customer: '张三',
      checkIn: '2024-02-10',
      amount: 299,
      status: 'confirmed',
    },
    {
      key: '2',
      orderNo: 'ORD20240205002',
      hotel: '我的豪华酒店',
      room: '102',
      customer: '李四',
      checkIn: '2024-02-05',
      amount: 399,
      status: 'checkedIn',
    },
    {
      key: '3',
      orderNo: 'ORD20240204003',
      hotel: '舒适商务酒店',
      room: '201',
      customer: '王五',
      checkIn: '2024-02-03',
      amount: 599,
      status: 'completed',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="订单管理">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Orders;
