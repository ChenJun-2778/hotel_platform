import { get, put } from '../utils/request';
import { ORDER_API, API_BASE_URL } from '../config/api';

/**
 * 获取订单列表
 * @param {object} params - 查询参数
 * @returns {Promise}
 */
export const getOrderList = (params) => {
  return get(ORDER_API.LIST, params);
};

/**
 * 获取订单详情
 * @param {string} orderNo - 订单号
 * @returns {Promise}
 */
export const getOrderDetail = (orderNo) => {
  return get(ORDER_API.DETAIL, { order_no: orderNo });
};

/**
 * 确认订单并分配房间
 * @param {string} orderNo - 订单号
 * @param {string} roomNumber - 房间号
 * @returns {Promise}
 */
export const confirmOrder = (orderNo, roomNumber) => {
  return put(ORDER_API.CONFIRM(orderNo), { 
    assigned_room_no: roomNumber 
  });
};

/**
 * 获取日历视图数据
 * @param {object} params - 查询参数
 * @param {number} params.user_id - 用户ID
 * @param {string} params.date - 查询日期 YYYY-MM-DD
 * @param {number} params.hotel_id - 酒店ID（可选）
 * @returns {Promise}
 */
export const getCalendarData = (params) => {
  return get(`${API_BASE_URL}/controlPC/calendar`, params);
};
