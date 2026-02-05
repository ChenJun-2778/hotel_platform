import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const Users = () => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '商户'}
        </Tag>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'default'}>
          {status === 'active' ? '正常' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      id: 1,
      username: 'admin',
      role: 'admin',
      email: 'admin@example.com',
      status: 'active',
    },
    {
      key: '2',
      id: 2,
      username: 'merchant1',
      role: 'merchant',
      email: 'merchant1@example.com',
      status: 'active',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="用户管理" extra={<Button type="primary">添加用户</Button>}>
        <Table columns={columns} dataSource={data} />
      </Card>
    </div>
  );
};

export default Users;
