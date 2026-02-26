import request from '@/utils/request';
import type { 
  ApiResponse, 
  HotelSearchParams, // 后端要的真实格式
  HotelSearchResult, 
  HotelDetail,
  FrontendSearchParams
} from './type';
import { MOCK_HOTEL_LIST } from '@/mock/data';
import { mockRequest } from '@/utils/mockRequest';

// 读取环境变量
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
// 定义统一的 API 路径枚举
export enum HotelApi {
  SEARCH = '/api/hotelsMobile/search',
  DETAIL = '/api/hotelsMobile', // 详情接口通常是基础路径拼接 ID
}

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
        hotel.location?.includes(frontendParams.keyword || '')
      );
    }
    
    // 模拟排序
    if (frontendParams.sortType === 'price_asc') {
      filteredList.sort((a, b) => a.min_price - b.min_price);
    } else if (frontendParams.sortType === 'star_desc') {
      filteredList.sort((a, b) => b.star_rating - a.star_rating);
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
      total: filteredList.length,
      totalPages: 1,
      page: 1,
      pageSize: filteredList.length
    }, 800);
  }

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
    // 分页参数（可选，不传则使用后端默认值）
    page: frontendParams.page,
    pageSize: frontendParams.pageSize,
    // 添加筛选参数
    price_min: frontendParams.price_min,
    price_max: frontendParams.price_max,
    score_min: frontendParams.score_min,
    star_min: frontendParams.star_min,
    facilities: frontendParams.facilities,
    review_count_min: frontendParams.review_count_min
  };

  return request.get<any, ApiResponse<HotelSearchResult>>(HotelApi.SEARCH, { params });
};

/**
 * 获取酒店详情
 * GET /api/hotelsMobile/:id
 * @param id 酒店ID
 * @param check_in_date 入住日期（可选）
 * @param check_out_date 离店日期（可选）
 * @returns 返回酒店详情数据，包含房间列表及可用房间数
 */
export const apiGetHotelDetail = async (
  id: string | number, 
  check_in_date?: string, 
  check_out_date?: string
): Promise<ApiResponse<HotelDetail>> => {
  // Mock 模式
  // if (USE_MOCK) {
  //   return mockRequest(MOCK_HOTEL_DETAIL, 500);
  // }

  // 真实接口
  const params: any = {};
  if (check_in_date) params.check_in_date = check_in_date;
  if (check_out_date) params.check_out_date = check_out_date;

  return request.get<any, ApiResponse<HotelDetail>>(`${HotelApi.DETAIL}/${id}`, { params });
};