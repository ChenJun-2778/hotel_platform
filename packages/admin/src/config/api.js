// API 基础配置
export const API_BASE_URL = 'http://47.99.56.81:3000/api';

// 酒店相关接口
export const HOTEL_API = {
  CREATE: `${API_BASE_URL}/hotels/create`,      // POST - 创建酒店
  LIST: `${API_BASE_URL}/hotels/list`,          // GET - 获取酒店列表
  DETAIL: (id) => `${API_BASE_URL}/hotels/${id}`, // GET - 获取酒店详情
  UPDATE: (id) => `${API_BASE_URL}/hotels/${id}`, // PUT - 更新酒店信息
  UPDATE_STATUS: (id) => `${API_BASE_URL}/hotels/${id}/status`, // PUT - 更新酒店状态
  APPROVE: (id) => `${API_BASE_URL}/hotels/${id}/approve`, // PUT - 审核通过
  REJECT: (id) => `${API_BASE_URL}/hotels/${id}/reject`,   // PUT - 审核拒绝
};

// 房间相关接口
export const ROOM_API = {
  CREATE: `${API_BASE_URL}/rooms/create`,       // POST - 创建房间
  LIST: `${API_BASE_URL}/rooms/list`,           // GET - 获取房间列表
  DETAIL: `${API_BASE_URL}/rooms/detail`,       // GET - 获取房间详情 (Query: id)
  UPDATE: `${API_BASE_URL}/rooms/update`,       // PUT - 更新房间信息 (Body: id + data)
  DELETE: `${API_BASE_URL}/rooms/delete`,       // DELETE - 删除房间 (Query: id)
};
