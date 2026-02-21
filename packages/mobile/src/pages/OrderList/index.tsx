import React, { useState, useMemo } from 'react';
import { NavBar, Tabs } from 'antd-mobile'; // 1. 删掉了 Button, Toast, TabBar
// import { useNavigate } from 'react-router-dom'; // 2. 如果这里没有其他跳转逻辑，useNavigate 也可以删掉
import OrderCard from './components/OrderCard'; // 引入子组件
import styles from './index.module.css';

// ... (MOCK_ORDERS 数据保持不变) ...
const MOCK_ORDERS = [
  // ... 你的数据 ...
  {
    id: 'ORD2026021101',
    hotelName: '我的豪华酒店',
    roomName: '尊享大床房',
    image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32',
    checkIn: '02-15',
    checkOut: '02-17',
    nights: 2,
    price: 1776,
    status: 'confirmed',
    statusText: '待入住'
  },
  {
    id: 'ORD2026021102',
    hotelName: '舒适商务酒店',
    roomName: '标准双床房',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427',
    checkIn: '02-12',
    checkOut: '02-14',
    nights: 2,
    price: 1196,
    status: 'pending',
    statusText: '待付款'
  },
  {
    id: 'ORD2026021003',
    hotelName: '外滩景观酒店',
    roomName: '江景套房',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd',
    checkIn: '02-01',
    checkOut: '02-02',
    nights: 1,
    price: 2664,
    status: 'completed',
    statusText: '已离店'
  },
  {
    id: 'ORD2026020805',
    hotelName: '老友记民宿',
    roomName: '温馨大床',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
    checkIn: '01-20',
    checkOut: '01-21',
    nights: 1,
    price: 499,
    status: 'canceled',
    statusText: '已取消'
  }
];

const OrderList: React.FC = () => {
  // const navigate = useNavigate(); // 如果没用到跳转，这行也能删
  const [activeTab, setActiveTab] = useState('all');

  // 筛选逻辑保留
  const filteredList = useMemo(() => {
    if (activeTab === 'all') return MOCK_ORDERS;
    return MOCK_ORDERS.filter(item => item.status === activeTab);
  }, [activeTab]);

  // ❌ 删除了 getStatusClass (逻辑移到了 OrderCard)
  // ❌ 删除了 handleTabChange (逻辑移到了 MainLayout)

  return (
    <div className={styles.container}>
      
      {/* 顶部固定区域 */}
      <div className={styles.topFixedArea}>
        <NavBar back={null} style={{ background: '#fff' }}>订单列表</NavBar>
        
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <Tabs.Tab title='全部' key='all' />
          <Tabs.Tab title='待付款' key='pending' />
          <Tabs.Tab title='待入住' key='confirmed' />
          <Tabs.Tab title='已完成' key='completed' />
          <Tabs.Tab title='已取消' key='canceled' />
        </Tabs>
      </div>

      {/* 列表内容 */}
      <div className={styles.listContent}>
        {filteredList.length === 0 ? (
          <div className={styles.empty}>暂无相关订单</div>
        ) : (
          filteredList.map(item => (
            // ✅ 极其简洁：只负责循环和传数据
            <OrderCard key={item.id} data={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;