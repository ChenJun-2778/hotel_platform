// 1. 通用 API 响应包裹格式
export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
  }
  
  // 2. 搜索接口的入参定义 (List 页面传给后端的参数)
  export interface HotelSearchParams {
    destination: string;      // 对应之前的 city
    check_in_date: string;    // 对应之前的 beginDate
    check_out_date: string;   // 对应之前的 endDate
    // 下面这些如果是可选的查询条件，加上 ? 
    type?: number;
    sortType?: string;
    keyword?: string;
    // 筛选参数
    price_min?: number;
    price_max?: number;
    score_min?: number;
    score_max?: number;
    star_min?: number;
    star_max?: number;
    facilities?: string;      // 逗号分隔的设施列表
    review_count_min?: number; // 最低评价数
  }
  
  // 3. 酒店列表里的单条酒店卡片数据
  export interface HotelListItem {
    id: number;
    name: string;
    cover_image: string;
    brand: string;
    star_rating: number;
    location: string;
    address: string;
    description: string;
    hotel_facilities: string; // 注意：这里后端返回的是逗号分隔的字符串
    min_price: string;        // 注意：这里后端返回的是字符串类型的价格 "2323.00"
  }
  
  // 4. 搜索接口返回的 data 结构
  export interface HotelSearchResult {
    list: HotelListItem[];
    search_params: {
      destination: string;
      check_in_date: string;
      check_out_date: string;
      nights: number;
    };
    total: number;
  }
  
  // 5. 酒店详情中的房型结构
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
    base_price: string;
    total_rooms: number;
    // available_rooms: number;
    facilities: string;       // 房型设施字符串
    description: string;
    images: string;           // 房型图片字符串
  }
  
  // 6. 酒店详情接口返回的 data 结构
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
    images: string;           // 注意：酒店多图这里也是字符串，使用时需要 split(',')
    room_number: number;
    rooms: Room[];            // 嵌套了上方的 Room 数组
  }

  /**
 * 前端组件传入的原始参数格式
 * （对应 List 页面从 URL 里取出来的值）
 */
export interface FrontendSearchParams {
    city: string;
    beginDate: string;
    endDate: string;
    type?: string | null; // URL 里拿出来的默认是 string 或 null
    sortType?: string;
    keyword?: string;
    // 筛选参数
    price_min?: number;
    price_max?: number;
    score_min?: number;
    star_min?: number;
    facilities?: string;
    review_count_min?: number; // 最低评价数
  }