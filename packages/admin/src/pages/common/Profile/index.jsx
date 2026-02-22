import { useState, useEffect } from 'react';
import { Card, Descriptions, Button, Modal, Form, Input, Upload, Avatar, Space, message } from 'antd';
import { UserOutlined, EditOutlined, LockOutlined, CameraOutlined } from '@ant-design/icons';
import { changePassword, getUserInfo, updateUserInfo } from '../../../services/authService';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  usernameRules,
  emailOptionalRules,
  phoneOptionalRules,
  passwordLoginRules,
  newPasswordRules,
  confirmPasswordRules
} from '../../../utils/formValidation';
import './Profile.css';

/**
 * 个人信息页面 - 可复用组件
 * @param {object} userInfo - 用户信息（可选，如果不传则从后端获取）
 * @param {function} onUpdateProfile - 更新个人信息回调
 * @param {function} onUploadAvatar - 上传头像回调
 */
const Profile = ({ 
  userInfo: propUserInfo, 
  onUpdateProfile, 
  onUploadAvatar 
}) => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 加载用户信息
  useEffect(() => {
    const loadUserInfo = async () => {
      console.log('🔍 开始加载用户信息...');
      console.log('🔍 user from context:', user);
      
      if (propUserInfo) {
        console.log('✅ 使用传入的 propUserInfo');
        setUserInfo(propUserInfo);
      } else if (user?.id) {
        // 先使用 AuthContext 中的数据作为初始显示
        const fallbackUserInfo = {
          id: user.id,
          username: user.username || 'user',
          email: user.email || '',
          phone: user.phone || '',
          role_type: user.role_type || 2,
          avatar: user.avatar_url || null,
          created_at: user.created_at,
          updated_at: user.updated_at,
        };
        
        setUserInfo(fallbackUserInfo);
        console.log('✅ 使用 AuthContext 中的用户信息');
        
        // 尝试从后端获取更完整的用户信息（如果接口可用）
        try {
          console.log('🔍 尝试从后端获取用户信息 - ID:', user.id);
          const response = await getUserInfo(user.id);
          const userData = response.data || response;
          console.log('✅ 后端返回用户数据:', userData);
          setUserInfo(userData);
        } catch {
          // 后端接口不可用时，继续使用 AuthContext 中的数据
          console.log('⚠️ 后端接口暂不可用，使用登录时保存的用户信息');
        }
      } else {
        console.warn('⚠️ 没有用户ID，无法加载用户信息');
      }
    };

    loadUserInfo();
  }, [propUserInfo, user]);

  // 默认用户信息
  const displayUserInfo = userInfo || {
    id: user?.id || 1,
    username: user?.username || 'user',
    email: user?.email || '',
    phone: user?.phone || '',
    role_type: user?.role_type || 2,
  };

  /**
   * 打开编辑弹窗
   */
  const handleEdit = () => {
    editForm.setFieldsValue({
      username: displayUserInfo.username,
      email: displayUserInfo.email,
      phone: displayUserInfo.phone,
    });
    setIsEditModalOpen(true);
  };

  /**
   * 提交个人信息修改
   */
  const handleUpdateProfile = async (values) => {
    try {
      setLoading(true);
      console.log('✅ 更新用户信息 - ID:', displayUserInfo.id);
      console.log('✅ 提交的数据:', values);
      
      if (onUpdateProfile) {
        await onUpdateProfile(values);
      } else {
        // 调用真实接口更新用户信息
        const updateData = {
          username: values.username,
          email: values.email,
          phone: values.phone,
        };
        
        // 如果有头像URL，也一起提交
        if (displayUserInfo.avatar_url) {
          updateData.avatar_url = displayUserInfo.avatar_url;
        }
        
        await updateUserInfo(displayUserInfo.id, updateData);
        
        // 更新本地状态
        const updatedUserInfo = {
          ...displayUserInfo,
          username: values.username,
          email: values.email,
          phone: values.phone,
        };
        setUserInfo(updatedUserInfo);
        
        // 同步更新 AuthContext 中的用户信息
        login({
          ...user,
          username: values.username,
          email: values.email,
          phone: values.phone,
        });
        
        console.log('✅ 用户信息更新成功');
        message.success('个人信息更新成功！');
      }
      
      setIsEditModalOpen(false);
      editForm.resetFields();
    } catch (err) {
      console.error('❌ 更新失败:', err);
      message.error(err.message || '更新失败，请重试');
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
      console.log('✅ 修改密码 - 用户ID:', displayUserInfo.id);
      
      await changePassword(displayUserInfo.id, {
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      });
      
      console.log('✅ 密码修改成功');
      
      // 关闭弹窗
      setIsPasswordModalOpen(false);
      passwordForm.resetFields();
      
      // 显示成功提示
      message.success('密码修改成功！请重新登录', 2);
      
      // 延迟2秒后登出并跳转
      setTimeout(() => {
        logout();
        navigate('/login', { 
          state: { 
            message: '登录已过期，请使用新密码重新登录' 
          } 
        });
      }, 2000);
      
    } catch (err) {
      console.error('❌ 修改失败:', err);
      
      // 根据错误信息提供更友好的提示
      let errorMessage = err.message || '修改失败，请重试';
      
      // 常见错误的友好提示
      if (errorMessage.includes('原密码') || errorMessage.includes('旧密码') || errorMessage.includes('old password')) {
        errorMessage = '原密码输入错误，请重新输入';
      } else if (errorMessage.includes('新密码') || errorMessage.includes('new password')) {
        errorMessage = '新密码格式不正确，请检查密码要求';
      } else if (errorMessage.includes('相同') || errorMessage.includes('same')) {
        errorMessage = '新密码不能与原密码相同';
      }
      
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 上传头像前的验证
   */
  const beforeAvatarUpload = (file) => {
    // 验证文件类型
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/webp';
    if (!isImage) {
      message.error('只能上传 JPG/PNG/WEBP 格式的图片！');
      return false;
    }
    
    // 验证文件大小（最大 2MB）
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片大小不能超过 2MB！');
      return false;
    }
    
    return true;
  };

  /**
   * 上传头像
   */
  const handleAvatarUpload = async (info) => {
    const { file } = info;
    
    // 验证文件
    if (!beforeAvatarUpload(file)) {
      return;
    }
    
    try {
      setLoading(true);
      message.loading({ content: '正在上传头像...', key: 'uploadAvatar' });
      
      if (onUploadAvatar) {
        await onUploadAvatar(file);
      } else {
        // 上传到 OSS
        const { uploadToOss } = await import('../../../utils/oss');
        const avatarUrl = await uploadToOss(file, 'avatars');
        
        console.log('✅ 头像上传成功:', avatarUrl);
        
        // 更新用户头像
        const updateData = {
          username: displayUserInfo.username,
          email: displayUserInfo.email,
          phone: displayUserInfo.phone,
          avatar_url: avatarUrl,
        };
        
        await updateUserInfo(displayUserInfo.id, updateData);
        
        // 更新本地状态
        setUserInfo(prev => ({
          ...prev,
          avatar_url: avatarUrl,
        }));
        
        // 同步更新 AuthContext
        login({
          ...user,
          avatar_url: avatarUrl,
        });
        
        message.success({ content: '头像上传成功！', key: 'uploadAvatar' });
      }
    } catch (err) {
      console.error('❌ 上传失败:', err);
      message.error({ content: err.message || '上传失败，请重试', key: 'uploadAvatar' });
    } finally {
      setLoading(false);
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
              customRequest={({ file }) => {
                handleAvatarUpload({ file });
              }}
              accept="image/jpeg,image/png,image/jpg,image/webp"
            >
              <div className="avatar-wrapper">
                <Avatar 
                  size={100} 
                  icon={<UserOutlined />}
                  src={displayUserInfo.avatar_url || displayUserInfo.avatar}
                  className="user-avatar"
                />
                <div className="avatar-overlay">
                  <CameraOutlined style={{ fontSize: 24 }} />
                  <div style={{ fontSize: 12, marginTop: 4 }}>更换头像</div>
                </div>
              </div>
            </Upload>
          </div>
          <div className="user-info-section">
            <h2 className="user-name">{displayUserInfo.username}</h2>
            <div className="user-role">
              {displayUserInfo.role_type === 1 ? '管理员' : '商户'}
            </div>
            <div className="user-meta">
              <span>账号：{displayUserInfo.username}</span>
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
            {displayUserInfo.username}
          </Descriptions.Item>
          <Descriptions.Item label="角色">
            {displayUserInfo.role_type === 1 ? '管理员' : '商户'}
          </Descriptions.Item>
          <Descriptions.Item label="邮箱">
            {displayUserInfo.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号">
            {displayUserInfo.phone || '-'}
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
            label="用户名"
            name="username"
            rules={usernameRules}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            label="邮箱"
            name="email"
            rules={emailOptionalRules}
          >
            <Input placeholder="请输入邮箱" />
          </Form.Item>

          <Form.Item
            label="手机号"
            name="phone"
            rules={phoneOptionalRules}
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
            rules={passwordLoginRules}
          >
            <Input.Password placeholder="请输入原密码" />
          </Form.Item>

          <Form.Item
            label="新密码"
            name="newPassword"
            rules={newPasswordRules}
          >
            <Input.Password placeholder="请输入新密码（8-20位，包含大小写字母和数字）" />
          </Form.Item>

          <Form.Item
            label="确认密码"
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={confirmPasswordRules('newPassword')}
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
