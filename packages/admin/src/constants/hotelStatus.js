// 酒店状态枚举
export const HOTEL_STATUS = {
  ONLINE: 1,      // 营业中
  OFFLINE: 0,     // 已下架
  PENDING: 2,     // 待审批
  REJECTED: 3,    // 审批拒绝
};

// 状态映射配置
export const HOTEL_STATUS_MAP = {
  [HOTEL_STATUS.ONLINE]: { color: 'green', text: '营业中' },
  [HOTEL_STATUS.OFFLINE]: { color: 'default', text: '已下架' },
  [HOTEL_STATUS.PENDING]: { color: 'orange', text: '待审批' },
  [HOTEL_STATUS.REJECTED]: { color: 'red', text: '审批拒绝' },
};

// 获取状态信息
export const getHotelStatusInfo = (status) => {
  return HOTEL_STATUS_MAP[status] || { color: 'default', text: '未知' };
};
