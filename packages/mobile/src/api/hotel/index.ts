import request from '@/utils/request';
import type { 
  ApiResponse, 
  HotelSearchParams, 
  HotelSearchResult, 
  HotelDetail 
} from '@/types/hotel';

/**
 * 搜索酒店列表
 * GET /api/hotelsMobile/search
 */
export const apiGetHotelList = (params?: HotelSearchParams) => {
  return request.get<any, ApiResponse<HotelSearchResult>>('/api/hotelsMobile/search', { params });
};

/**
 * 获取酒店详情
 * GET /api/hotelsMobile/:id
 */
export const apiGetHotelDetail = (id: string | number) => {
  return request.get<any, ApiResponse<HotelDetail>>(`/api/hotelsMobile/${id}`);
};