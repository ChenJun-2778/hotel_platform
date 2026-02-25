import request from '@/utils/request';
import type { 
  ApiResponse, 
  CreateOrderParams, 
  CreateOrderResult,
  OrderListParams,
  OrderListResult,
  Order
} from './type';

// ✅ 1. 新增：统一定义订单 API 路径枚举
export enum OrderApi {
  CREATE = '/api/orderMobile/create',
  PAY = '/api/orderMobile/pay',
  LIST = '/api/orderMobile/list',
}

/**
 * 创建订单
 * POST /api/orderMobile/create
 */
export const apiCreateOrder = (params: CreateOrderParams): Promise<ApiResponse<CreateOrderResult>> => {
  // ✅ 2. 替换：使用枚举
  return request.post<any, ApiResponse<CreateOrderResult>>(OrderApi.CREATE, params);
};

/**
 * 支付订单
 * PUT /api/orderMobile/pay/:order_no
 */
export const apiPayOrder = (order_no: string): Promise<ApiResponse<Order>> => {
  // ✅ 3. 替换：使用枚举拼接动态参数
  return request.put<any, ApiResponse<Order>>(`${OrderApi.PAY}/${order_no}`);
};

/**
 * 获取订单列表
 * GET /api/orderMobile/list
 */
export const apiGetOrderList = (params: OrderListParams): Promise<ApiResponse<OrderListResult>> => {
  // ✅ 4. 替换：使用枚举
  return request.get<any, ApiResponse<OrderListResult>>(OrderApi.LIST, { params });
};