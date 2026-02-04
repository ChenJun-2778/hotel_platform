import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="logo">
          <h2>易宿酒店</h2>
        </div>
        <nav className="menu">
          <Link to="/home" className="menu-item">首页</Link>
          <Link to="/home/hotels" className="menu-item">酒店列表</Link>
          <Link to="/home/hotel-detail" className="menu-item">酒店详情</Link>
          <Link to="/home/hotel-manage" className="menu-item">酒店信息管理</Link>
          <Link to="/home/hotel-audit" className="menu-item">酒店审核管理</Link>
        </nav>
      </aside>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
