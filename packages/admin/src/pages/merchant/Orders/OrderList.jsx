import React, { useState } from 'react';
import { message } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import OrderTable from './components/OrderTable';
import OrderDetail from './components/OrderDetail';
import useOrderList from './hooks/useOrderList';
import { getOrderDetail } from '../../../services/orderService';
import { useRoomCache } from '../../../contexts/RoomCacheContext';

/**
 * 订单明细页面
 */
const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(false);
  
  const { orders, loading, pagination, searchOrders, handlePageChange, confirmOrder } = useOrderList();
  
  // 使用房间缓存 Context
  const { getRoomsByHotelAndType, getCacheStats, isCacheExpired } = useRoomCache();

  /**
   * 从酒店名称和房型匹配房间
   * 使用 Context 中的房间列表
   */
  const loadAvailableRoomsByHotelName = async (order) => {
    if (!order || !order.hotelName || !order.roomType) {
      setAvailableRooms([]);
      return;
    }
    
    setLoadingRooms(true);
    try {
      console.log('🔍 根据酒店名称和房型加载房间');
      console.log('🔍 酒店名称:', order.hotelName);
      console.log('🔍 房型:', order.roomType);
      
      // 从 Context 获取房间列表
      const matchedRooms = getRoomsByHotelAndType(order.hotelName, order.roomType);
      
      // 获取缓存统计信息
      const stats = getCacheStats();
      console.log('📊 缓存统计:', stats);
      
      // 检查缓存是否过期
      if (isCacheExpired()) {
        console.warn('⚠️ 房间缓存已过期，建议重新访问房间管理页面');
        message.warning('房间数据可能已过期，建议重新访问"房间管理"页面刷新数据');
      }
      
      if (matchedRooms.length === 0) {
        console.warn('⚠️ 没有匹配的房间');
        message.warning(`暂无可用的"${order.roomType}"房间，请先在房间管理中添加该类型的房间`);
      } else {
        console.log('✅ 匹配的房间:', matchedRooms);
      }
      
      // 格式化房间数据
      const formattedRooms = matchedRooms.map(room => ({
        roomNumber: room.room_number,
        type: room.room_type,
        hotelName: room.hotel_name,
      }));
      
      setAvailableRooms(formattedRooms);
    } catch (error) {
      console.error('❌ 加载房间列表失败:', error);
      message.error('加载房间列表失败');
      setAvailableRooms([]);
    } finally {
      setLoadingRooms(false);
    }
  };

  /**
   * 搜索订单
   */
  const handleSearch = (keyword) => {
    searchOrders(keyword);
  };

  /**
   * 查看订单详情
   */
  const handleViewDetail = async (order) => {
    try {
      console.log('🔍 查看订单详情 - 列表数据:', order);
      
      // 使用订单号调用详情接口获取完整信息
      if (order.orderNo) {
        const detailResponse = await getOrderDetail(order.orderNo);
        const detailData = detailResponse.data || detailResponse;
        
        console.log('✅ 订单详情数据:', detailData);
        
        // 格式化详情数据
        const fullOrder = {
          ...order,
          id: detailData.id,
          hotelId: detailData.hotel_id,
          orderNo: detailData.order_no,
          hotelName: detailData.hotel_name,
          roomType: detailData.room_type,
          assignedRoom: detailData.assigned_room_no,
          customer: detailData.guest_name,
          phone: detailData.guest_phone,
          checkIn: detailData.check_in_date,
          checkOut: detailData.check_out_date,
          nights: detailData.nights,
          amount: detailData.total_price,
          status: detailData.status,
          createdAt: detailData.created_at,
          confirmedAt: detailData.confirmed_at,
        };
        
        setSelectedOrder(fullOrder);
        setIsDetailModalOpen(true);
        
        // 如果是待确定状态，根据酒店名称和房型加载可用房间
        if (fullOrder.status === 2) {
          await loadAvailableRoomsByHotelName(fullOrder);
        }
      } else {
        // 如果没有订单号，直接使用列表数据
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
        
        if (order.status === 2) {
          await loadAvailableRoomsByHotelName(order);
        }
      }
    } catch (error) {
      console.error('❌ 获取订单详情失败:', error);
      message.error('获取订单详情失败');
    }
  };

  /**
   * 关闭详情弹窗
   */
  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
    setAvailableRooms([]);
  };

  /**
   * 确认订单并分配房间
   */
  const handleConfirmOrder = async (orderNo, roomNumber) => {
    await confirmOrder(orderNo, roomNumber);
  };

  return (
    <PageContainer
      title="订单明细"
      showSearch={true}
      searchPlaceholder="搜索订单号、客户"
      onSearch={handleSearch}
      searchLoading={loading}
      showAddButton={false}
    >
      <OrderTable 
        orders={orders}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onViewDetail={handleViewDetail}
      />

      {/* 订单详情弹窗 */}
      <OrderDetail
        visible={isDetailModalOpen}
        order={selectedOrder}
        onClose={handleDetailClose}
        onConfirm={handleConfirmOrder}
        availableRooms={availableRooms}
        loadingRooms={loadingRooms}
      />
    </PageContainer>
  );
};

export default OrderList;
