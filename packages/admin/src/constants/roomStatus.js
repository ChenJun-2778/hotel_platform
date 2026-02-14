// 房间状态常量（数字类型）
export const ROOM_STATUS = {
  AVAILABLE: 1,    // 可预订
  OCCUPIED: 2,     // 已入住
  RESERVED: 3,     // 已预订
  CLEANING: 4,     // 清洁中
};

// 房间状态映射（用于显示）
export const ROOM_STATUS_MAP = {
  [ROOM_STATUS.AVAILABLE]: {
    text: '可预订',
    color: '#52c41a', // 绿色
    bgColor: '#f6ffed',
    borderColor: '#b7eb8f',
  },
  [ROOM_STATUS.OCCUPIED]: {
    text: '已入住',
    color: '#ff4d4f', // 红色
    bgColor: '#fff1f0',
    borderColor: '#ffccc7',
  },
  [ROOM_STATUS.RESERVED]: {
    text: '已预订',
    color: '#faad14', // 黄色
    bgColor: '#fffbe6',
    borderColor: '#ffe58f',
  },
  [ROOM_STATUS.CLEANING]: {
    text: '清洁中',
    color: '#1890ff', // 蓝色
    bgColor: '#e6f7ff',
    borderColor: '#91d5ff',
  },
};

// 获取房间状态信息
export const getRoomStatusInfo = (status) => {
  return ROOM_STATUS_MAP[status] || {
    text: '未知',
    color: '#d9d9d9',
    bgColor: '#fafafa',
    borderColor: '#d9d9d9',
  };
};
