import { mockRequest } from '@/utils/mockRequest';
import { MOCK_HOTEL_LIST, MOCK_HOTEL_DETAIL } from '@/mock/data';

// 读取环境变量（如果没配置默认开启 Mock）
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

// 1. 获取酒店列表
export const apiGetHotelList = async (params?: any) => {
  if (USE_MOCK) {
    // console.log('📢 [Mock] Fetching Hotel List...', params);
    return mockRequest(MOCK_HOTEL_LIST, 800); // 模拟 800ms 延迟
  }
  // TODO: 这里写真实的 axios 请求
  // return axios.get('/api/hotel/list', { params });
};

// 2. 获取酒店详情
export const apiGetHotelDetail = async (id: string) => {
  if (USE_MOCK) {
    // console.log('📢 [Mock] Fetching Hotel Detail for ID:', id);
    // 简单逻辑：无论 ID 是啥，都返回同一份详情数据
    return mockRequest(MOCK_HOTEL_DETAIL, 500);
  }
  // return axios.get(`/api/hotel/detail/${id}`);
};

// 3. 提交订单
export const submitOrder = async (data: any) => {
  if (USE_MOCK) {
    // console.log('📢 [Mock] Submitting Order:', data);
    return mockRequest({ orderId: '202602108888' }, 1500);
  }
  // return axios.post('/api/order/create', data);
};