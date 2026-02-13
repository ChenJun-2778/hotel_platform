import { get, post, put, del } from '../utils/request';
import { ROOM_API } from '../config/api';

/**
 * 创建房间
 * @param {object} roomData - 房间数据
 * @returns {Promise}
 */
export const createRoom = (roomData) => {
  return post(ROOM_API.CREATE, roomData);
};

/**
 * 获取房间列表
 * @param {object} params - 查询参数（可选）
 * @returns {Promise}
 */
export const getRoomList = (params) => {
  return get(ROOM_API.LIST, params);
};

/**
 * 获取房间详情
 * @param {string|number} id - 房间ID
 * @returns {Promise}
 */
export const getRoomDetail = (id) => {
  return get(ROOM_API.DETAIL, { id });
};

/**
 * 更新房间信息
 * @param {string|number} id - 房间ID
 * @param {object} roomData - 更新的房间数据
 * @returns {Promise}
 */
export const updateRoom = (id, roomData) => {
  return put(ROOM_API.UPDATE, { id, ...roomData });
};

/**
 * 删除房间
 * @param {string|number} id - 房间ID
 * @returns {Promise}
 */
export const deleteRoom = (id) => {
  return del(ROOM_API.DELETE, { id });
};
