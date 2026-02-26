import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { getHotelAuditList, approveHotel as approveHotelAPI, rejectHotel as rejectHotelAPI } from '../../../../services/hotelService';

/**
 * 酒店审核管理 Hook
 */
const useHotelAudit = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [statusFilter, setStatusFilter] = useState(null); // 状态筛选
  const [searchKeyword, setSearchKeyword] = useState(''); // 搜索关键词

  /**
   * 加载酒店列表
   */
  const loadHotels = useCallback(async (page = 1, pageSize = 10, status = null, keyword = '') => {
    try {
      setLoading(true);
      
      const params = {
        page,
        pageSize,
      };
      
      // 如果有状态筛选，添加到参数中
      if (status !== null && status !== undefined) {
        params.status = status;
      }
      
      // 如果有搜索关键词，添加到参数中
      if (keyword && keyword.trim()) {
        params.keyword = keyword.trim();
      }
      
      console.log('🔍 请求参数:', params);
      
      const response = await getHotelAuditList(params);
      
      // 处理返回数据 - 适配实际后端返回结构
      const hotelList = response.data?.list || [];
      const paginationData = response.data?.pagination || {};
      const total = paginationData.total || 0;
      
      console.log('✅ 加载酒店审核列表成功:', hotelList.length, '条');
      
      // 转换数据格式 - 适配实际字段名
      const formattedHotels = hotelList.map(hotel => ({
        key: hotel.id,
        id: hotel.id,
        name: hotel.hotel_name || hotel.name || '-',
        merchant: hotel.merchant_name || hotel.user_name || '-',
        phone: hotel.hotel_phone || hotel.phone || '-',
        address: hotel.address || '-',
        star_rating: hotel.star_rating || 3,
        status: getStatusKey(hotel.status), // 转换状态
        submitTime: formatDate(hotel.created_at) || '-',
        reject_reason: hotel.rejection_reason || hotel.reject_reason || null,
      }));
      
      setHotels(formattedHotels);
      setPagination({
        current: page,
        pageSize,
        total,
      });
    } catch (error) {
      console.error('❌ 加载酒店列表失败:', error.message);
      message.error('加载酒店列表失败');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 格式化日期
   */
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  /**
   * 转换后端状态值到前端状态key
   * 后端：0-已下线，1-营业中，2-待审批，3-审批拒绝
   * 前端：pending, approved, rejected
   */
  const getStatusKey = (status) => {
    const statusMap = {
      0: 'offline',    // 已下线
      1: 'approved',   // 营业中（已通过）
      2: 'pending',    // 待审批
      3: 'rejected',   // 审批拒绝
    };
    return statusMap[status] || 'pending';
  };

  /**
   * 转换前端状态key到后端状态值（预留，暂未使用）
   */
  // const getStatusValue = (statusKey) => {
  //   const statusMap = {
  //     'offline': 0,
  //     'approved': 1,
  //     'pending': 2,
  //     'rejected': 3,
  //   };
  //   return statusMap[statusKey];
  // };

  /**
   * 初始化加载
   */
  useEffect(() => {
    loadHotels(1, 10, null, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 搜索酒店
   */
  const searchHotels = useCallback((keyword) => {
    console.log('🔍 搜索酒店:', keyword);
    setSearchKeyword(keyword);
    loadHotels(1, pagination.pageSize, statusFilter, keyword);
  }, [pagination.pageSize, statusFilter, loadHotels]);

  /**
   * 切换状态筛选
   */
  const filterByStatus = useCallback((status) => {
    setStatusFilter(status);
    loadHotels(1, pagination.pageSize, status, searchKeyword);
  }, [pagination.pageSize, searchKeyword, loadHotels]);

  /**
   * 分页变化
   */
  const handlePageChange = useCallback((page, pageSize) => {
    loadHotels(page, pageSize, statusFilter, searchKeyword);
  }, [statusFilter, searchKeyword, loadHotels]);

  /**
   * 审核通过
   */
  const approveHotel = useCallback(async (hotelId) => {
    try {
      setLoading(true);
      
      await approveHotelAPI(hotelId);
      
      console.log('✅ 审核通过成功');
      message.success('审核通过！');
      
      // 重新加载列表
      await loadHotels(pagination.current, pagination.pageSize, statusFilter, searchKeyword);
    } catch (error) {
      console.error('❌ 审核失败:', error.message);
      message.error(error.message || '审核失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [pagination, statusFilter, searchKeyword, loadHotels]);

  /**
   * 审核拒绝
   */
  const rejectHotel = useCallback(async (hotelId, reason) => {
    try {
      setLoading(true);
      
      await rejectHotelAPI(hotelId, reason);
      
      console.log('✅ 拒绝成功');
      message.success('已拒绝该酒店');
      
      // 重新加载列表
      await loadHotels(pagination.current, pagination.pageSize, statusFilter, searchKeyword);
    } catch (error) {
      console.error('❌ 拒绝失败:', error.message);
      message.error(error.message || '操作失败，请重试');
    } finally {
      setLoading(false);
    }
  }, [pagination, statusFilter, searchKeyword, loadHotels]);

  return {
    hotels,
    loading,
    pagination,
    searchHotels,
    filterByStatus,
    handlePageChange,
    approveHotel,
    rejectHotel,
    refreshHotels: () => loadHotels(pagination.current, pagination.pageSize, statusFilter, searchKeyword),
  };
};

export default useHotelAudit;
