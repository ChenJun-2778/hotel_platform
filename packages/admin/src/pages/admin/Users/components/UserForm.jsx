import React from 'react';
import { Form, Input, Select, Space, Button } from 'antd';

const { Option } = Select;

/**
 * 用户表单组件
 */
const UserForm = ({ form, onFinish, onCancel, isEdit = false }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          { required: true, message: '请输入用户名' },
          { min: 3, message: '用户名至少3个字符' },
        ]}
      >
        <Input placeholder="请输入用户名" disabled={isEdit} />
      </Form.Item>

      {!isEdit && (
        <Form.Item
          label="密码"
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' },
          ]}
        >
          <Input.Password placeholder="请输入密码" />
        </Form.Item>
      )}

      <Form.Item
        label="邮箱"
        name="email"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入有效的邮箱地址' },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item
        label="手机号"
        name="phone"
        rules={[
          { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' },
        ]}
      >
        <Input placeholder="请输入手机号" />
      </Form.Item>

      <Form.Item
        label="角色"
        name="role"
        rules={[{ required: true, message: '请选择角色' }]}
      >
        <Select placeholder="请选择角色">
          <Option value="merchant">商户</Option>
          <Option value="admin">管理员</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="状态"
        name="status"
        rules={[{ required: true, message: '请选择状态' }]}
      >
        <Select placeholder="请选择状态">
          <Option value="active">正常</Option>
          <Option value="inactive">禁用</Option>
        </Select>
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={onCancel}>
            取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default UserForm;
