import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * 根路径智能重定向组件
 * 根据用户登录状态和角色自动跳转到对应页面
 */
const RootRedirect = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated());
  const user = useAuthStore(state => state.user);

  // 未登录，跳转到登录页
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 已登录，根据角色跳转
  if (user?.role_type === 1) {
    return <Navigate to="/admin/dashboard" replace />;
  } else if (user?.role_type === 2) {
    return <Navigate to="/merchant/dashboard" replace />;
  }

  // 默认跳转到登录页
  return <Navigate to="/login" replace />;
};

export default RootRedirect;
