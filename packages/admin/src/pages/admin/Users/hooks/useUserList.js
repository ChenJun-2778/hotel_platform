import { useState, useCallback } from 'react';
import { message } from 'antd';

/**
 * 用户列表管理 Hook
 */
const useUserList = () => {
  const [users, setUsers] = useState(mockUsers);
  const [loading, setLoading] = useState(false);

  /**
   * 搜索用户
   */
  const searchUsers = useCallback((keyword) => {
    if (!keyword) {
      setUsers(mockUsers);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const filtered = mockUsers.filter(user => 
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase())
      );
      setUsers(filtered);
      setLoading(false);
    }, 300);
  }, []);

  /**
   * 添加用户
   */
  const addUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      // TODO: 调用后端 API
      // await createUserAPI(userData);
      
      // 模拟添加
      setTimeout(() => {
        const newUser = {
          key: String(users.length + 1),
          id: users.length + 1,
          ...userData,
          createdAt: new Date().toLocaleString('zh-CN'),
        };
        setUsers(prev => [newUser, ...prev]);
        message.success('用户添加成功！');
        setLoading(false);
      }, 500);
      
      return true;
    } catch (error) {
      console.error('❌ 添加用户失败:', error.message);
      message.error('添加用户失败，请重试');
      setLoading(false);
      return false;
    }
  }, [users.length]);

  /**
   * 更新用户
   */
  const updateUser = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      // TODO: 调用后端 API
      // await updateUserAPI(userId, userData);
      
      // 模拟更新
      setTimeout(() => {
        setUsers(prev => prev.map(user => 
          user.key === userId ? { ...user, ...userData } : user
        ));
        message.success('用户更新成功！');
        setLoading(false);
      }, 500);
      
      return true;
    } catch (error) {
      console.error('❌ 更新用户失败:', error.message);
      message.error('更新用户失败，请重试');
      setLoading(false);
      return false;
    }
  }, []);

  /**
   * 删除用户
   */
  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      // TODO: 调用后端 API
      // await deleteUserAPI(userId);
      
      // 模拟删除
      setTimeout(() => {
        setUsers(prev => prev.filter(user => user.key !== userId));
        message.success('用户删除成功！');
        setLoading(false);
      }, 500);
      
      return true;
    } catch (error) {
      console.error('❌ 删除用户失败:', error.message);
      message.error('删除用户失败，请重试');
      setLoading(false);
      return false;
    }
  }, []);

  return {
    users,
    loading,
    searchUsers,
    addUser,
    updateUser,
    deleteUser,
  };
};

// 模拟数据
const mockUsers = [
  {
    key: '1',
    id: 1,
    username: 'admin',
    role: 'admin',
    email: 'admin@example.com',
    phone: '13800138000',
    status: 'active',
    createdAt: '2026-01-15 10:30:00',
  },
  {
    key: '2',
    id: 2,
    username: 'merchant1',
    role: 'merchant',
    email: 'merchant1@example.com',
    phone: '13900139000',
    status: 'active',
    createdAt: '2026-01-20 14:20:00',
  },
  {
    key: '3',
    id: 3,
    username: 'merchant2',
    role: 'merchant',
    email: 'merchant2@example.com',
    phone: '13700137000',
    status: 'active',
    createdAt: '2026-02-01 09:15:00',
  },
  {
    key: '4',
    id: 4,
    username: 'testuser',
    role: 'merchant',
    email: 'test@example.com',
    phone: '13600136000',
    status: 'inactive',
    createdAt: '2026-02-05 16:45:00',
  },
];

export default useUserList;
