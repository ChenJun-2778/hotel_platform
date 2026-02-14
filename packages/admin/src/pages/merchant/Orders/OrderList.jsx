import React, { useState } from 'react';
import { Modal } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import OrderTable from './components/OrderTable';
import OrderDetail from './components/OrderDetail';
import useOrderList from './hooks/useOrderList';

/**
 * 订单明细页面
 */
const OrderList = () => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { orders, loading, searchOrders } = useOrderList();

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
      />
    </PageContainer>
  );
};

export default OrderList;
