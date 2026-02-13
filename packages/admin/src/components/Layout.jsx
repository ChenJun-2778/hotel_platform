import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout as AntLayout, Menu, Dropdown, Avatar } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { adminMenus, merchantMenus } from '../config/menus';
import './Layout.css';

const { Header, Sider, Content } = AntLayout;

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // TODO: 后续根据用户角色动态获取菜单
  // 暂时根据路径判断使用哪个菜单
  const isAdmin = location.pathname.startsWith('/admin');
  const menus = isAdmin ? adminMenus : merchantMenus;
  const roleText = isAdmin ? '管理端' : '商户端';

  // 处理登出
  const handleLogout = () => {
    // TODO: 后续添加登出逻辑
    navigate('/login');
  };

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }) => {
    if (key === 'profile') {
      // 根据角色跳转到对应的个人信息页面
      const profilePath = isAdmin ? '/admin/profile' : '/merchant/profile';
      navigate(profilePath);
    } else if (key === 'logout') {
      handleLogout();
    }
  };

  // 用户下拉菜单
  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
    },
  ];

  // 转换菜单配置为 Ant Design Menu 格式
  const menuItems = menus.map(menu => {
    if (menu.children) {
      // 有子菜单
      return {
        key: menu.key,
        icon: React.createElement(menu.icon),
        label: menu.label,
        children: menu.children.map(child => ({
          key: child.key,
          icon: React.createElement(child.icon),
          label: <Link to={child.path}>{child.label}</Link>,
        })),
      };
    }
    // 无子菜单
    return {
      key: menu.key,
      icon: React.createElement(menu.icon),
      label: <Link to={menu.path}>{menu.label}</Link>,
    };
  });

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo">
          <h2>易宿酒店</h2>
          <p>{roleText}</p>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>
      <AntLayout style={{ marginLeft: 200 }}>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 1px 4px rgba(0,21,41,.08)',
          position: 'fixed',
          top: 0,
          right: 0,
          left: 200,
          zIndex: 999,
        }}>
          <div style={{ fontSize: '18px', fontWeight: 500 }}>
            {menus.find(m => m.path === location.pathname)?.label || '首页'}
          </div>
          <Dropdown 
            menu={{ items: userMenuItems, onClick: handleUserMenuClick }} 
            placement="bottomRight"
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Avatar icon={<UserOutlined />} />
              <span>开发模式</span>
            </div>
          </Dropdown>
        </Header>
        <Content style={{ margin: '88px 16px 24px', overflow: 'initial' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
