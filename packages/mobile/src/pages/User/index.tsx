import React, { useState, useEffect } from 'react';
import { NavBar, Avatar, List, Button, Modal, Toast, TabBar } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { 
  UnorderedListOutline, 
  RightOutline,
  AppOutline,
  UserOutline,
  SetOutline
} from 'antd-mobile-icons';
import styles from './index.module.css';

const User: React.FC = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);

  // 1. 进页面检查本地缓存
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

  // 2. 退出登录逻辑
  const handleLogout = () => {
    Modal.confirm({
      content: '确定要退出登录吗？',
      onConfirm: () => {
        // 清除 Token 和用户信息
        localStorage.removeItem('TOKEN');
        localStorage.removeItem('USER_INFO');
        
        setUserInfo(null);
        Toast.show('已退出');
        // 这里的逻辑看你需求：退出后是留在当前页变回“未登录”状态，还是跳去登录页？
        // 这里默认是留在当前页
      },
    });
  };

  // 3. 点击头部：没登录跳去登录
  const handleHeaderClick = () => {
    if (!userInfo) {
      navigate('/login');
    }
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
            // 登录了显示这个
            <>
              <div className={styles.nickname}>{userInfo.nickname}</div>
              <div className={styles.userId}>普通用户</div>
            </>
          ) : (
            // 没登录显示这个
            <>
              <div className={styles.loginTip}>点击登录/注册</div>
              <div className={styles.subTip}>登录后查看订单</div>
            </>
          )}
        </div>
        
        <RightOutline color='#ccc' />
      </div>

      {/* 简单列表 */}
      <List>
        <List.Item 
          prefix={<UnorderedListOutline color='#1677ff' />} 
          onClick={() => {
            // 如果没登录，点击订单也跳去登录
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

      {/* 退出按钮：只有登录了才显示 */}
      {userInfo && (
        <div className={styles.logoutSection}>
          <Button block color='danger' onClick={handleLogout}>
            退出登录
          </Button>
        </div>
      )}

      {/* 底部 TabBar */}
      <div className={styles.bottomTabBar}>
        <TabBar activeKey='user' onChange={key => navigate(key === 'home' ? '/' : '/user')}>
          <TabBar.Item key='home' icon={<AppOutline />} title='首页' />
          <TabBar.Item key='order' icon={<UnorderedListOutline />} title='订单' />
          <TabBar.Item key='user' icon={<UserOutline />} title='我的' />
        </TabBar>
      </div>
    </div>
  );
};

export default User;