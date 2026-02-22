import React, { useState } from 'react';
import { message } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import OrderTable from './components/OrderTable';
import OrderDetail from './components/OrderDetail';
import useOrderList from './hooks/useOrderList';
import { ORDER_STATUS } from './utils/orderStatus';

/**
 * 订单明细页面
 */
const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { orders, loading, searchOrders, confirmOrder } = useOrderList();

  // 模拟可用房间列表（实际应该从后端获取该酒店该房型的可用房间）
  const getAvailableRooms = (order) => {
    if (!order) return [];
    
    // 根据订单的酒店和房型，返回可用房间
    // 这里使用模拟数据，实际应该调用后端 API
    const roomsByHotel = {
      '1': [ // 我的豪华酒店
        { roomNumber: '2808', type: '豪华大床房' },
        { roomNumber: '2809', type: '商务双床房' },
        { roomNumber: '2810', type: '行政套房' },
        { roomNumber: '2811', type: '豪华大床房' },
        { roomNumber: '2812', type: '标准双床房' },
        { roomNumber: '2813', type: '豪华大床房' },
        { roomNumber: '2814', type: '商务双床房' },
      ],
      '2': [ // 舒适商务酒店
        { roomNumber: '1501', type: '标准大床房' },
        { roomNumber: '1502', type: '经济双床房' },
        { roomNumber: '1503', type: '商务大床房' },
        { roomNumber: '1504', type: '标准大床房' },
      ],
    };

    const hotelRooms = roomsByHotel[order.hotelId] || [];
    
    // 过滤出与订单房型匹配的房间
    return hotelRooms.filter(room => room.type === order.roomType);
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
  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  /**
   * 关闭详情弹窗
   */
  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };

  /**
   * 确认订单并分配房间
   */
  const handleConfirmOrder = async (orderKey, roomNumber) => {
    await confirmOrder(orderKey, roomNumber);
    message.success('订单确认成功，房间已分配！');
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
        onViewDetail={handleViewDetail}
      />

      {/* 订单详情弹窗 */}
      <OrderDetail
        visible={isDetailModalOpen}
        order={selectedOrder}
        onClose={handleDetailClose}
        onConfirm={handleConfirmOrder}
        availableRooms={getAvailableRooms(selectedOrder)}
      />
    </PageContainer>
  );
};

export default OrderList;
