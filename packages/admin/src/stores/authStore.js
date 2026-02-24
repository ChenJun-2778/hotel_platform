import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * 认证状态管理 Store
 * 使用 Zustand + 持久化插件
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ========== 状态 ==========
      user: null,
      loading: false,

      // ========== 计算属性 ==========
      isAuthenticated: () => !!get().user,

      // ========== 方法 ==========

      /**
       * 登录
       */
      login: (userData) => {
        set({ user: userData });
        console.log('✅ 用户登录:', userData.username || userData.phone);
      },

      /**
       * 登出
       */
      logout: () => {
        set({ user: null });
        console.log('✅ 用户登出');
      },

      /**
       * 更新用户信息
       */
      updateUser: (userData) => {
        set(state => ({
          user: state.user ? { ...state.user, ...userData } : userData
        }));
        console.log('✅ 用户信息已更新');
      },

      /**
       * 设置加载状态
       */
      setLoading: (loading) => set({ loading }),

      /**
       * 检查权限
       */
      hasPermission: (requiredRole) => {
        const user = get().user;
        if (!user) return false;
        if (!requiredRole) return true;

        // 如果是数组，检查用户角色是否在数组中
        if (Array.isArray(requiredRole)) {
          return requiredRole.includes(user.role);
        }

        return user.role === requiredRole;
      },

      /**
       * 检查是否是管理员
       */
      isAdmin: () => {
        const user = get().user;
        return user?.role === 1 || user?.role_type === 1;
      },

      /**
       * 检查是否是商户
       */
      isMerchant: () => {
        const user = get().user;
        return user?.role === 2 || user?.role_type === 2;
      },
    }),
    {
      name: 'auth-storage', // localStorage 键名
      storage: createJSONStorage(() => localStorage),
      // 只持久化 user，loading 不需要持久化
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);
