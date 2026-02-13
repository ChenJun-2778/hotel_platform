import React, { useState } from 'react';
import { Modal, message } from 'antd';
import PageContainer from '../../../components/common/PageContainer';
import HotelAuditTable from './components/HotelAuditTable';
import HotelDetail from '../../merchant/Hotels/components/HotelDetail';
import useHotelAudit from './hooks/useHotelAudit';

/**
 * 酒店审核管理页面
 */
const HotelAudit = () => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  
  const { hotels, loading, searchHotels, approveHotel, rejectHotel } = useHotelAudit();

  /**
   * 搜索酒店
   */
  const handleSearch = (keyword) => {
    searchHotels(keyword);
  };

  /**
   * 查看酒店详情 - 使用假数据
   */
  const handleViewDetail = async (record) => {
    setDetailLoading(true);
    setIsDetailModalOpen(true);
    
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 根据酒店ID生成假数据
      const mockDetailData = {
        id: record.id,
        name: record.name,
        english_name: record.name === '易宿豪华酒店' ? 'Yisu Luxury Hotel' : 
                      record.name === '好利来酒店' ? 'Haolilai Hotel' :
                      record.name === '海景度假酒店' ? 'Seaview Resort Hotel' :
                      record.name === '商务快捷酒店' ? 'Business Express Hotel' :
                      'Mountain View Inn',
        brand: record.merchant + '连锁',
        star_rating: record.star_rating,
        room_number: Math.floor(Math.random() * 50) + 20,
        location: record.address.split('省')[0] + '省' + record.address.split('省')[1]?.split('市')[0] + '市',
        country: '中国',
        province: record.address.split('省')[0] + '省',
        city: record.address.split('省')[1]?.split('市')[0] + '市',
        district: record.address.split('市')[1]?.split('区')[0] + '区',
        address: record.address,
        hotel_phone: record.phone,
        contact: record.merchant.replace('商户', '经理'),
        contact_phone: record.phone.replace(/^0/, '138'),
        hotel_facilities: '免费WiFi,停车场,餐厅,健身房,游泳池,会议室',
        check_in_time: '2000-01-01 14:00:00',
        check_out_time: '2000-01-01 12:00:00',
        description: `${record.name}位于${record.address}，交通便利，环境优雅。酒店设施齐全，服务周到，是您商务出行和休闲度假的理想选择。`,
        cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        images: JSON.stringify([
          'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
          'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
          'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
        ]),
        status: record.status === 'approved' ? 1 : record.status === 'pending' ? 0 : 2,
        created_at: record.submitTime,
      };
      
      setSelectedHotel(mockDetailData);
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
