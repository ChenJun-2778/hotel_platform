import React, { useState, useEffect } from 'react';
import { NavBar, Tabs, DotLoading, Toast } from 'antd-mobile';
import OrderCard from './components/OrderCard';
import styles from './index.module.css';
import { apiGetOrderList } from '@/api/Order/index';
import { OrderStatus } from '@/api/Order/type';
import type { Order } from '@/api/Order/type';
import { MOCK_ORDERS } from '@/mock/data';

// 读取环境变量，控制是否使用 Mock 数据
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const OrderList: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0); // 用于强制刷新

  // 获取订单列表
  useEffect(() => {
    const fetchOrders = async () => {
      // 如果使用 Mock 数据
      if (USE_MOCK) {
        setLoading(true);
        // 模拟网络延迟
        setTimeout(() => {
          let filteredOrders = MOCK_ORDERS;
          
          // 根据 activeTab 过滤
          if (activeTab !== 'all') {
            const statusMap: Record<string, OrderStatus> = {
              'pending': OrderStatus.PENDING,
              'confirmed': OrderStatus.CONFIRMED,
              'checked_in': OrderStatus.CHECKED_IN,
              'completed': OrderStatus.COMPLETED
            };
            const targetStatus = statusMap[activeTab];
            filteredOrders = MOCK_ORDERS.filter(order => order.status === targetStatus);
          }
          
          setOrderList(filteredOrders);
          setLoading(false);
        }, 500);
        return;
      }

      // 使用真实接口
      try {
        const userInfoStr = localStorage.getItem('USER_INFO');
        if (!userInfoStr) {
          Toast.show({ icon: 'fail', content: '请先登录' });
          return;
        }

        const userInfo = JSON.parse(userInfoStr);
        setLoading(true);

        // 根据 activeTab 决定是否传 status 参数
        const params: any = { user_id: userInfo.id };
        if (activeTab !== 'all') {
          const statusMap: Record<string, OrderStatus> = {
            'pending': OrderStatus.PENDING,
            'confirmed': OrderStatus.CONFIRMED,
            'checked_in': OrderStatus.CHECKED_IN,
            'completed': OrderStatus.COMPLETED
          };
          params.status = statusMap[activeTab];
        }

        const res = await apiGetOrderList(params);

        if (res.success) {
          setOrderList(res.data.orders || []);
        } else {
          Toast.show({ icon: 'fail', content: res.message || '获取订单列表失败' });
        }
      } catch (error: any) {
        Toast.show({ icon: 'fail', content: error.message || '获取订单列表失败' });
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [activeTab, refreshKey]); // 添加 refreshKey 依赖

  // 刷新订单列表
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className={styles.container}>
      
      {/* 顶部固定区域 */}
      <div className={styles.topFixedArea}>
        <NavBar back={null} style={{ background: '#fff' }}>订单列表</NavBar>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab title='全部' key='all' />
          <Tabs.Tab title='待付款' key='pending' />
          <Tabs.Tab title='待确定' key='confirmed' />
          <Tabs.Tab title='待入住' key='checked_in' />
          <Tabs.Tab title='已完成' key='completed' />
        </Tabs>
      </div>

      {/* 列表内容 */}
      <div className={styles.listContent}>
        {loading ? (
          <div className={styles.loadingWrapper}>
            <DotLoading color='primary' /> 正在加载订单...
          </div>
        ) : orderList.length === 0 ? (
          <div className={styles.empty}>暂无相关订单</div>
        ) : (
          orderList.map(item => (
            <OrderCard key={item.id} data={item} onRefresh={handleRefresh} />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
