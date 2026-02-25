import React from 'react';
import { Table, Tag, Space, Button, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

/**
 * 用户表格组件
 */
const UserTable = ({ users, loading, pagination, onPageChange, onEdit, onDelete }) => {
  /**
   * 确认删除
   */
  const confirmDelete = (user) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除用户 "${user.username}" 吗？此操作不可恢复。`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => onDelete && onDelete(user),
    });
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      width: 150,
    },
    {
      title: '角色',
      dataIndex: 'role_type',
      key: 'role_type',
      width: 100,
      render: (roleType) => {
        // role_type: 1=管理员, 2=商户
        const isAdmin = roleType === 1;
        return (
          <Tag color={isAdmin ? 'red' : 'blue'}>
            {isAdmin ? '管理员' : '商户'}
          </Tag>
        );
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      width: 200,
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      width: 150,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => {
        // status: 1=正常, 0=禁用
        const isActive = status === 1 || status === 'active';
        return (
          <Tag color={isActive ? 'green' : 'default'}>
            {isActive ? '正常' : '禁用'}
          </Tag>
        );
      },
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      width: 180,
      render: (time) => {
        // 如果是时间戳或ISO格式，格式化显示
        if (!time) return '-';
        try {
          const date = new Date(time);
          return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          });
        } catch {
          return time;
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            onClick={() => onEdit && onEdit(record)}
          >
            编辑
          </Button>
          <Button 
            type="link" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => confirmDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={users}
      loading={loading}
      rowKey="key"
      pagination={{
        current: pagination?.current || 1,
        pageSize: pagination?.pageSize || 10,
        total: pagination?.total || 0,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
        onChange: onPageChange,
        onShowSizeChange: onPageChange,
      }}
      scroll={{ x: 1200 }}
    />
  );
};

export default UserTable;
