import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';

const Hotels = () => {
  const columns = [
    {
      title: '酒店名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '房间数',
      dataIndex: 'rooms',
      key: 'rooms',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          online: { color: 'green', text: '营业中' },
          offline: { color: 'default', text: '已下线' },
          pending: { color: 'orange', text: '审核中' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: '我的豪华酒店',
      address: '北京市朝阳区',
      rooms: 50,
      status: 'online',
    },
    {
      key: '2',
      name: '舒适商务酒店',
      address: '北京市海淀区',
      rooms: 30,
      status: 'online',
    },
    {
      key: '3',
      name: '新开业酒店',
      address: '北京市东城区',
      rooms: 20,
      status: 'pending',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="我的酒店" 
        extra={<Button type="primary" icon={<PlusOutlined />}>添加酒店</Button>}
      >
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Hotels;
