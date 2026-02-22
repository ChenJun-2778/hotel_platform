import request from '@/utils/request';
import type { 
  ApiResponse, 
  HotelSearchParams, // 后端要的真实格式
  HotelSearchResult, 
  HotelDetail,
  FrontendSearchParams
} from './type';

/**
 * 搜索酒店列表
 * GET /api/hotelsMobile/search
 */
export const apiGetHotelList = (frontendParams: FrontendSearchParams) => {
  // ✅ 1. 在这里集中做类型校验、默认值处理和字段映射（防腐层）
  const params: HotelSearchParams = {
    destination: frontendParams.city,             // 映射字段
    check_in_date: frontendParams.beginDate,
    check_out_date: frontendParams.endDate,
    type: Number(frontendParams.type) || 1,       // 强转数字，兜底为 1
    sortType: frontendParams.sortType,
    keyword: frontendParams.keyword
  };

  // ✅ 2. 把转换后、100% 符合后端要求的 params 发出去
  return request.get<any, ApiResponse<HotelSearchResult>>('/api/hotelsMobile/search', { params });
};

/**
 * 获取酒店详情
 * GET /api/hotelsMobile/:id
 * @param id 酒店ID
 * @returns 返回酒店详情数据，包含房间列表
 */
export const apiGetHotelDetail = (id: string | number): Promise<ApiResponse<HotelDetail>> => {
  return request.get<any, ApiResponse<HotelDetail>>(`/api/hotelsMobile/${id}`);
};