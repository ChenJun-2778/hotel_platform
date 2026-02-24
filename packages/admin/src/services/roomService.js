import { get, post, put, del } from '../utils/request';
import { ROOM_API } from '../config/api';

/**
 * 创建房间
 * @param {object} roomData - 房间数据
 * @returns {Promise}
 */
export const createRoom = async (roomData) => {
  console.log('📝 创建房间 - 提交数据:', JSON.stringify(roomData, null, 2));
  console.log('📝 提交字段列表:', Object.keys(roomData));
  const response = await post(ROOM_API.CREATE, roomData);
  console.log('✅ 创建房间成功 - 后端响应:', JSON.stringify(response, null, 2));
  return response;
};

/**
 * 获取房间列表
 * @param {object} params - 查询参数（可选）
 * @returns {Promise}
 */
export const getRoomList = async (params) => {
  console.log('🔍 获取房间列表 - 参数:', params);
  const response = await get(ROOM_API.LIST, params);
  console.log('📦 后端返回的房间列表原始数据:', JSON.stringify(response, null, 2));
  
  const rooms = response.data?.rooms || response.rooms || [];
  if (rooms.length > 0) {
    console.log('📦 第一个房间的所有字段:', Object.keys(rooms[0]));
    console.log('📦 第一个房间的完整数据:', JSON.stringify(rooms[0], null, 2));
    console.log('📦 所有房间的基本信息:', rooms.map(r => ({
      id: r.id,
      room_number: r.room_number,
      room_type: r.room_type,
      total_rooms: r.total_rooms,
      status: r.status
    })));
  } else {
    console.log('⚠️ 房间列表为空');
  }
  
  return response;
};

/**
 * 获取房间详情
 * @param {string|number} id - 房间ID
 * @returns {Promise}
 */
export const getRoomDetail = async (id) => {
  console.log(`🔍 获取房间详情 - ID: ${id}`);
  const response = await get(ROOM_API.DETAIL, { id });
  console.log('📦 后端返回的房间详情原始数据:', JSON.stringify(response, null, 2));
  
  const roomData = response.data || response;
  if (roomData) {
    console.log('📦 房间详情的所有字段:', Object.keys(roomData));
    console.log('📦 房间详情的完整数据:', JSON.stringify(roomData, null, 2));
  }
  
  return response;
};

/**
 * 更新房间信息
 * @param {string|number} id - 房间ID
 * @param {object} roomData - 更新的房间数据
 * @returns {Promise}
 */
export const updateRoom = async (id, roomData) => {
  console.log(`📝 更新房间 - ID: ${id}`);
  console.log('📝 更新数据:', JSON.stringify(roomData, null, 2));
  console.log('📝 更新字段列表:', Object.keys(roomData));
  const response = await put(ROOM_API.UPDATE, { id, ...roomData });
  console.log('✅ 更新房间成功 - 后端响应:', JSON.stringify(response, null, 2));
  return response;
};

/**
 * 删除房间
 * @param {string|number} id - 房间ID
 * @returns {Promise}
 */
export const deleteRoom = async (id) => {
  console.log(`🗑️ 删除房间 - ID: ${id}`);
  const response = await del(ROOM_API.DELETE, { id });
  console.log('✅ 删除房间成功 - 后端响应:', JSON.stringify(response, null, 2));
  return response;
};
