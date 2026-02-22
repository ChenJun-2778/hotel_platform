import React, { useState } from 'react';
import { Modal, message } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import HotelAuditTable from './components/HotelAuditTable';
import HotelDetail from '../../merchant/Hotels/components/HotelDetail';
import useHotelAudit from './hooks/useHotelAudit';
import { getHotelDetail } from '../../../services/hotelService';
import { getRoomList } from '../../../services/roomService';

/**
 * 酒店审核管理页面
 */
const HotelAudit = () => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  
  const { 
    hotels, 
    loading, 
    pagination,
    searchHotels, 
    filterByStatus,
    handlePageChange,
    approveHotel, 
    rejectHotel 
  } = useHotelAudit();

  /**
   * 搜索酒店
   */
  const handleSearch = (keyword) => {
    searchHotels(keyword);
  };

  /**
   * 查看酒店详情 - 使用真实 API（与酒店管理页面复用逻辑）
   */
  const handleViewDetail = async (record) => {
    setDetailLoading(true);
    setIsDetailModalOpen(true);
    
    try {
      // 调用真实 API 获取酒店详情
      const response = await getHotelDetail(record.id);
      const hotelData = response.data || response;
      
      // 获取该酒店的实际房间数（计算属性，不写入数据库）
      try {
        const roomResponse = await getRoomList({ hotel_id: record.id });
        const roomList = roomResponse.data?.rooms || roomResponse.rooms || [];
        hotelData.room_number = roomList.length;
        console.log(`✅ 酒店详情 - 实时计算房间数: ${roomList.length}`);
      } catch (error) {
        console.log('⚠️ 获取房间数失败，显示为0:', error.message);
        hotelData.room_number = 0;
      }
      
      setSelectedHotel(hotelData);
    } catch (error) {
      console.error('❌ 获取酒店详情失败:', error.message);
      message.error('获取酒店详情失败，请重试');
      setIsDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  /**
   * 关闭详情弹窗
   */
  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setSelectedHotel(null);
  };

  /**
   * 审核通过
   */
  const handleApprove = async (hotelId) => {
    await approveHotel(hotelId);
  };

  /**
   * 审核拒绝 - 带拒绝原因
   */
  const handleReject = async (hotelId, reason) => {
    await rejectHotel(hotelId, reason);
  };

  return (
    <PageContainer
      title="酒店审核"
      showSearch={true}
      searchPlaceholder="搜索酒店名称、商户"
      onSearch={handleSearch}
      searchLoading={loading}
      showAddButton={false}
    >
      <HotelAuditTable 
        hotels={hotels}
        loading={loading}
        pagination={pagination}
        onPageChange={handlePageChange}
        onStatusFilter={filterByStatus}
        onViewDetail={handleViewDetail}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* 酒店详情弹窗 - 复用商户端组件 */}
      <Modal
        title="酒店详情"
        open={isDetailModalOpen}
        onCancel={handleDetailClose}
        width={900}
        footer={null}
        style={{ top: 20 }}
        styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' } }}
      >
        <HotelDetail hotel={selectedHotel} loading={detailLoading} />
      </Modal>
    </PageContainer>
  );
};

export default HotelAudit;
