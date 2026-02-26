import { useState, useEffect } from 'react';
import { message } from 'antd';
import { getHotelList } from '../../../../services/hotelService';
import { getUserList } from '../../../../services/userService';
import dayjs from 'dayjs';

/**
 * 数据统计 Hook - 基于可用API的简化实现
 * 注意：由于订单和房间API需要特定参数，暂时使用模拟数据
 */
const useStatistics = (dateRange) => {
  const [orderTrendData, setOrderTrendData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [loading, setLoading] = useState(false);

  /**
   * 加载统计数据
   */
  const loadStatistics = async () => {
    if (!dateRange || dateRange.length !== 2) {
      console.warn('⚠️ dateRange 无效');
      return;
    }

    try {
      setLoading(true);
      
      // 只请求可用的数据
      const [hotelsRes, usersRes] = await Promise.all([
        getHotelList({ page: 1, pageSize: 1000 }),
        getUserList({ page: 1, pageSize: 1000 }),
      ]);

      const hotels = hotelsRes.data?.list || [];
      const users = usersRes.data?.list || [];

      console.log('✅ 统计数据加载完成:', {
        酒店数: hotels.length,
        用户数: users.length,
      });

      // 处理用户增长数据（真实数据）
      processUserGrowth(users, hotels, dateRange);
      
      // 其他数据使用模拟数据（因为API限制）
      generateMockData(dateRange);
      
    } catch (error) {
      console.error('❌ 加载统计数据失败:', error);
      message.warning('部分统计数据加载失败，显示模拟数据');
      generateMockData(dateRange);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 生成模拟数据
   */
  const generateMockData = (dateRange) => {
    const [startDate, endDate] = dateRange;
    const days = endDate.diff(startDate, 'day') + 1;
    
    // 订单趋势模拟数据
    const trendData = [];
    for (let i = 0; i < days; i++) {
      const date = startDate.add(i, 'day');
      const dateStr = date.format('MM-DD');
      const baseOrders = 45 + Math.floor(Math.random() * 30);
      const completed = Math.floor(baseOrders * 0.85);
      const cancelled = baseOrders - completed;
      
      trendData.push({
        date: dateStr,
        订单数: baseOrders,
        完成订单: completed,
        取消订单: cancelled,
      });
    }
    setOrderTrendData(trendData);

    // 收入统计模拟数据
    setRevenueData([
      { name: '豪华大酒店', value: 125000 },
      { name: '舒适商务酒店', value: 89000 },
      { name: '经济型酒店', value: 56000 },
      { name: '度假村酒店', value: 145000 },
      { name: '其他', value: 38000 },
    ]);

    // 入住率模拟数据
    setOccupancyData([
      { hotel: '豪华大酒店', 入住率: 85 },
      { hotel: '舒适商务酒店', 入住率: 78 },
      { hotel: '经济型酒店', 入住率: 92 },
      { hotel: '度假村酒店', 入住率: 68 },
      { hotel: '快捷酒店', 入住率: 88 },
    ]);
  };

  /**
   * 处理用户增长数据（真实数据）
   */
  const processUserGrowth = (users, hotels, dateRange) => {
    const [startDate, endDate] = dateRange;
    const days = endDate.diff(startDate, 'day') + 1;
    
    // 生成日期范围内的所有日期
    const growthData = [];
    for (let i = 0; i < days; i++) {
      const date = startDate.add(i, 'day');
      const dateStr = date.format('MM-DD');
      
      // 统计截止到当天的累计用户数和商户数
      const cumulativeUsers = users.filter(user => {
        const userDate = dayjs(user.created_at);
        return userDate.isBefore(date.add(1, 'day')) && user.role_type === 3; // 普通用户
      }).length;
      
      const cumulativeMerchants = hotels.filter(hotel => {
        const hotelDate = dayjs(hotel.created_at);
        return hotelDate.isBefore(date.add(1, 'day'));
      }).length;
      
      growthData.push({
        date: dateStr,
        用户数: cumulativeUsers,
        商户数: cumulativeMerchants,
      });
    }
    
    setUserGrowthData(growthData);
  };

  useEffect(() => {
    if (dateRange && dateRange.length === 2) {
      loadStatistics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange?.[0]?.valueOf(), dateRange?.[1]?.valueOf()]);

  return {
    orderTrendData,
    revenueData,
    occupancyData,
    userGrowthData,
    loading,
  };
};

export default useStatistics;
