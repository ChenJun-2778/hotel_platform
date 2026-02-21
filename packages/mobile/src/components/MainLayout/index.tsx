import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { TabBar } from 'antd-mobile';
import { 
  AppOutline, 
  UnorderedListOutline, 
  UserOutline 
} from 'antd-mobile-icons';

import styles from './index.module.css';

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname } = location;

  // 1. 根据当前路径，计算 TabBar 应该高亮哪个图标
  const activeKey = () => {
    if (pathname === '/') return 'home';
    if (pathname.startsWith('/order-list')) return 'order';
    if (pathname.startsWith('/user')) return 'user';
    return 'home';
  };

  // 2. 处理 Tab 切换跳转
  const handleTabChange = (key: string) => {
    if (key === 'home') navigate('/');
    if (key === 'order') navigate('/order-list');
    if (key === 'user') navigate('/user');
  };

  return (
    <div className={styles.layoutContainer}>
      {/* ✅ Outlet 是 React Router 的占位符 
         它代表了当前匹配到的子路由组件 (Home, OrderList, 或 User)
      */}
      <Outlet />

      {/* ✅ 公共的底部导航 */}
      <div className={styles.bottomTabBar}>
        <TabBar activeKey={activeKey()} onChange={handleTabChange}>
          <TabBar.Item key='home' icon={<AppOutline />} title='首页' />
          <TabBar.Item key='order' icon={<UnorderedListOutline />} title='订单' />
          <TabBar.Item key='user' icon={<UserOutline />} title='我的' />
        </TabBar>
      </div>
    </div>
  );
};

export default MainLayout;