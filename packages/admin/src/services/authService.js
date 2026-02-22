import { post, put, get } from '../utils/request';
import { AUTH_API } from '../config/api';

/**
 * 账号密码登录
 * @param {object} loginData - 登录数据 { account, password }
 * @returns {Promise}
 */
export const login = (loginData) => {
  const requestData = {
    login_type: 'account',
    account: loginData.account,
    password: loginData.password,
  };
  console.log('🔍 登录请求数据:', requestData);
  return post(AUTH_API.LOGIN, requestData);
};

/**
 * 手机验证码登录
 * @param {object} loginData - 登录数据 { phone, code }
 * @returns {Promise}
 */
export const phoneLogin = (loginData) => {
  return post(AUTH_API.LOGIN, {
    login_type: 'phone',
    phone: loginData.phone,
    code: loginData.code,
  });
};

/**
 * 用户注册
 * @param {object} registerData - 注册数据
 * @returns {Promise}
 */
export const register = (registerData) => {
  return post(AUTH_API.REGISTER, registerData);
};

/**
 * 发送验证码
 * @param {string} phone - 手机号
 * @returns {Promise}
 */
export const sendCode = (phone) => {
  return post(AUTH_API.SEND_CODE, { phone });
};

/**
 * 修改密码
 * @param {number} userId - 用户ID
 * @param {object} passwordData - 密码数据 { oldPassword, newPassword }
 * @returns {Promise}
 */
export const changePassword = (userId, passwordData) => {
  console.log('🔍 修改密码 - userId:', userId);
  console.log('🔍 请求URL:', AUTH_API.CHANGE_PASSWORD(userId));
  
  // 转换为后端要求的字段格式
  const requestData = {
    old_password: passwordData.oldPassword,
    new_password: passwordData.newPassword,
  };
  
  console.log('🔍 发送的密码数据:', { old_password: '***', new_password: '***' });
  return put(AUTH_API.CHANGE_PASSWORD(userId), requestData);
};

/**
 * 获取用户信息
 * @param {number} userId - 用户ID
 * @returns {Promise}
 */
export const getUserInfo = (userId) => {
  console.log('🔍 调用 getUserInfo API - userId:', userId);
  console.log('🔍 请求URL:', AUTH_API.GET_USER_INFO(userId));
  console.log('⚠️ 注意：此接口可能尚未实现，失败时会使用登录信息作为后备');
  return get(AUTH_API.GET_USER_INFO(userId));
};

/**
 * 更新用户信息
 * @param {number} userId - 用户ID
 * @param {object} userData - 用户数据 { username, email, phone, avatar_url }
 * @returns {Promise}
 */
export const updateUserInfo = (userId, userData) => {
  console.log('🔍 更新用户信息 - userId:', userId);
  console.log('🔍 更新数据:', userData);
  return put(AUTH_API.UPDATE_USER_INFO(userId), userData);
};
