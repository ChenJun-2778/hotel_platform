import { get, put } from '../utils/request';
import { ORDER_API } from '../config/api';

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
