import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';

/**
 * 酒店审核管理 Hook - 使用假数据
 */
const useHotelAudit = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * 加载酒店列表 - 假数据
   */
  const loadHotels = useCallback(async () => {
    try {
      setLoading(true);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 假数据
      const mockHotels = [
        {
          key: '1',
          id: 1,
          name: '易宿豪华酒店',
          merchant: '张三商户',
          phone: '0571-12345678',
          address: '浙江省杭州市西湖区文三路123号',
          star_rating: 5,
          status: 'pending',
          submitTime: '2024-01-15 10:30:00',
          reject_reason: null,
        },
        {
          key: '2',
          id: 2,
          name: '好利来酒店',
          merchant: '李四商户',
          phone: '0555-1234567',
          address: '河北省秦皇岛市北戴河区江南水岸',
          star_rating: 3,
          status: 'approved',
          submitTime: '2024-01-14 14:20:00',
          reject_reason: null,
        },
        {
          key: '3',
          id: 3,
          name: '海景度假酒店',
          merchant: '王五商户',
          phone: '0898-8888888',
          address: '海南省三亚市天涯区海滨路88号',
          star_rating: 4,
          status: 'rejected',
          submitTime: '2024-01-13 09:15:00',
          reject_reason: '酒店资质不全，缺少消防许可证',
        },
        {
          key: '4',
          id: 4,
          name: '商务快捷酒店',
          merchant: '赵六商户',
          phone: '010-66668888',
          address: '北京市朝阳区建国路99号',
          star_rating: 3,
          status: 'pending',
          submitTime: '2024-01-16 16:45:00',
          reject_reason: null,
        },
        {
          key: '5',
          id: 5,
          name: '山景民宿',
          merchant: '孙七商户',
          phone: '0571-99998888',
          address: '浙江省杭州市西湖区龙井路168号',
          star_rating: 4,
          status: 'rejected',
          submitTime: '2024-01-12 11:20:00',
          reject_reason: '酒店图片不清晰，需要重新上传高清图片',
        },
      ];
      
      console.log('✅ 加载酒店列表成功:', mockHotels.length);
      setHotels(mockHotels);
    } catch (error) {
      console.error('❌ 加载酒店列表失败:', error.message);
      message.error('加载酒店列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 初始化加载
   */
  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  /**
   * 搜索酒店
   */
  const searchHotels = useCallback((keyword) => {
    console.log('搜索酒店:', keyword);
    message.info('搜索功能开发中');
  }, []);

  /**
   * 审核通过
   */
  const approveHotel = useCallback(async (hotelId) => {
    try {
      setLoading(true);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新本地状态
      setHotels(prev => prev.map(hotel => 
        hotel.key === hotelId ? { ...hotel, status: 'approved' } : hotel
      ));
      
      console.log('✅ 审核通过成功');
      message.success('审核通过！');
    } catch (error) {
      console.error('❌ 审核失败:', error.message);
      message.error('审核失败，请重试');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 审核拒绝
   */
  const rejectHotel = useCallback(async (hotelId, reason) => {
    try {
      setLoading(true);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 更新本地状态
      setHotels(prev => prev.map(hotel => 
        hotel.key === hotelId ? { ...hotel, status: 'rejected', reject_reason: reason } : hotel
      ));
      
      console.log('✅ 拒绝成功');
      message.success('已拒绝该酒店');
    } catch (error) {
      console.error('❌ 拒绝失败:', error.message);
      message.error('操作失败，请重试');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    hotels,
    loading,
    searchHotels,
    approveHotel,
    rejectHotel,
    refreshHotels: loadHotels,
  };
};

export default useHotelAudit;
