import React from 'react';
import { Card, Table, Tag, Space, Button, Select } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';

const Rooms = () => {
  const columns = [
    {
      title: '房间号',
      dataIndex: 'roomNumber',
      key: 'roomNumber',
    },
    {
      title: '所属酒店',
      dataIndex: 'hotel',
      key: 'hotel',
    },
    {
      title: '房型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `¥${price}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          available: { color: 'green', text: '可预订' },
          occupied: { color: 'red', text: '已入住' },
          maintenance: { color: 'orange', text: '维护中' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      roomNumber: '101',
      hotel: '我的豪华酒店',
      type: '标准间',
      price: 299,
      status: 'available',
    },
    {
      key: '2',
      roomNumber: '102',
      hotel: '我的豪华酒店',
      type: '大床房',
      price: 399,
      status: 'occupied',
    },
    {
      key: '3',
      roomNumber: '201',
      hotel: '舒适商务酒店',
      type: '商务套房',
      price: 599,
      status: 'available',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="房间管理"
        extra={
          <Space>
            <Select
              defaultValue="all"
              style={{ width: 150 }}
              options={[
                { value: 'all', label: '全部酒店' },
                { value: 'hotel1', label: '我的豪华酒店' },
                { value: 'hotel2', label: '舒适商务酒店' },
              ]}
            />
            <Button type="primary" icon={<PlusOutlined />}>添加房间</Button>
          </Space>
        }
      >
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Rooms;
