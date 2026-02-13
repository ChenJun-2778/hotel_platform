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
 * @param {object} params - 查询参数（可选）
 * @returns {Promise}
 */
export const getHotelList = (params) => {
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
 * 更新酒店状态
 * @param {string|number} id - 酒店ID
 * @param {number} status - 状态值
 * @returns {Promise}
 */
export const updateHotelStatus = (id, status) => {
  return put(HOTEL_API.UPDATE_STATUS(id), { status });
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
 * @param {string} reason - 拒绝原因（可选）
 * @returns {Promise}
 */
export const rejectHotel = (id, reason) => {
  return put(HOTEL_API.REJECT(id), { reason });
};
