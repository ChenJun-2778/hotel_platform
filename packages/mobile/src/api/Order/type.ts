/**
 * 订单相关类型定义
 */

// 后端统一返回格式
export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data: T;
  }
  
  // 订单状态枚举
  export enum OrderStatus {
    PENDING = 1,      // 待付款
    CONFIRMED = 2,    // 待确定
    CHECKED_IN = 3,   // 待入住
    COMPLETED = 4     // 已完成
  }
  
  // 订单列表项
  export interface Order {
    id: number;
    order_no: string;
    user_id: number;
    hotel_id: number;
    room_id: number;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    total_price: number;
    status: OrderStatus;
    guest_name: string;
    guest_phone: string;
    room_images?: string; // 房间图片（逗号分隔）
  }
  
  // 创建订单请求参数
  export interface CreateOrderParams {
    hotel_id: number;
    room_id: number;
    user_id: number;
    check_in_date: string;
    check_out_date: string;
    guest_name: string;
    guest_phone: string;
    total_price: number;
  }
  
  // 创建订单返回数据
  export interface CreateOrderResult {
    id: number;
    order_no: string;
    user_id: number;
    hotel_id: number;
    room_id: number;
    check_in_date: string;
    check_out_date: string;
    nights: number;
    total_price: number;
    status: number;
    guest_name: string;
    guest_phone: string;
  }
  
  // 订单列表查询参数
  export interface OrderListParams {
    user_id: number;
    status?: OrderStatus;
  }
  
  // 订单列表返回数据
  export interface OrderListResult {
    total: number;
    orders: Order[];
  }
  