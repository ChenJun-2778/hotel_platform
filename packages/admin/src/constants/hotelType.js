/**
 * 酒店类型常量
 */
export const HOTEL_TYPE = {
  ALL: null,          // 全部（用于前端筛选）
  DOMESTIC: 1,        // 国内
  OVERSEAS: 2,        // 海外
  HOMESTAY: 3,        // 民宿
};

/**
 * 酒店类型文本映射
 */
export const HOTEL_TYPE_TEXT = {
  [HOTEL_TYPE.ALL]: '全部',
  [HOTEL_TYPE.DOMESTIC]: '国内',
  [HOTEL_TYPE.OVERSEAS]: '海外',
  [HOTEL_TYPE.HOMESTAY]: '民宿',
};

/**
 * 酒店类型选项（用于表单）
 */
export const HOTEL_TYPE_OPTIONS = [
  { label: '全部', value: HOTEL_TYPE.ALL },
  { label: '国内', value: HOTEL_TYPE.DOMESTIC },
  { label: '海外', value: HOTEL_TYPE.OVERSEAS },
  { label: '民宿', value: HOTEL_TYPE.HOMESTAY },
];
