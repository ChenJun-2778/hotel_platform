import { useAuth } from '../contexts/AuthContext';

export const usePermission = () => {
  const { user, hasPermission } = useAuth();

  const checkPermission = (requiredRole) => {
    return hasPermission(requiredRole);
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isMerchant = () => {
    return user?.role === 'merchant';
  };

  return {
    checkPermission,
    isAdmin,
    isMerchant,
    userRole: user?.role,
  };
};
