import React, { useState } from 'react';
import { message } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import OrderTable from './components/OrderTable';
import OrderDetail from './components/OrderDetail';
import useOrderList from './hooks/useOrderList';
import { getOrderDetail } from '../../../services/orderService';
import { useRoomStore } from '../../../stores/roomStore';

/**
 * 订单明细页面
 */
const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [availableRooms, setAvailableRooms] = useState([]);
  
  const { orders, loading, pagination, searchOrders, handlePageChange, confirmOrder } = useOrderList();
  
  // 使用 Zustand Store（仅用于前端房间分配状态管理）
  const assignRoomToOrder = useRoomStore(state => state.assignRoomToOrder);

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
        
        // 解析 room_numbers 字段（后端返回的可用房间号列表）
        let roomNumbers = [];
        if (detailData.room_numbers) {
          try {
            roomNumbers = typeof detailData.room_numbers === 'string' 
              ? JSON.parse(detailData.room_numbers) 
              : detailData.room_numbers;
            console.log('✅ 解析后的房间号列表:', roomNumbers);
          } catch (e) {
            console.warn('⚠️ 解析 room_numbers 失败:', e);
            roomNumbers = [];
          }
        }
        
        // 格式化详情数据
        const fullOrder = {
          ...order,
          id: detailData.id,
          hotelId: detailData.hotel_id,
          orderNo: detailData.order_no,
          hotelName: detailData.hotel_name,
          roomType: detailData.room_type,
          assignedRoom: detailData.assigned_room_no, // ⭐ 已分配的房间号
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
        
        // 如果是待确定状态，使用后端返回的 room_numbers 作为可选房间列表
        if (fullOrder.status === 2) {
          const formattedRooms = roomNumbers.map(roomNum => ({
            roomNumber: roomNum,
            type: detailData.room_type,
            hotelName: detailData.hotel_name,
          }));
          
          console.log('✅ 可用房间号列表:', formattedRooms);
          setAvailableRooms(formattedRooms);
          
          if (formattedRooms.length === 0) {
            message.warning(`房型"${detailData.room_type}"下暂无可用房间号`);
          }
        }
      } else {
        // 如果没有订单号，直接使用列表数据
        setSelectedOrder(order);
        setIsDetailModalOpen(true);
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
    try {
      // 1. 先保存到 Context（前端状态管理）
      assignRoomToOrder(orderNo, roomNumber);
      console.log('✅ 已在前端保存房间分配:', orderNo, '→', roomNumber);
      
      // 2. 调用后端接口确认订单
      try {
        await confirmOrder(orderNo, roomNumber);
        console.log('✅ 后端确认成功');
      } catch (backendError) {
        console.warn('⚠️ 后端确认失败，但前端已保存分配:', backendError);
        message.warning('订单确认请求失败，但房间分配已保存在本地');
      }
      
      // 3. 确认成功后关闭弹窗
      handleDetailClose();
    } catch (error) {
      console.error('❌ 订单确认失败:', error);
    }
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
        loadingRooms={false}
      />
    </PageContainer>
  );
};

export default OrderList;
