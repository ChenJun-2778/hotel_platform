/**
 * 订单状态配置（匹配后端）
 * 1-待付款 2-待确定 3-待入住 4-已完成
 */
export const ORDER_STATUS = {
  PENDING_PAYMENT: 1,    // 待付款
  PENDING_CONFIRM: 2,    // 待确定
  PENDING_CHECKIN: 3,    // 待入住
  COMPLETED: 4,          // 已完成
};

/**
 * 获取订单状态信息
 * @param {number} status - 订单状态
 * @returns {object} 状态信息 { color, text }
 */
export const getOrderStatusInfo = (status) => {
  const statusMap = {
    [ORDER_STATUS.PENDING_PAYMENT]: { color: 'orange', text: '待付款' },
    [ORDER_STATUS.PENDING_CONFIRM]: { color: 'gold', text: '待确定' },
    [ORDER_STATUS.PENDING_CHECKIN]: { color: 'blue', text: '待入住' },
    [ORDER_STATUS.COMPLETED]: { color: 'green', text: '已完成' },
  };
  return statusMap[status] || { color: 'default', text: '未知' };
};
