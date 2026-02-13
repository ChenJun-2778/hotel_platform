import React from 'react';
import Profile from '../common/Profile';
import { message } from 'antd';

/**
 * 管理端个人信息页面
 */
const AdminProfile = () => {
  // 管理员用户信息（可以从 Context 或 Redux 获取）
  const userInfo = {
    id: 1,
    username: 'admin',
    realName: '系统管理员',
    email: 'admin@hotel.com',
    phone: '13800138000',
    role: '系统管理员',
    avatar: null,
    createdAt: '2024-01-01 10:00:00',
    lastLoginAt: new Date().toLocaleString('zh-CN'),
  };

  /**
   * 更新个人信息
   */
  const handleUpdateProfile = async (values) => {
    console.log('更新个人信息:', values);
    // TODO: 调用后端API
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('个人信息更新成功！');
  };

  /**
   * 修改密码
   */
  const handleChangePassword = async (values) => {
    console.log('修改密码:', values);
    // TODO: 调用后端API
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('密码修改成功！');
  };

  /**
   * 上传头像
   */
  const handleUploadAvatar = async (file) => {
    console.log('上传头像:', file);
    // TODO: 上传到OSS并调用后端API
    await new Promise(resolve => setTimeout(resolve, 500));
    message.success('头像上传成功！');
  };

  return (
    <Profile
      userInfo={userInfo}
      onUpdateProfile={handleUpdateProfile}
      onChangePassword={handleChangePassword}
      onUploadAvatar={handleUploadAvatar}
    />
  );
};

export default AdminProfile;
