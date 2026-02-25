import { get } from '../utils/request';
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
