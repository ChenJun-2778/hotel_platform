import { get, post, put } from '../utils/request';
import { HOTEL_API } from '../config/api';

/**
 * 创建酒店
 * @param {object} hotelData - 酒店数据
 * @returns {Promise}
 */
export const createHotel = (hotelData) => {
  return post(HOTEL_API.CREATE, hotelData);
};

/**
 * 获取酒店列表
 * @param {object} params - 查询参数
 * @param {number} params.page - 页码（可选，默认1）
 * @param {number} params.pageSize - 每页数量（可选，默认10）
 * @param {string} params.keyword - 搜索关键词（可选）
 * @param {number} params.user_id - 用户ID（可选，用于获取指定用户的酒店）
 * @returns {Promise}
 */
export const getHotelList = (params = {}) => {
  console.log('🔍 获取酒店列表 - 参数:', params);
  return get(HOTEL_API.LIST, params);
};

/**
 * 获取酒店详情
 * @param {string|number} id - 酒店ID
 * @returns {Promise}
 */
export const getHotelDetail = (id) => {
  return get(HOTEL_API.DETAIL(id));
};

/**
 * 更新酒店信息
 * @param {string|number} id - 酒店ID
 * @param {object} hotelData - 更新的酒店数据
 * @returns {Promise}
 */
export const updateHotel = (id, hotelData) => {
  return put(HOTEL_API.UPDATE(id), hotelData);
};

/**
 * 更新酒店状态（已废弃，使用 putUpHotel 和 takeDownHotel 代替）
 * @param {string|number} id - 酒店ID
 * @param {number} status - 状态值
 * @returns {Promise}
 */
export const updateHotelStatus = (id, status) => {
  return put(HOTEL_API.UPDATE_STATUS(id), { status });
};

/**
 * 上架酒店
 * @param {string|number} id - 酒店ID
 * @returns {Promise}
 */
export const putUpHotel = (id) => {
  return put(HOTEL_API.PUT_UP(id));
};

/**
 * 下架酒店
 * @param {string|number} id - 酒店ID
 * @returns {Promise}
 */
export const takeDownHotel = (id) => {
  return put(HOTEL_API.TAKE_DOWN(id));
};

/**
 * 审核通过酒店
 * @param {string|number} id - 酒店ID
 * @returns {Promise}
 */
export const approveHotel = (id) => {
  return put(HOTEL_API.APPROVE(id));
};

/**
 * 审核拒绝酒店
 * @param {string|number} id - 酒店ID
 * @param {string} reason - 拒绝原因
 * @returns {Promise}
 */
export const rejectHotel = (id, reason) => {
  return put(HOTEL_API.REJECT(id), { rejection_reason: reason });
};

/**
 * 获取酒店审核列表
 * @param {object} params - 查询参数
 * @param {number} params.page - 页码（可选，默认1）
 * @param {number} params.pageSize - 每页数量（可选，默认10）
 * @param {number} params.status - 状态筛选（可选）：0-已下架，1-营业中，2-待审批，3-审批拒绝
 * @returns {Promise}
 */
export const getHotelAuditList = (params = {}) => {
  console.log('🔍 获取酒店审核列表 - 参数:', params);
  return get(HOTEL_API.AUDIT_LIST, params);
};
