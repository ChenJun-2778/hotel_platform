// // src/api/hotel.ts
// import { mockRequest } from './mock-request'; // 假设你把模拟器工具放这了
// import { MOCK_HOTEL_LIST, MOCK_HOTEL_DETAIL } from '@/mock/data'; // 引入 mock 数据

// // 获取当前环境是否开启 Mock
// // import.meta.env 是 Vite 特有的环境变量获取方式
// const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

// // 1. 获取酒店列表
// export const getHotelList = async (params: any) => {
//   if (USE_MOCK) {
//     console.log('📢 [Mock模式] 正在获取酒店列表...');
//     return mockRequest(MOCK_HOTEL_LIST, 800);
//   }

//   // 下面是未来真实的接口调用
//   // return axios.get('/api/hotel/list', { params });
//   return Promise.resolve({ code: 200, data: [] }); // 占位防报错
// };

// // ... 其他接口同理