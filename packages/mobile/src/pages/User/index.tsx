import React, { useState, useEffect } from 'react';
import { NavBar, Avatar, List, Button, Modal, Toast, TabBar, Dialog } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom'; 
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
  // const location = useLocation(); // 暂时用不到 location，先注释掉
  const [userInfo, setUserInfo] = useState<any>(null);

  // ✅ 1. 控制退出弹窗的开关
  const [logoutVisible, setLogoutVisible] = useState(false);

  // 进页面检查本地缓存
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

  // ✅ 2. 核心退出逻辑 (带动画)
  const performLogout = async () => {
    // A. 关闭确认弹窗
    setLogoutVisible(false);

    // B. 显示加载动画 (模拟网络请求/清理过程)
    Toast.show({
      icon: 'loading',
      content: '正在退出...',
      duration: 0, // 设为 0 表示不自动关闭，必须手动 close
    });

    // 模拟一个短暂的延迟 (500ms)，让动画展示一会儿，体验更丝滑
    await new Promise(resolve => setTimeout(resolve, 500));

    // C. 清除数据
    localStorage.removeItem('TOKEN');
    localStorage.removeItem('USER_INFO');

    // D. 清空状态 -> 界面会自动变回 "未登录" 样式
    setUserInfo(null);

    // E. 关闭 Loading，提示成功
    Toast.clear();
    Toast.show({ icon: 'success', content: '已退出' });

    // F. 不需要 navigate跳转，就停在当前页
  };

  // 点击头部：没登录跳去登录
  const handleHeaderClick = () => {
    if (!userInfo) {
      navigate('/login');
    }
  };

  // TabBar 路由跳转逻辑
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
            // 登录了显示这个
            <>
              <div className={styles.nickname}>{userInfo.nickname}</div>
              <div className={styles.userId} style={{opacity: 0.6}}>普通用户</div>
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
          <Button block color='danger' onClick={() => setLogoutVisible(true)}>
            退出登录
          </Button>
        </div>
      )}

      {/* ✅ 确认弹窗 (使用 Dialog 组件) */}
      <Dialog
        visible={logoutVisible}
        content='确定要退出登录吗？'
        closeOnAction
        onClose={() => setLogoutVisible(false)}
        actions={[
          [
            {
              key: 'cancel',
              text: '取消',
              onClick: () => setLogoutVisible(false),
            },
            {
              key: 'confirm',
              text: '退出',
              danger: true,
              bold: true,
              onClick: performLogout, // 触发带动画的退出
            },
          ],
        ]}
      />
    </div>
  );
};

export default User;