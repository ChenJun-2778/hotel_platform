import { useState, useEffect } from 'react';

/**
 * 数据统计 Hook
 */
const useStatistics = (dateRange) => {
  const [orderTrendData, setOrderTrendData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [occupancyData, setOccupancyData] = useState([]);
  const [userGrowthData, setUserGrowthData] = useState([]);

  useEffect(() => {
    // 模拟加载数据
    loadStatistics();
  }, [dateRange]);

  const loadStatistics = () => {
    // 订单趋势数据
    setOrderTrendData([
      { date: '02-05', 订单数: 45, 完成订单: 38, 取消订单: 7 },
      { date: '02-06', 订单数: 52, 完成订单: 45, 取消订单: 7 },
      { date: '02-07', 订单数: 61, 完成订单: 55, 取消订单: 6 },
      { date: '02-08', 订单数: 58, 完成订单: 52, 取消订单: 6 },
      { date: '02-09', 订单数: 67, 完成订单: 60, 取消订单: 7 },
      { date: '02-10', 订单数: 72, 完成订单: 65, 取消订单: 7 },
      { date: '02-11', 订单数: 68, 完成订单: 62, 取消订单: 6 },
    ]);

    // 收入统计数据
    setRevenueData([
      { name: '豪华大酒店', value: 125000 },
      { name: '舒适商务酒店', value: 89000 },
      { name: '经济型酒店', value: 56000 },
      { name: '度假村酒店', value: 145000 },
      { name: '其他', value: 38000 },
    ]);

    // 入住率数据
    setOccupancyData([
      { hotel: '豪华大酒店', 入住率: 85 },
      { hotel: '舒适商务酒店', 入住率: 78 },
      { hotel: '经济型酒店', 入住率: 92 },
      { hotel: '度假村酒店', 入住率: 68 },
      { hotel: '快捷酒店', 入住率: 88 },
    ]);

    // 用户增长数据
    setUserGrowthData([
      { date: '02-05', 用户数: 1050, 商户数: 85 },
      { date: '02-06', 用户数: 1068, 商户数: 86 },
      { date: '02-07', 用户数: 1092, 商户数: 88 },
      { date: '02-08', 用户数: 1105, 商户数: 90 },
      { date: '02-09', 用户数: 1128, 商户数: 91 },
      { date: '02-10', 用户数: 1156, 商户数: 93 },
      { date: '02-11', 用户数: 1182, 商户数: 95 },
    ]);
  };

  return {
    orderTrendData,
    revenueData,
    occupancyData,
    userGrowthData,
  };
};

export default useStatistics;
