import React from 'react';

// TODO: 后续添加路由守卫和权限验证逻辑

const ProtectedRoute = ({ children }) => {
  // 暂时直接返回子组件，不做任何权限检查
  return children;
};

export default ProtectedRoute;
