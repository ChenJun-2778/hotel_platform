import React from 'react';
import { Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { useAuth } from '../contexts/AuthContext';

// 开发模式标志
const DEV_MODE = true; // 开发时设为 true，生产时设为 false

// 开发模式下的模拟用户
const DEV_USER = {
  username: 'dev_admin',
  role: 'admin', // 可以改为 'merchant' 测试商户页面
  email: 'dev@example.com',
};

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading, hasPermission, login } = useAuth();

  // 开发模式：自动使用模拟用户
  if (DEV_MODE && !user) {
    login(DEV_USER);
  }

  // 加载中显示 loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  // 开发模式：跳过登录检查
  if (DEV_MODE) {
    // 仍然检查角色权限
    if (requiredRole && !hasPermission(requiredRole)) {
      return <Navigate to="/403" replace />;
    }
    return children;
  }

  // 生产模式：正常的权限检查
  // 未登录，重定向到登录页
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 已登录但无权限，重定向到403页面
  if (requiredRole && !hasPermission(requiredRole)) {
    return <Navigate to="/403" replace />;
  }

  // 有权限，渲染子组件
  return children;
};

export default ProtectedRoute;
