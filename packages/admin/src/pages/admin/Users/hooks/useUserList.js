import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { getUserList, updateUser as updateUserAPI, createUser as createUserAPI, deleteUser as deleteUserAPI } from '../../../../services/userService';

/**
 * 用户列表管理 Hook
 */
const useUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 加载用户列表
   */
  const loadUserList = useCallback(async (page = pagination.current, pageSize = pagination.pageSize, keyword = searchKeyword) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
      };
      
      if (keyword) {
        params.keyword = keyword;
      }
      
      console.log('📋 加载用户列表 - 参数:', params);
      const response = await getUserList(params);
      console.log('✅ 用户列表数据:', response);
      
      const data = response.data || response;
      const userList = data.list || [];
      const paginationData = data.pagination || {};
      
      // 确保每条数据都有唯一的 key
      const usersWithKey = userList.map((user, index) => ({
        ...user,
        key: user.id || user.user_id || `user-${index}`,
      }));
      
      setUsers(usersWithKey);
      setPagination({
        current: paginationData.page || page,
        pageSize: paginationData.pageSize || pageSize,
        total: paginationData.total || usersWithKey.length,
      });
      
      console.log('✅ 加载完成，共', usersWithKey.length, '条数据');
    } catch (error) {
      console.error('❌ 加载用户列表失败:', error);
      message.error('加载用户列表失败，请重试');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchKeyword]);

  /**
   * 搜索用户
   */
  const searchUsers = useCallback((keyword) => {
    console.log('🔍 搜索用户 - 关键词:', keyword);
    setSearchKeyword(keyword);
    loadUserList(1, pagination.pageSize, keyword);
  }, [loadUserList, pagination.pageSize]);

  /**
   * 分页变化
   */
  const handlePageChange = useCallback((page, pageSize) => {
    console.log('📄 分页变化 - 页码:', page, '每页数量:', pageSize);
    loadUserList(page, pageSize, searchKeyword);
  }, [loadUserList, searchKeyword]);

  /**
   * 添加用户
   */
  const addUser = useCallback(async (userData) => {
    try {
      setLoading(true);
      
      console.log('➕ 添加用户 - 数据:', userData);
      await createUserAPI(userData);
      
      message.success('用户添加成功！');
      await loadUserList(); // 重新加载列表
      return true;
    } catch (error) {
      console.error('❌ 添加用户失败:', error);
      message.error(error.message || '添加用户失败，请重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadUserList]);

  /**
   * 更新用户
   */
  const updateUser = useCallback(async (userId, userData) => {
    try {
      setLoading(true);
      
      // 只提交允许修改的字段
      const submitData = {
        email: userData.email || '',
        phone: userData.phone || '',
        role_type: userData.role_type,
        status: userData.status,
      };
      
      console.log('✏️ 更新用户 - ID:', userId, '数据:', submitData);
      await updateUserAPI(userId, submitData);
      
      message.success('用户更新成功！');
      await loadUserList(); // 重新加载列表
      return true;
    } catch (error) {
      console.error('❌ 更新用户失败:', error);
      message.error(error.message || '更新用户失败，请重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadUserList]);

  /**
   * 删除用户
   */
  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      
      console.log('🗑️ 删除用户 - ID:', userId);
      await deleteUserAPI(userId);
      
      message.success('用户删除成功！');
      await loadUserList(); // 重新加载列表
      return true;
    } catch (error) {
      console.error('❌ 删除用户失败:', error);
      message.error(error.message || '删除用户失败，请重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadUserList]);

  // 组件加载时获取列表
  useEffect(() => {
    loadUserList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    users,
    loading,
    pagination,
    searchUsers,
    handlePageChange,
    addUser,
    updateUser,
    deleteUser,
  };
};

export default useUserList;
