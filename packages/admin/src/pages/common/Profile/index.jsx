import React, { useState } from 'react';
import { Card, Descriptions, Button, Modal, Form, Input, Upload, Avatar, Space, message } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, CameraOutlined } from '@ant-design/icons';
import './Profile.css';

/**
 * 个人信息页面 - 可复用组件
 * @param {object} userInfo - 用户信息
 * @param {function} onUpdateProfile - 更新个人信息回调
 * @param {function} onChangePassword - 修改密码回调
 * @param {function} onUploadAvatar - 上传头像回调
 */
const Profile = ({ 
  userInfo = {}, 
  onUpdateProfile, 
  onChangePassword,
  onUploadAvatar 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // 默认用户信息
  const defaultUserInfo = {
    id: 1,
    username: 'admin',
    realName: '管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    role: '系统管理员',
    avatar: null,
    createdAt: '2024-01-01 10:00:00',
    lastLoginAt: '2024-01-15 14:30:00',
    ...userInfo
  };

  /**
   * 打开编辑弹窗
   */
  const handleEdit = () => {
    editForm.setFieldsValue({
      realName: defaultUserInfo.realName,
      email: defaultUserInfo.email,
      phone: defaultUserInfo.phone,
    });
    setIsEditModalOpen(true);
  };

  /**
   * 提交个人信息修改
   */
  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      if (onUpdateProfile) {
        await onUpdateProfile(values);
      } else {
        // 模拟更新
        await new Promise(resolve => setTimeout(resolve, 500));
        message.success('个人信息更新成功！');
      }
      setIsEditModalOpen(false);
      editForm.resetFields();
    } catch (err) {
      console.error('更新失败:', err);
      message.error('更新失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 打开修改密码弹窗
   */
  const handleChangePasswordClick = () => {
    setIsPasswordModalOpen(true);
  };

  /**
   * 提交密码修改
   */
  const handleChangePassword = async (values) => {
    try {
      setLoading(true);
      if (onChangePassword) {
        await onChangePassword(values);
      } else {
        // 模拟修改密码
        await new Promise(resolve => setTimeout(resolve, 500));
        message.success('密码修改成功！');
      }
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
    } catch (err) {
      console.error('修改失败:', err);
      message.error('修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 上传头像
   */
  const handleAvatarUpload = async (info) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      try {
        if (onUploadAvatar) {
          await onUploadAvatar(info.file);
        } else {
          message.success('头像上传成功！');
        }
      } catch (err) {
        console.error('上传失败:', err);
        message.error('上传失败，请重试');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="profile-container">
      {/* 头部卡片 */}
      <Card className="profile-header-card">
        <div className="profile-header">
          <div className="avatar-section">
            <Upload
              name="avatar"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarUpload}
            >
              <div className="avatar-wrapper">
                <Avatar 
                  size={100} 
                  icon={<UserOutlined />}
                  src={defaultUserInfo.avatar}
                  className="user-avatar"
                />
                <div className="avatar-overlay">
                  <CameraOutlined style={{ fontSize: 24 }} />
                </div>
              </div>
            </Upload>
          </div>
          <div className="user-info-section">
            <h2 className="user-name">{defaultUserInfo.realName}</h2>
            <div className="user-role">{defaultUserInfo.role}</div>
            <div className="user-meta">
              <span>账号：{defaultUserInfo.username}</span>
              <span className="divider">|</span>
              <span>最后登录：{defaultUserInfo.lastLoginAt}</span>
            </div>
          </div>
          <div className="action-section">
            <Space>
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                编辑资料
              </Button>
              <Button 
                icon={<LockOutlined />}
                onClick={handleChangePasswordClick}
              >
                修改密码
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      {/* 详细信息卡片 */}
      <Card 
        title="详细信息" 
        className="profile-detail-card"
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="用户名">
            {defaultUserInfo.username}
          </Descriptions.Item>
          <Descriptions.Item label="真实姓名">
            {defaultUserInfo.realName}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            {defaultUserInfo.role}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {defaultUserInfo.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            {defaultUserInfo.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {defaultUserInfo.createdAt}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 编辑资料弹窗 */}
      <Modal
        title="编辑个人资料"
        open={isEditModalOpen}
        onCancel={() => {
          setIsEditModalOpen(false);
          editForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleUpdateProfile}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="真实姓名"
            name="realName"
            rules={[{ required: true, message: '请输入真实姓名' }]}
          >
            <Input placeholder="请输入真实姓名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={[
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

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
              <Button onClick={() => {
                setIsEditModalOpen(false);
                editForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 修改密码弹窗 */}
      <Modal
        title="修改密码"
        open={isPasswordModalOpen}
        onCancel={() => {
          setIsPasswordModalOpen(false);
          passwordForm.resetFields();
        }}
        footer={null}
        width={500}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="原密码"
            name="oldPassword"
            rules={[{ required: true, message: '请输入原密码' }]}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码至少6位' },
            ]}
          >
            <Input.Password placeholder="请输入新密码（至少6位）" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="请再次输入新密码" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" loading={loading}>
                确认修改
              </Button>
              <Button onClick={() => {
                setIsPasswordModalOpen(false);
                passwordForm.resetFields();
              }}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Profile;
