import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { getOrderList, confirmOrder as confirmOrderAPI } from '../../../../services/orderService';
import { ORDER_STATUS } from '../utils/orderStatus';
import { useAuthStore } from '../../../../stores/authStore';

/**
 * 订单列表管理 Hook
 */
const useOrderList = () => {
  const user = useAuthStore(state => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  /**
   * 加载订单列表
   */
  const loadOrders = useCallback(async (page = pagination.current, pageSize = pagination.pageSize, keyword = searchKeyword) => {
    setLoading(true);
    try {
      const params = {
        page,
        pageSize,
      };
      
      // 添加用户ID（商户只能看到自己的订单）
      if (user?.id) {
        params.userId = user.id;
      }
      
      // 搜索逻辑优化：判断关键词类型
      if (keyword) {
        const trimmedKeyword = keyword.trim();
        
        // 如果关键词以 ORD 开头，认为是订单号搜索
        if (trimmedKeyword.toUpperCase().startsWith('ORD')) {
          params.order_no = trimmedKeyword;
          console.log('🔍 按订单号搜索:', trimmedKeyword);
        } else {
          // 否则按客户名称搜索
          params.guest_name = trimmedKeyword;
          console.log('🔍 按客户名称搜索:', trimmedKeyword);
        }
      }
      
      console.log('🔍 请求订单列表参数:', params);
      
      const response = await getOrderList(params);
      console.log('✅ 后端返回的订单数据:', response);
      
      // 后端返回格式：{ data: { total: 0, orders: [] }, success: true, message: '' }
      const responseData = response.data || response;
      const orderList = responseData.orders || responseData.list || [];
      const total = responseData.total || 0;
      
      console.log('✅ 解析后的订单列表:', orderList);
      console.log('✅ 订单总数:', total);
      
      // 格式化订单数据以匹配前端字段
      const formattedOrders = Array.isArray(orderList) ? orderList.map((order, index) => ({
        key: order.id || order.order_no || `order-${index}`,
        id: order.id,
        orderNo: order.order_no,
        hotelId: order.hotel_id,
        hotelName: order.hotel_name,
        roomType: order.room_type,
        assignedRoom: order.assigned_room_no, // ⭐ 房间号字段（后端返回，通常为空）
        customer: order.guest_name,
        phone: order.guest_phone,
        checkIn: order.check_in_date,
        checkOut: order.check_out_date,
        nights: order.nights,
        amount: order.total_price,
        status: order.status,
        createdAt: order.created_at,
        confirmedAt: order.confirmed_at,
      })) : [];
      
      setOrders(formattedOrders);
      
      // 更新分页信息
      setPagination({
        current: page,
        pageSize: pageSize,
        total: total,
      });
      
      console.log('✅ 加载完成，共', formattedOrders.length, '条订单，总数:', total);
      
    } catch (error) {
      console.error('❌ 加载订单列表失败:', error);
      message.error('加载订单列表失败，请重试');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.current, pagination.pageSize, searchKeyword, user]);

  /**
   * 搜索订单
   */
  const searchOrders = useCallback(async (keyword) => {
    console.log('🔍 搜索关键词:', keyword);
    setSearchKeyword(keyword);
    await loadOrders(1, pagination.pageSize, keyword);
  }, [loadOrders, pagination.pageSize]);

  /**
   * 分页变化
   */
  const handlePageChange = useCallback(async (page, pageSize) => {
    console.log('📄 分页变化 - 页码:', page, '每页数量:', pageSize);
    await loadOrders(page, pageSize, searchKeyword);
  }, [loadOrders, searchKeyword]);

  /**
   * 确认订单并分配房间
   */
  const confirmOrder = useCallback(async (orderNo, roomNumber) => {
    try {
      setLoading(true);
      
      console.log('✅ 确认订单 - 订单号:', orderNo, '房间号:', roomNumber);
      
      await confirmOrderAPI(orderNo, roomNumber);
      
      message.success('订单确认成功！');
      
      // 重新加载订单列表
      await loadOrders();
      
      console.log('✅ 订单确认成功');
    } catch (error) {
      console.error('❌ 确认订单失败:', error);
      message.error(error.message || '确认失败，请重试');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [loadOrders]);

  // 组件加载时获取列表
  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user?.id]);

  return {
    orders,
    loading,
    pagination,
    searchKeyword,
    searchOrders,
    loadOrders,
    handlePageChange,
    confirmOrder,
  };
};

export default useOrderList;
