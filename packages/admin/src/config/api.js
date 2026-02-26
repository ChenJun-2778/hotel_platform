// API 基础配置
export const API_BASE_URL = 'http://47.99.56.81:3000/api';

// 认证相关接口
export const AUTH_API = {
  LOGIN: `${API_BASE_URL}/loginPC/login`,           // POST - 登录（账号密码/手机验证码）
  REGISTER: `${API_BASE_URL}/loginPC/register`,     // POST - 注册
  SEND_CODE: `${API_BASE_URL}/loginPC/sendCode`,    // POST - 发送验证码
  CHANGE_PASSWORD: (id) => `${API_BASE_URL}/loginPC/change-password/${id}`, // PUT - 修改密码
  GET_USER_INFO: (id) => `${API_BASE_URL}/loginPC/profile/${id}`, // GET - 获取用户信息
  UPDATE_USER_INFO: (id) => `${API_BASE_URL}/loginPC/profile/${id}`, // PUT - 更新用户信息
};

// 酒店相关接口
export const HOTEL_API = {
  CREATE: `${API_BASE_URL}/hotels/create`,      // POST - 创建酒店
  LIST: `${API_BASE_URL}/hotels/list`,          // GET - 获取酒店列表
  DETAIL: (id) => `${API_BASE_URL}/hotels/${id}`, // GET - 获取酒店详情
  UPDATE: (id) => `${API_BASE_URL}/hotels/${id}`, // PUT - 更新酒店信息
  UPDATE_STATUS: (id) => `${API_BASE_URL}/hotels/${id}/status`, // PUT - 更新酒店状态（已废弃）
  PUT_UP: (id) => `${API_BASE_URL}/hotels/${id}/putup`, // PUT - 发布酒店
  TAKE_DOWN: (id) => `${API_BASE_URL}/hotels/${id}/takedown`, // PUT - 下线酒店
  APPROVE: (id) => `${API_BASE_URL}/hotelsReview/approve/${id}`, // PUT - 审核通过
  REJECT: (id) => `${API_BASE_URL}/hotelsReview/reject/${id}`,   // PUT - 审核拒绝
  AUDIT_LIST: `${API_BASE_URL}/hotelsReview/list`, // GET - 获取审核列表
};

// 房间相关接口
export const ROOM_API = {
  CREATE: `${API_BASE_URL}/rooms/create`,       // POST - 创建房间
  LIST: `${API_BASE_URL}/rooms/list`,           // GET - 获取房间列表
  DETAIL: `${API_BASE_URL}/rooms/detail`,       // GET - 获取房间详情 (Query: id)
  UPDATE: `${API_BASE_URL}/rooms/update`,       // PUT - 更新房间信息 (Body: id + data)
  DELETE: `${API_BASE_URL}/rooms/delete`,       // DELETE - 删除房间 (Query: id)
};

// 订单相关接口
export const ORDER_API = {
  LIST: `${API_BASE_URL}/orderPC/list`,         // GET - 获取订单列表
  DETAIL: `${API_BASE_URL}/orderPC/detail`,     // GET - 获取订单详情 (Query: order_no)
  CONFIRM: (orderNo) => `${API_BASE_URL}/orderPC/confirm/${orderNo}`, // PUT - 确认订单
};
