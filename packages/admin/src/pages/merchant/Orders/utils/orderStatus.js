/**
 * 订单状态配置
 */
export const ORDER_STATUS = {
  PENDING: 'pending',       // 待确认
  CONFIRMED: 'confirmed',   // 已确认
  CHECKED_IN: 'checkedIn',  // 已入住
  COMPLETED: 'completed',   // 已完成
  CANCELLED: 'cancelled',   // 已取消
};

/**
 * 获取订单状态信息
 * @param {string} status - 订单状态
 * @returns {object} 状态信息 { color, text }
 */
export const getOrderStatusInfo = (status) => {
  const statusMap = {
    [ORDER_STATUS.PENDING]: { color: 'orange', text: '待确认' },
    [ORDER_STATUS.CONFIRMED]: { color: 'blue', text: '已确认' },
    [ORDER_STATUS.CHECKED_IN]: { color: 'green', text: '已入住' },
    [ORDER_STATUS.COMPLETED]: { color: 'default', text: '已完成' },
    [ORDER_STATUS.CANCELLED]: { color: 'red', text: '已取消' },
  };
  return statusMap[status] || { color: 'default', text: '未知' };
};
