// 房间状态枚举
export const ROOM_STATUS = {
  AVAILABLE: 'available',   // 空闲
  OCCUPIED: 'occupied',     // 已入住
  RESERVED: 'reserved',     // 已预订
};

// 状态映射配置
export const ROOM_STATUS_MAP = {
  [ROOM_STATUS.AVAILABLE]: { color: '#52c41a', text: '空闲', bgColor: '#f6ffed', borderColor: '#b7eb8f' },
  [ROOM_STATUS.OCCUPIED]: { color: '#ff4d4f', text: '已入住', bgColor: '#fff1f0', borderColor: '#ffa39e' },
  [ROOM_STATUS.RESERVED]: { color: '#faad14', text: '已预订', bgColor: '#fffbe6', borderColor: '#ffe58f' },
};

// 获取房间状态信息
export const getRoomStatusInfo = (status) => {
  return ROOM_STATUS_MAP[status] || { 
    color: '#d9d9d9', 
    text: '未知', 
    bgColor: '#fafafa', 
    borderColor: '#d9d9d9' 
  };
};
