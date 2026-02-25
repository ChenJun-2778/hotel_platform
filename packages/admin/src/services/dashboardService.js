import { get } from '../utils/request';
import { API_BASE_URL } from '../config/api';

/**
 * 获取商户控制台数据
 * @param {number} userId - 商家用户ID
 * @returns {Promise}
 */
export const getMerchantDashboard = (userId) => {
  return get(`${API_BASE_URL}/controlPC/dashboard`, { userId });
};

/**
 * 获取管理员控制台数据
 * @returns {Promise}
 */
export const getAdminDashboard = () => {
  return get(`${API_BASE_URL}/controlManage/dashboard`);
};
