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
        const user = JSON.parse(storedUser);
        // 清理无效的 blob URL
        if (user.avatar && user.avatar.startsWith('blob:')) {
          user.avatar = '';
          localStorage.setItem('USER_INFO', JSON.stringify(user));
        }
        setUserInfo(user);
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

  // 获取有效的头像 URL（过滤掉无效的 blob URL）
  const getValidAvatarUrl = (avatar: string | undefined): string => {
    if (!avatar) return '';
    // 如果是 blob URL，返回空字符串（让 Avatar 组件显示默认头像）
    if (avatar.startsWith('blob:')) return '';
    // 如果是 base64 或 http/https URL，正常返回
    return avatar;
  };

  // Mock 图片上传（转换为 base64，刷新后仍可显示）
  const mockUpload = async (file: File): Promise<ImageUploadItem> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // 转换为 base64 格式，这样保存到 localStorage 后刷新仍可显示
        const base64Url = e.target?.result as string;
        resolve({ url: base64Url });
      };
      reader.onerror = () => {
        reject(new Error('文件读取失败'));
      };
      reader.readAsDataURL(file); // 读取为 base64
    });
  };

  // 点击编辑按钮
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 阻止冒泡，防止触发外层 header 的点击事件
    if (userInfo) {
      // 过滤掉无效的 blob URL
      const validAvatarUrl = getValidAvatarUrl(userInfo.avatar);
      const avatarFileList = validAvatarUrl ? [{ url: validAvatarUrl }] : [];
      // ✅ 字段对齐：用 username 替换原来的 nickname
      form.setFieldsValue({
        username: userInfo.username,
        avatar: avatarFileList, 
      });
      setEditVisible(true);
    }
  };

  // 保存修改（仅本地）
  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      
      let newAvatarUrl = userInfo.avatar;
      if (values.avatar && values.avatar.length > 0) {
        newAvatarUrl = values.avatar[0].url;
      }

      // 过滤掉无效的 blob URL
      const validAvatarUrl = getValidAvatarUrl(newAvatarUrl);

      // 更新本地用户信息
      const newUser = { 
        ...userInfo, 
        username: values.username,
        avatar: validAvatarUrl 
      };

      setUserInfo(newUser);
      localStorage.setItem('USER_INFO', JSON.stringify(newUser));
      
      Toast.show({ icon: 'success', content: '修改成功' });
      setEditVisible(false);
    } catch (error) {
      console.log('保存失败', error);
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
            src={getValidAvatarUrl(userInfo?.avatar)} 
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