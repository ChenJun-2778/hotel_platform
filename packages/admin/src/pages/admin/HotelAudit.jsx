import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';

const HotelAudit = () => {
  const columns = [
    {
      title: '酒店名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '商户',
      dataIndex: 'merchant',
      key: 'merchant',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          pending: { color: 'orange', text: '待审核' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          {record.status === 'pending' && (
            <>
              <Button type="link" icon={<CheckOutlined />} style={{ color: '#52c41a' }}>
                通过
              </Button>
              <Button type="link" danger icon={<CloseOutlined />}>
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: '豪华大酒店',
      merchant: '商户A',
      address: '北京市朝阳区',
      status: 'pending',
    },
    {
      key: '2',
      name: '舒适酒店',
      merchant: '商户B',
      address: '上海市浦东新区',
      status: 'approved',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="酒店审核管理">
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default HotelAudit;
