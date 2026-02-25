import dayjs from 'dayjs';

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
 * 获取订单状态信息（根据入住时间动态判断）
 * @param {number} status - 订单状态
 * @param {string} checkInDate - 入住日期 YYYY-MM-DD
 * @param {string} checkOutDate - 退房日期 YYYY-MM-DD
 * @returns {object} 状态信息 { color, text }
 */
export const getOrderStatusInfo = (status, checkInDate, checkOutDate) => {
  // 如果是待入住状态，需要根据当前日期判断是否已入住
  if (status === ORDER_STATUS.PENDING_CHECKIN && checkInDate && checkOutDate) {
    const today = dayjs().format('YYYY-MM-DD');
    const checkIn = dayjs(checkInDate).format('YYYY-MM-DD');
    const checkOut = dayjs(checkOutDate).format('YYYY-MM-DD');
    
    // 当前日期 >= 入住日期 && 当前日期 < 退房日期，显示为"已入住"
    if (today >= checkIn && today < checkOut) {
      return { color: 'cyan', text: '已入住' };
    }
  }
  
  const statusMap = {
    [ORDER_STATUS.PENDING_PAYMENT]: { color: 'orange', text: '待付款' },
    [ORDER_STATUS.PENDING_CONFIRM]: { color: 'gold', text: '待确定' },
    [ORDER_STATUS.PENDING_CHECKIN]: { color: 'blue', text: '待入住' },
    [ORDER_STATUS.COMPLETED]: { color: 'green', text: '已完成' },
  };
  return statusMap[status] || { color: 'default', text: '未知' };
};
