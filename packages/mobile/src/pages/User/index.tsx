import React, { useState, useEffect } from 'react';
import { NavBar, Avatar, List, Button, Dialog, Toast, ImageUploader, Form, Input } from 'antd-mobile'; // 👈 1. 引入 Form, Input
import { useNavigate } from 'react-router-dom';
import { 
  UnorderedListOutline, 
  RightOutline,
  SetOutline,
  EditSOutline // 👈 2. 引入编辑图标
} from 'antd-mobile-icons';
import styles from './index.module.css';

type ImageUploadItem = {
  url: string;
  thumbnail?: string;
}

const User: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  
  // 控制退出弹窗
  const [logoutVisible, setLogoutVisible] = useState(false);

  // ✅ 3. 新增：控制“修改信息”弹窗
  const [editVisible, setEditVisible] = useState(false);
  const [form] = Form.useForm(); // 创建表单实例

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
  // 在真实项目中，这里会调用 apiUpload(file) 把图片传给服务器，然后返回 http://... 的链接
  const mockUpload = async (file: File): Promise<ImageUploadItem> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        // 模拟延时，假装在上传
        setTimeout(() => {
          resolve({
            url: e.target?.result as string, // 这里拿到的是 base64
          });
        }, 500);
      };
      reader.readAsDataURL(file);
    });
  };

  // 点击编辑按钮
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (userInfo) {
      // 构造 ImageUploader 需要的 fileList 格式: [{ url: '...' }]
      const avatarFileList = userInfo.avatar ? [{ url: userInfo.avatar }] : [];

      form.setFieldsValue({
        nickname: userInfo.nickname,
        avatar: avatarFileList, // 把数组传给上传组件
      });
      setEditVisible(true);
    }
  };

  // 保存修改
  const handleSaveProfile = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理头像数据：values.avatar 是一个数组，我们需要取出第一张图的 url
      let newAvatarUrl = '';
      if (values.avatar && values.avatar.length > 0) {
        newAvatarUrl = values.avatar[0].url;
      }

      // 构造新的用户信息
      const newUser = { 
        ...userInfo, 
        nickname: values.nickname,
        avatar: newAvatarUrl 
      };

      setUserInfo(newUser);
      localStorage.setItem('USER_INFO', JSON.stringify(newUser));
      
      Toast.show({ icon: 'success', content: '修改成功' });
      setEditVisible(false);
    } catch (error) {
      console.log('验证失败', error);
    }
  };

  const performLogout = async () => {
    setLogoutVisible(false);
    Toast.show({ icon: 'loading', content: '正在退出...', duration: 0 });
    await new Promise(resolve => setTimeout(resolve, 500));
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('USER_INFO');
    setUserInfo(null);
    Toast.clear();
    Toast.show({ icon: 'success', content: '已退出' });
  };

  const handleHeaderClick = () => {
    if (!userInfo) {
      navigate('/login');
    }
  };

  const handleTabChange = (key: string) => {
    if (key === 'home') navigate('/');
    if (key === 'order') navigate('/order-list'); 
    if (key === 'user') navigate('/user');
  };

  return (
    <div className={styles.container}>
      <NavBar back={null} style={{ background: '#fff' }}>个人中心</NavBar>

      {/* 头部区域 */}
      <div className={styles.header} onClick={handleHeaderClick}>
        <Avatar 
            src={userInfo?.avatar || ''} 
            style={{ '--size': '64px', '--border-radius': '50%' }} 
        />
        
        <div className={styles.userInfo}>
          {userInfo ? (
            <>
              {/* ✅ 4. 这里稍微改了一下结构，为了放编辑图标 */}
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className={styles.nickname}>{userInfo.nickname}</div>
                <EditSOutline 
                  style={{ marginLeft: 8, color: '#666', fontSize: 16, cursor: 'pointer' }} 
                  onClick={handleEditClick}
                />
              </div>
              <div className={styles.userId} style={{opacity: 0.6}}>普通用户</div>
            </>
          ) : (
            <>
              <div className={styles.loginTip}>点击登录/注册</div>
              <div className={styles.subTip}>登录后查看订单</div>
            </>
          )}
        </div>
        
        <RightOutline color='#ccc' />
      </div>

      <List>
        <List.Item 
          prefix={<UnorderedListOutline color='#1677ff' />} 
          onClick={() => {
            if (!userInfo) return navigate('/login');
            navigate('/order-list'); 
          }}
          extra={<RightOutline />}
        >
          我的订单
        </List.Item>
        
        <List.Item 
          prefix={<SetOutline />} 
          onClick={() => Toast.show('暂未开发')}
          extra={<RightOutline />}
        >
          设置
        </List.Item>
      </List>

      {userInfo && (
        <div className={styles.logoutSection}>
          <Button block color='danger' onClick={() => setLogoutVisible(true)}>
            退出登录
          </Button>
        </div>
      )}

      {/* 退出确认弹窗 */}
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

      {/* ✅ 5. 新增：编辑信息的弹窗 */}
      <Dialog
        visible={editVisible}
        title="修改信息"
        content={
          <Form form={form} layout='horizontal' footer={null}>
            <Form.Item 
              name='nickname' 
              label='昵称' 
              rules={[{ required: true, message: '昵称不能为空' }]}
            >
              <Input placeholder='请输入昵称' clearable />
            </Form.Item>
            
            <Form.Item 
              name='avatar' 
              label='头像'
              // ImageUploader 放在这里
            >
              <ImageUploader
                maxCount={1} // 限制只能传一张
                upload={mockUpload} // 绑定模拟上传函数
                onDelete={() => {
                  return Dialog.confirm({ content: '确定删除头像吗？' })
                }}
              />
            </Form.Item>
          </Form>
        }
        actions={[
          [
            {
              key: 'cancel',
              text: '取消',
              onClick: () => setEditVisible(false),
            },
            {
              key: 'confirm',
              text: '保存',
              bold: true,
              style: { color: '#1677ff' },
              onClick: handleSaveProfile,
            },
          ]
        ]}
      />
    </div>
  );
};

export default User;