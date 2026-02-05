import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // 初始化时从 localStorage 读取用户信息
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });

  // 登录
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // 登出
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // 检查权限
  const hasPermission = (requiredRole) => {
    if (!user) return false;
    if (!requiredRole) return true;
    
    // 如果是数组，检查用户角色是否在数组中
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    
    return user.role === requiredRole;
  };

  const value = {
    user,
    loading: false,
    login,
    logout,
    hasPermission,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
