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
  // 真实接口
  // 酒店类型映射：国内(1)和钟点房(3)都属于国内酒店，所以都传 hotel_type=1
  let hotelType: number | undefined;
  const typeNum = Number(frontendParams.type);
  if (typeNum === 1 || typeNum === 3) {
    hotelType = 1;  // 国内酒店（包括国内和钟点房）
  } else if (typeNum === 2) {
    hotelType = 2;  // 海外酒店
  } else if (typeNum === 4) {
    hotelType = 3;  // 民宿酒店
  }

  const params: HotelSearchParams = {
    destination: frontendParams.city,
    check_in_date: frontendParams.beginDate,
    check_out_date: frontendParams.endDate,
    hotel_type: hotelType,  // 酒店类型（1=国内, 2=海外, 3=民宿）
    type: Number(frontendParams.type) || 1,
    sortType: frontendParams.sortType,
    keyword: frontendParams.keyword,
    // 添加筛选参数
    price_min: frontendParams.price_min,
    price_max: frontendParams.price_max,
    score_min: frontendParams.score_min,
    star_min: frontendParams.star_min,
    facilities: frontendParams.facilities,
    review_count_min: frontendParams.review_count_min
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