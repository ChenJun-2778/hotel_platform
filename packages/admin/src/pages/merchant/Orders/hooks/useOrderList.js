import { useState, useCallback } from 'react';

/**
 * 订单列表管理 Hook
 */
const useOrderList = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [loading, setLoading] = useState(false);

  /**
   * 搜索订单
   */
  const searchOrders = useCallback((keyword) => {
    if (!keyword) {
      setOrders(mockOrders);
      return;
    }

    setLoading(true);
    // 模拟搜索延迟
    setTimeout(() => {
      const filtered = mockOrders.filter(order => 
        order.orderNo.toLowerCase().includes(keyword.toLowerCase()) ||
        order.customer.toLowerCase().includes(keyword.toLowerCase())
      );
      setOrders(filtered);
      setLoading(false);
    }, 300);
  }, []);

  /**
   * 加载订单列表
   */
  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: 调用后端 API
      // const response = await getOrderList();
      // setOrders(response.data);
      
      // 模拟加载
      setTimeout(() => {
        setOrders(mockOrders);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('❌ 加载订单列表失败:', error.message);
      setLoading(false);
    }
  }, []);

  /**
   * 确认订单并分配房间
   */
  const confirmOrder = useCallback(async (orderKey, roomNumber) => {
    try {
      setLoading(true);
      
      // TODO: 调用后端 API 确认订单
      // await confirmOrderAPI(orderKey, roomNumber);
      
      // 模拟 API 调用
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新本地订单状态
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.key === orderKey 
            ? { 
                ...order, 
                status: 'confirmed', 
                assignedRoom: roomNumber,
                confirmedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
              }
            : order
        )
      );
      
      console.log(`✅ 订单确认成功: ${orderKey}, 分配房间: ${roomNumber}`);
    } catch (error) {
      console.error('❌ 确认订单失败:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    orders,
    loading,
    searchOrders,
    loadOrders,
    confirmOrder,
  };
};

// 模拟订单数据
const mockOrders = [
  {
    key: '1',
    orderNo: 'ORD20260211001',
    hotelId: '1',
    hotel: '我的豪华酒店',
    room: '2808',
    roomType: '豪华大床房',
    assignedRoom: '2808', // 已分配的房间号
    customer: '张三',
    phone: '13800138000',
    checkIn: '2026-02-15',
    checkOut: '2026-02-17',
    amount: 1776,
    status: 'confirmed',
    createdAt: '2026-02-11 10:30:00',
    confirmedAt: '2026-02-11 11:00:00',
    remark: '需要无烟房',
  },
  {
    key: '2',
    orderNo: 'ORD20260211002',
    hotelId: '1',
    hotel: '我的豪华酒店',
    room: '2809',
    roomType: '商务双床房',
    assignedRoom: '2809', // 已分配的房间号
    customer: '李四',
    phone: '13900139000',
    checkIn: '2026-02-12',
    checkOut: '2026-02-14',
    amount: 1196,
    status: 'checkedIn',
    createdAt: '2026-02-10 15:20:00',
    confirmedAt: '2026-02-10 16:00:00',
  },
  {
    key: '3',
    orderNo: 'ORD20260210003',
    hotelId: '2',
    hotel: '舒适商务酒店',
    room: '1501',
    roomType: '标准大床房',
    assignedRoom: '1501', // 已分配的房间号
    customer: '王五',
    phone: '13700137000',
    checkIn: '2026-02-08',
    checkOut: '2026-02-10',
    amount: 998,
    status: 'completed',
    createdAt: '2026-02-07 09:15:00',
    confirmedAt: '2026-02-07 10:00:00',
  },
  {
    key: '4',
    orderNo: 'ORD20260209004',
    hotelId: '1',
    hotel: '我的豪华酒店',
    roomType: '行政套房',
    assignedRoom: null, // 待确认订单，未分配房间号
    customer: '赵六',
    phone: '13600136000',
    checkIn: '2026-02-20',
    checkOut: '2026-02-23',
    amount: 2664,
    status: 'pending',
    createdAt: '2026-02-09 14:45:00',
    remark: '需要加床',
  },
  {
    key: '5',
    orderNo: 'ORD20260208005',
    hotelId: '2',
    hotel: '舒适商务酒店',
    roomType: '经济双床房',
    assignedRoom: null, // 已取消订单，无房间号
    customer: '孙七',
    phone: '13500135000',
    checkIn: '2026-02-05',
    checkOut: '2026-02-06',
    amount: 499,
    status: 'cancelled',
    createdAt: '2026-02-04 11:00:00',
    remark: '客户取消',
  },
];

export default useOrderList;
