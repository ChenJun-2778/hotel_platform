import { get, put, post, del } from '../utils/request';
import { API_BASE_URL } from '../config/api';

/**
 * 获取用户列表
 * @param {object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页条数
 * @param {string} params.keyword - 搜索关键词
 * @returns {Promise}
 */
export const getUserList = (params) => {
  return get(`${API_BASE_URL}/userManage/list`, params);
};

/**
 * 更新用户信息
 * @param {number} id - 用户ID
 * @param {object} data - 用户数据
 * @param {string} data.email - 邮箱
 * @param {string} data.phone - 手机号
 * @param {number} data.role_type - 角色类型（1-管理员，2-商户）
 * @param {number} data.status - 状态（1-正常，0-禁用）
 * @returns {Promise}
 */
export const updateUser = (id, data) => {
  return put(`${API_BASE_URL}/userManage/${id}`, data);
};

/**
 * 添加用户
 * @param {object} data - 用户数据
 * @returns {Promise}
 */
export const createUser = (data) => {
  return post(`${API_BASE_URL}/userManage`, data);
};

/**
 * 删除用户
 * @param {number} id - 用户ID
 * @returns {Promise}
 */
export const deleteUser = (id) => {
  return del(`${API_BASE_URL}/userManage/${id}`);
};
