/**
 * 酒店相关类型定义
 */

// 后端统一返回格式
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
}

// 酒店列表项
export interface Hotel {
  id: number;
  name: string;
  cover_image: string;
  brand: string;
  star_rating: number;
  location: string;
  address: string;
  description: string;
  hotel_facilities: string;
  min_price: number;
}

// 酒店搜索参数
export interface HotelSearchParams {
  destination?: string;      // 目的地/城市
  check_in_date?: string;    // 入住日期 YYYY-MM-DD
  check_out_date?: string;   // 离店日期 YYYY-MM-DD
}

// 酒店搜索返回数据
export interface HotelSearchResult {
  list: Hotel[];
  search_params: {
    destination: string | null;
    check_in_date: string | null;
    check_out_date: string | null;
    nights: number | null;
  };
  total: number;
}

// 房间信息
export interface Room {
  id: number;
  hotel_id: number;
  room_number: string;
  room_type: string;
  room_type_en: string;
  bed_type: string;
  area: number;
  floor: string;
  max_occupancy: number;
  base_price: number;
  total_rooms: number;
  available_rooms: number;
  facilities: string;
  description: string;
  images: string;
}

// 酒店详情
export interface HotelDetail {
  id: number;
  name: string;
  star_rating: number;
  description: string;
  hotel_facilities: string;
  location: string;
  address: string;
  brand: string;
  english_name: string;
  hotel_phone: string;
  contact: string;
  contact_phone: string;
  cover_image: string;
  images: string;
  room_number: number;
  rooms: Room[];
}
