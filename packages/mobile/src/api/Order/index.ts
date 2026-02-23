import request from '@/utils/request';
import type { 
  ApiResponse, 
  CreateOrderParams, 
  CreateOrderResult,
  OrderListParams,
  OrderListResult,
  Order
} from './type';

/**
 * 创建订单
 * POST /api/orderMobile/create
 */
export const apiCreateOrder = (params: CreateOrderParams): Promise<ApiResponse<CreateOrderResult>> => {
  return request.post<any, ApiResponse<CreateOrderResult>>('/api/orderMobile/create', params);
};

/**
 * 支付订单
 * PUT /api/orderMobile/pay/:order_no
 */
export const apiPayOrder = (order_no: string): Promise<ApiResponse<Order>> => {
  return request.put<any, ApiResponse<Order>>(`/api/orderMobile/pay/${order_no}`);
};

/**
 * 获取订单列表
 * GET /api/orderMobile/list
 */
export const apiGetOrderList = (params: OrderListParams): Promise<ApiResponse<OrderListResult>> => {
  return request.get<any, ApiResponse<OrderListResult>>('/api/orderMobile/list', { params });
};
