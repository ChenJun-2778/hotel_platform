import request from '@/utils/request';
import type { 
  ApiResponse, 
  HotelSearchParams, // 后端要的真实格式
  HotelSearchResult, 
  HotelDetail,
  FrontendSearchParams
} from './type';
import { MOCK_HOTEL_LIST, MOCK_HOTEL_DETAIL } from '@/mock/data';
import { mockRequest } from '@/utils/mockRequest';

// 读取环境变量
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

/**
 * 搜索酒店列表
 * GET /api/hotelsMobile/search
 */
export const apiGetHotelList = async (frontendParams: FrontendSearchParams) => {
  // Mock 模式
  if (USE_MOCK) {
    // 模拟筛选逻辑
    let filteredList = [...MOCK_HOTEL_LIST];
    
    // 如果有关键词，简单过滤
    if (frontendParams.keyword) {
      filteredList = filteredList.filter(hotel => 
        hotel.name.includes(frontendParams.keyword || '') ||
        hotel.position?.includes(frontendParams.keyword || '')
      );
    }
    
    // 模拟排序
    if (frontendParams.sortType === 'price_asc') {
      filteredList.sort((a, b) => a.price - b.price);
    } else if (frontendParams.sortType === 'star_desc') {
      filteredList.sort((a, b) => b.star - a.star);
    }
    
    return mockRequest({
      list: filteredList,
      search_params: {
        destination: frontendParams.city || null,
        check_in_date: frontendParams.beginDate || null,
        check_out_date: frontendParams.endDate || null,
        nights: frontendParams.beginDate && frontendParams.endDate 
          ? Math.round((new Date(frontendParams.endDate).getTime() - new Date(frontendParams.beginDate).getTime()) / (1000 * 60 * 60 * 24))
          : null
      },
      total: filteredList.length
    }, 800);
  }

  // 真实接口
  const params: HotelSearchParams = {
    destination: frontendParams.city,
    check_in_date: frontendParams.beginDate,
    check_out_date: frontendParams.endDate,
    type: Number(frontendParams.type) || 1,
    sortType: frontendParams.sortType,
    keyword: frontendParams.keyword
  };

  return request.get<any, ApiResponse<HotelSearchResult>>('/api/hotelsMobile/search', { params });
};

/**
 * 获取酒店详情
 * GET /api/hotelsMobile/:id
 * @param id 酒店ID
 * @returns 返回酒店详情数据，包含房间列表
 */
export const apiGetHotelDetail = async (id: string | number): Promise<ApiResponse<HotelDetail>> => {
  // Mock 模式
  if (USE_MOCK) {
    return mockRequest(MOCK_HOTEL_DETAIL, 500);
  }

  // 真实接口
  return request.get<any, ApiResponse<HotelDetail>>(`/api/hotelsMobile/${id}`);
};