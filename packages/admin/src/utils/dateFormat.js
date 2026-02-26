import dayjs from 'dayjs';

/**
 * 格式化日期时间为 "年月日时分" 格式
 * @param {string|Date|dayjs.Dayjs} date - 日期
 * @returns {string} 格式化后的日期字符串，如 "2024-03-15 14:30"
 */
export const formatDateTime = (date) => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm');
};

/**
 * 格式化日期为 "年月日" 格式
 * @param {string|Date|dayjs.Dayjs} date - 日期
 * @returns {string} 格式化后的日期字符串，如 "2024-03-15"
 */
export const formatDate = (date) => {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD');
};
