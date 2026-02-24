import { useAuthStore } from '../stores/authStore';

export const usePermission = () => {
  const user = useAuthStore(state => state.user);
  const hasPermission = useAuthStore(state => state.hasPermission);

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
