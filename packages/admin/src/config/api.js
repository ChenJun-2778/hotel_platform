// API 基础配置
export const API_BASE_URL = 'http://47.99.56.81:3000/api';

// 酒店相关接口
export const HOTEL_API = {
  CREATE: `${API_BASE_URL}/hotels/create`,      // POST - 创建酒店
  LIST: `${API_BASE_URL}/hotels/list`,          // GET - 获取酒店列表
  DETAIL: (id) => `${API_BASE_URL}/hotels/${id}`, // GET - 获取酒店详情
  UPDATE: (id) => `${API_BASE_URL}/hotels/${id}`, // PUT - 更新酒店信息
  UPDATE_STATUS: (id) => `${API_BASE_URL}/hotels/${id}/status`, // PUT - 更新酒店状态
};

// 房间相关接口（预留）
export const ROOM_API = {
  // TODO: 后续添加房间接口
};
