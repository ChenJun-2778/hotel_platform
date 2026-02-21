import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * 路由守卫组件 - 保护需要登录和权限才能访问的页面
 * @param {ReactNode} children - 子组件
 * @param {number|number[]} requiredRole - 需要的角色类型 (1=管理员, 2=商户)
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // 如果未登录，重定向到登录页
  if (!isAuthenticated) {
    console.log('❌ 未登录，重定向到登录页');
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 如果指定了需要的角色，检查用户角色
  if (requiredRole !== undefined) {
    const userRole = user?.role_type;
    const hasPermission = Array.isArray(requiredRole)
      ? requiredRole.includes(userRole)
      : userRole === requiredRole;

    if (!hasPermission) {
      console.log('❌ 权限不足，重定向到403页面');
      console.log('用户角色:', userRole, '需要角色:', requiredRole);
      return <Navigate to="/403" replace />;
    }
  }

  // 已登录且有权限，允许访问
  return children;
};

export default ProtectedRoute;
