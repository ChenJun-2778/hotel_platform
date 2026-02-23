import { useState, useEffect } from 'react';
import { message } from 'antd';
import { createHotel, getHotelList, updateHotel, putUpHotel, takeDownHotel } from '../../../../services/hotelService';
import { HOTEL_STATUS } from '../../../../constants/hotelStatus';
import { useAuth } from '../../../../contexts/AuthContext';

/**
 * 酒店列表管理 Hook
 */
const useHotelList = () => {
  const { user } = useAuth();
  const [hotelList, setHotelList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  // 加载酒店列表
  const loadHotelList = async (page = pagination.current, pageSize = pagination.pageSize, keyword = searchKeyword) => {
    setLoading(true);
    try {
      // 构建请求参数
      const params = {
        page,
        pageSize,
      };
      
      // 如果有搜索关键词，添加到参数中
      if (keyword) {
        params.keyword = keyword;
      }
      
      // 商户用户只能看到自己的酒店，添加 user_id 参数
      if (user?.role_type === 2 && user?.id) {
        params.user_id = user.id;
        console.log('✅ 商户用户，添加 user_id 过滤:', user.id);
      }
      
      console.log('🔍 请求参数:', params);
      
      const response = await getHotelList(params);
      console.log('✅ 后端返回的原始数据:', response);
      console.log('✅ 后端返回的酒店列表详细数据:', JSON.stringify(response.data?.list || response.list, null, 2));
      
      // 后端返回格式：{ data: { list: [], pagination: {} }, success: true, message: '' }
      const hotels = response.data?.list || response.list || response.data || response || [];
      const paginationData = response.data?.pagination || response.pagination || {};
      
      console.log('✅ 解析后的酒店列表:', hotels);
      console.log('✅ 分页信息:', paginationData);
      
      // 检查是否有拒绝原因字段
      hotels.forEach((hotel, index) => {
        if (hotel.status === 3) { // 已拒绝状态
          console.log(`🔍 酒店 ${index + 1} (${hotel.name}) - 状态: 已拒绝`);
          console.log(`🔍 rejection_reason:`, hotel.rejection_reason);
          console.log(`🔍 reject_reason:`, hotel.reject_reason);
        }
      });
      
      // 确保每条数据都有唯一的 id
      const hotelsWithId = Array.isArray(hotels) 
        ? hotels.map((hotel, index) => ({
            ...hotel,
            id: hotel.id || hotel._id || hotel.hotel_id || `hotel-${index}-${Date.now()}`
          }))
        : [];
      
      setHotelList(hotelsWithId);
      
      // 更新分页信息
      setPagination({
        current: paginationData.page || page,
        pageSize: paginationData.pageSize || pageSize,
        total: paginationData.total || hotelsWithId.length,
      });
      
      console.log('✅ 加载完成，共', hotelsWithId.length, '条数据');
      
    } catch (error) {
      console.error('❌ 加载酒店列表失败:', error);
      message.error('加载酒店列表失败，请重试');
      setHotelList([]);
    } finally {
      setLoading(false);
    }
  };

  // 搜索酒店
  const searchHotels = async (keyword) => {
    console.log('🔍 搜索关键词:', keyword);
    setSearchKeyword(keyword);
    await loadHotelList(1, pagination.pageSize, keyword);
  };

  // 分页变化
  const handlePageChange = async (page, pageSize) => {
    console.log('📄 分页变化 - 页码:', page, '每页数量:', pageSize);
    await loadHotelList(page, pageSize, searchKeyword);
  };

  // 添加酒店
  const addHotel = async (hotelData) => {
    try {
      // 检查用户信息
      if (!user || !user.id) {
        console.error('❌ 用户信息缺失:', user);
        message.error('用户信息缺失，请重新登录');
        return false;
      }
      
      // 添加当前用户ID
      const submitData = {
        ...hotelData,
        user_id: user.id, // 添加用户ID
      };
      
      // 严格检查并清理所有 undefined、null 值
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined || submitData[key] === null) {
          console.warn(`⚠️ useHotelList - 字段 ${key} 的值为 ${submitData[key]}，已设置为空字符串`);
          submitData[key] = '';
        }
      });
      
      console.log('✅ 创建酒店 - 用户ID:', user.id);
      console.log('✅ 创建酒店 - 用户信息:', JSON.stringify(user, null, 2));
      console.log('✅ 创建酒店 - 最终提交数据:', JSON.stringify(submitData, null, 2));
      
      await createHotel(submitData);
      message.success('酒店添加成功！');
      await loadHotelList(); // 重新加载列表
      return true;
    } catch (error) {
      console.error('❌ 添加酒店失败:', error);
      
      // 特殊处理外键约束错误
      if (error.message && error.message.includes('foreign key constraint fails')) {
        console.error('❌ 数据库外键约束错误 - 用户ID不存在于数据库中');
        console.error('❌ 当前用户ID:', user.id);
        console.error('❌ 请联系后端开发人员检查数据库 users 表');
        message.error(`数据库错误：用户ID ${user.id} 不存在，请联系管理员或重新登录`);
      } else {
        message.error(error.message || '添加酒店失败，请重试');
      }
      return false;
    }
  };

  // 更新酒店
  const updateHotelData = async (id, hotelData) => {
    try {
      console.log('✅ 开始更新酒店 - ID:', id);
      console.log('✅ 提交数据:', JSON.stringify(hotelData, null, 2));
      const response = await updateHotel(id, hotelData);
      console.log('✅ 更新酒店成功:', response);
      message.success('酒店更新成功！');
      await loadHotelList(); // 重新加载列表
      return true;
    } catch (error) {
      console.error('❌ 更新酒店失败 - ID:', id);
      console.error('❌ 错误详情:', error);
      console.error('❌ 错误消息:', error.message);
      message.error(error.message || '更新酒店失败，请重试');
      return false;
    }
  };

  // 更新酒店状态（上架/下架）
  const toggleHotelStatus = async (id, currentStatus) => {
    try {
      // 营业中(1)可以下架，已下架(0)和已拒绝(3)可以上架
      if (currentStatus === HOTEL_STATUS.ONLINE) {
        // 下架
        await takeDownHotel(id);
        message.success('酒店已下架');
      } else if (currentStatus === HOTEL_STATUS.OFFLINE || currentStatus === HOTEL_STATUS.REJECTED) {
        // 上架（已下架或已拒绝状态都可以上架）
        await putUpHotel(id);
        if (currentStatus === HOTEL_STATUS.REJECTED) {
          message.success('酒店已重新提交审核');
        } else {
          message.success('酒店已上架');
        }
      } else {
        message.warning('当前状态不允许上架/下架操作');
        return false;
      }
      
      await loadHotelList(); // 重新加载列表
      return true;
    } catch (error) {
      console.error('更新酒店状态失败:', error);
      message.error('更新酒店状态失败，请重试');
      return false;
    }
  };

  // 组件加载时获取列表
  useEffect(() => {
    loadHotelList();
  }, []);

  return {
    hotelList,
    loading,
    pagination,
    searchKeyword,
    loadHotelList,
    searchHotels,
    handlePageChange,
    addHotel,
    updateHotelData,
    toggleHotelStatus,
  };
};

export default useHotelList;
