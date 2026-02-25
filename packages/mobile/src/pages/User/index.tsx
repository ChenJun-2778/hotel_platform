import React, { useState, useEffect } from 'react';
import { NavBar, Avatar, List, Button, Dialog, Toast, ImageUploader, Form, Input } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { 
  UnorderedListOutline, 
  RightOutline,
  SetOutline,
  EditSOutline 
} from 'antd-mobile-icons';
import styles from './index.module.css';
import { apiUpdateProfile } from '@/api/User/index';

type ImageUploadItem = {
  url: string;
  thumbnail?: string;
}

const User: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // 控制弹窗
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm(); 

  // 1. 初始化读取本地用户信息
  useEffect(() => {
    const storedUser = localStorage.getItem('USER_INFO');
    if (storedUser) {
      try {
        setUserInfo(JSON.parse(storedUser));
      } catch (e) {
        console.error('解析用户信息失败', e);
      }
    }
  }, []);

  // 🌟 2. 核心：统一的权限拦截函数
  const requireAuth = (targetPath: string) => {
    if (userInfo) {
      // 已登录，直接放行跳转
      navigate(targetPath);
    } else {
      // 未登录，拦截并跳去登录
      Toast.show('请先登录');
      navigate('/login');
    }
  };

  // 模拟图片上传
  const mockUpload = async (file: File): Promise<ImageUploadItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTimeout(() => {
          resolve({ url: e.target?.result as string });
        }, 500);
      };
      reader.readAsDataURL(file);
    });
  };

  // 点击编辑按钮
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，防止触发外层 header 的点击事件
    if (userInfo) {
      const avatarFileList = userInfo.avatar ? [{ url: userInfo.avatar }] : [];
      // ✅ 字段对齐：用 username 替换原来的 nickname
      form.setFieldsValue({
        username: userInfo.username,
        avatar: avatarFileList, 
      });
      setEditVisible(true);
    }
  };

  // 保存修改
  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      
      let newAvatarUrl = '';
      if (values.avatar && values.avatar.length > 0) {
        newAvatarUrl = values.avatar[0].url;
      }

      // ✅ 调用后端 API 更新用户信息
      Toast.show({ icon: 'loading', content: '保存中...', duration: 0 });
      
      const res = await apiUpdateProfile(userInfo.id, {
        username: values.username,
        avatar_url: newAvatarUrl
      });

      Toast.clear();

      if (res.success) {
        // 更新本地用户信息
        const newUser = { 
          ...userInfo, 
          username: values.username,
          avatar: newAvatarUrl,
          avatar_url: newAvatarUrl
        };

        setUserInfo(newUser);
        localStorage.setItem('USER_INFO', JSON.stringify(newUser));
        
        Toast.show({ icon: 'success', content: '修改成功' });
        setEditVisible(false);
      } else {
        Toast.show({ icon: 'fail', content: res.message || '修改失败' });
      }
    } catch (error: any) {
      Toast.clear();
      console.log('保存失败', error);
      Toast.show({ icon: 'fail', content: error.message || '保存失败' });
    }
  };

  // 退出登录
  const performLogout = async () => {
    setLogoutVisible(false);
    Toast.show({ icon: 'loading', content: '正在退出...', duration: 0 });
    
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 清除本地缓存
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('USER_INFO');
    setUserInfo(null);
    
    Toast.clear();
    Toast.show({ icon: 'success', content: '已退出' });
  };

  // 点击头部区域
  const handleHeaderClick = () => {
    // 没登录点头部就去登录，登录了点头部什么都不做（因为有专门的编辑按钮了）
    if (!userInfo) {
      navigate('/login');
    }
  };

  return (
    <div className={styles.container}>
      <NavBar back={null} style={{ background: '#fff' }}>个人中心</NavBar>

      {/* ========== 头部区域 ========== */}
      <div className={styles.header} onClick={handleHeaderClick}>
        <Avatar 
            src={userInfo?.avatar || ''} 
            style={{ '--size': '64px', '--border-radius': '50%' }} 
        />
        
        <div className={styles.userInfo}>
          {userInfo ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {/* ✅ 渲染后端的 username */}
                <div className={styles.nickname}>{userInfo.username}</div>
                <EditSOutline 
                  style={{ marginLeft: 8, color: '#666', fontSize: 16, cursor: 'pointer' }} 
                  onClick={handleEditClick}
                />
              </div>
              <div className={styles.userId} style={{opacity: 0.6}}>账号: {userInfo.account}</div>
            </>
          ) : (
            <>
              <div className={styles.loginTip}>未登录</div>
              <div className={styles.subTip}>点击登录 / 注册</div>
            </>
          )}
        </div>
        
        {/* 如果没登录，显示右侧箭头引导去登录 */}
        {!userInfo && <RightOutline color='#ccc' />}
      </div>

      {/* ========== 列表区域 (保留外壳，点击拦截) ========== */}
      <List>
        <List.Item 
          prefix={<UnorderedListOutline color='#1677ff' />} 
          // ✅ 使用统一拦截函数
          onClick={() => requireAuth('/order-list')} 
          extra={<RightOutline />}
          clickable
        >
          我的订单
        </List.Item>
        
        <List.Item 
          prefix={<SetOutline />} 
          // ✅ 使用统一拦截函数
          onClick={() => requireAuth('/settings')}
          extra={<RightOutline />}
          clickable
        >
          设置
        </List.Item>
      </List>

      {/* ========== 退出登录按钮 ========== */}
      {userInfo && (
        <div className={styles.logoutSection}>
          <Button block color='danger' onClick={() => setLogoutVisible(true)}>
            退出登录
          </Button>
        </div>
      )}

      {/* ========== 退出确认弹窗 ========== */}
      <Dialog
        visible={logoutVisible}
        content='确定要退出登录吗？'
        closeOnAction
        onClose={() => setLogoutVisible(false)}
        actions={[
          [
            { key: 'cancel', text: '取消', onClick: () => setLogoutVisible(false) },
            { key: 'confirm', text: '退出', danger: true, bold: true, onClick: performLogout },
          ],
        ]}
      />

      {/* ========== 修改信息弹窗 ========== */}
      <Dialog
        visible={editVisible}
        title="修改信息"
        content={
          <Form form={form} layout='horizontal' footer={null}>
            <Form.Item 
              name='username' 
              label='昵称' 
              rules={[{ required: true, message: '昵称不能为空' }]}
            >
              <Input placeholder='请输入昵称' clearable />
            </Form.Item>
            
            <Form.Item 
              name='avatar' 
              label='头像'
            >
              <ImageUploader
                maxCount={1}
                upload={mockUpload}
                onDelete={() => Dialog.confirm({ content: '确定删除头像吗？' })}
              />
            </Form.Item>
          </Form>
        }
        actions={[
          [
            { key: 'cancel', text: '取消', onClick: () => setEditVisible(false) },
            { 
              key: 'confirm', 
              text: '保存', 
              bold: true, 
              style: { color: '#1677ff' }, 
              onClick: handleSaveProfile 
            },
          ]
        ]}
      />
    </div>
  );
};

export default User;