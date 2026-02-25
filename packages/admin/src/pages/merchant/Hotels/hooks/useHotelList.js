import { useState, useEffect } from 'react';
import { message } from 'antd';
import { createHotel, getHotelList, updateHotel, putUpHotel, takeDownHotel } from '../../../../services/hotelService';
import { HOTEL_STATUS } from '../../../../constants/hotelStatus';
import { useAuthStore } from '../../../../stores/authStore';

/**
 * 酒店列表管理 Hook
 */
const useHotelList = () => {
  const user = useAuthStore(state => state.user);
  const [allHotels, setAllHotels] = useState([]); // 存储所有酒店数据
  const [hotelList, setHotelList] = useState([]); // 当前显示的酒店列表
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedType, setSelectedType] = useState(null); // 当前选中的类型
  const [selectedStatus, setSelectedStatus] = useState(null); // 当前选中的状态
  const [selectedStarRating, setSelectedStarRating] = useState(null); // 当前选中的星级

  // 前端筛选和分页逻辑
  const filterAndPaginateHotels = (hotels, keyword, type, status, starRating, page, pageSize) => {
    // 1. 先按类型筛选
    let filtered = hotels;
    if (type !== null && type !== undefined) {
      filtered = hotels.filter(hotel => hotel.type === type);
      console.log(`✅ 类型筛选 (type=${type}): ${hotels.length} -> ${filtered.length}`);
    }
    
    // 2. 按状态筛选
    if (status !== null && status !== undefined) {
      filtered = filtered.filter(hotel => hotel.status === status);
      console.log(`✅ 状态筛选 (status=${status}): ${filtered.length} 条结果`);
    }
    
    // 3. 按星级筛选
    if (starRating !== null && starRating !== undefined) {
      filtered = filtered.filter(hotel => hotel.star_rating === starRating);
      console.log(`✅ 星级筛选 (star=${starRating}): ${filtered.length} 条结果`);
    }
    
    // 4. 按关键词搜索
    if (keyword) {
      filtered = filtered.filter(hotel => 
        hotel.name?.toLowerCase().includes(keyword.toLowerCase()) ||
        hotel.address?.toLowerCase().includes(keyword.toLowerCase()) ||
        hotel.location?.toLowerCase().includes(keyword.toLowerCase())
      );
      console.log(`✅ 关键词筛选 (${keyword}): ${filtered.length} 条结果`);
    }
    
    // 5. 计算分页
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedData = filtered.slice(start, end);
    
    console.log(`✅ 分页: 第${page}页, 每页${pageSize}条, 共${total}条, 显示${paginatedData.length}条`);
    
    return {
      data: paginatedData,
      total,
    };
  };

  // 加载所有酒店列表（只在初始化时调用一次）
  const loadAllHotels = async () => {
    setLoading(true);
    try {
      // 构建请求参数（请求大量数据以获取所有酒店）
      const params = {
        page: 1,
        pageSize: 1000, // 请求足够大的数量以获取所有数据
      };
      
      // 商户用户只能看到自己的酒店
      if (user?.role_type === 2 && user?.id) {
        params.user_id = user.id;
        console.log('✅ 商户用户，添加 user_id 过滤:', user.id);
      }
      
      console.log('🔍 请求所有酒店数据，参数:', params);
      
      const response = await getHotelList(params);
      console.log('✅ 后端返回的原始数据:', response);
      
      // 后端返回格式：{ data: { list: [], pagination: {} }, success: true, message: '' }
      const hotels = response.data?.list || response.list || response.data || response || [];
      
      console.log('✅ 解析后的酒店列表:', hotels);
      
      // 确保每条数据都有唯一的 id
      const hotelsWithId = Array.isArray(hotels) 
        ? hotels.map((hotel, index) => ({
            ...hotel,
            id: hotel.id || hotel._id || hotel.hotel_id || `hotel-${index}-${Date.now()}`
          }))
        : [];
      
      setAllHotels(hotelsWithId);
      console.log('✅ 加载完成，共', hotelsWithId.length, '条数据');
      
      // 初始显示所有数据
      const result = filterAndPaginateHotels(hotelsWithId, '', null, null, null, 1, pagination.pageSize);
      setHotelList(result.data);
      setPagination({
        current: 1,
        pageSize: pagination.pageSize,
        total: result.total,
      });
      
    } catch (error) {
      console.error('❌ 加载酒店列表失败:', error);
      message.error('加载酒店列表失败，请重试');
      setAllHotels([]);
      setHotelList([]);
    } finally {
      setLoading(false);
    }
  };

  // 应用筛选（类型、状态、星级切换或搜索时调用）
  const applyFilter = (
    keyword = searchKeyword, 
    type = selectedType, 
    status = selectedStatus,
    starRating = selectedStarRating,
    page = 1
  ) => {
    console.log('🔄 应用筛选 - 关键词:', keyword, '类型:', type, '状态:', status, '星级:', starRating, '页码:', page);
    setSearchKeyword(keyword);
    setSelectedType(type);
    setSelectedStatus(status);
    setSelectedStarRating(starRating);
    
    const result = filterAndPaginateHotels(allHotels, keyword, type, status, starRating, page, pagination.pageSize);
    setHotelList(result.data);
    setPagination({
      current: page,
      pageSize: pagination.pageSize,
      total: result.total,
    });
  };

  // 搜索酒店（前端筛选）
  const searchHotels = (keyword) => {
    console.log('🔍 搜索关键词:', keyword);
    applyFilter(keyword, selectedType, selectedStatus, selectedStarRating, 1);
  };

  // 切换类型（前端筛选）
  const filterByType = (type) => {
    console.log('🔄 切换类型:', type);
    applyFilter(searchKeyword, type, selectedStatus, selectedStarRating, 1);
  };

  // 切换状态（前端筛选）
  const filterByStatus = (status) => {
    console.log('🔄 切换状态:', status);
    applyFilter(searchKeyword, selectedType, status, selectedStarRating, 1);
  };

  // 切换星级（前端筛选）
  const filterByStarRating = (starRating) => {
    console.log('🔄 切换星级:', starRating);
    applyFilter(searchKeyword, selectedType, selectedStatus, starRating, 1);
  };

  // 分页变化（前端筛选）
  const handlePageChange = (page, pageSize) => {
    console.log('📄 分页变化 - 页码:', page, '每页数量:', pageSize);
    
    // 如果每页数量变化，重置到第1页
    if (pageSize !== pagination.pageSize) {
      const result = filterAndPaginateHotels(
        allHotels, 
        searchKeyword, 
        selectedType, 
        selectedStatus,
        selectedStarRating,
        1, 
        pageSize
      );
      setHotelList(result.data);
      setPagination({
        current: 1,
        pageSize: pageSize,
        total: result.total,
      });
    } else {
      const result = filterAndPaginateHotels(
        allHotels, 
        searchKeyword, 
        selectedType, 
        selectedStatus,
        selectedStarRating,
        page, 
        pageSize
      );
      setHotelList(result.data);
      setPagination({
        current: page,
        pageSize: pageSize,
        total: result.total,
      });
    }
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
      await loadAllHotels(); // 重新加载所有数据
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
      await loadAllHotels(); // 重新加载所有数据
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
      
      await loadAllHotels(); // 重新加载所有数据
      return true;
    } catch (error) {
      console.error('更新酒店状态失败:', error);
      message.error('更新酒店状态失败，请重试');
      return false;
    }
  };

  // 组件加载时获取所有酒店数据
  useEffect(() => {
    loadAllHotels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    hotelList,
    loading,
    pagination,
    searchKeyword,
    selectedStatus,
    selectedStarRating,
    searchHotels,
    filterByType,
    filterByStatus,
    filterByStarRating,
    handlePageChange,
    addHotel,
    updateHotelData,
    toggleHotelStatus,
  };
};

export default useHotelList;
