import React, { useState, useMemo } from 'react';
import { NavBar, Tabs, Button, Toast, TabBar } from 'antd-mobile'; // 👈 引入 TabBar
import { useNavigate } from 'react-router-dom';
import { 
  AppOutline, 
  UnorderedListOutline, 
  UserOutline 
} from 'antd-mobile-icons'; // 👈 引入图标
import styles from './index.module.css';

// ... (MOCK_ORDERS 数据保持不变，省略以节省空间) ...
const MOCK_ORDERS = [
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
  // ... 其他数据 ...
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const filteredList = useMemo(() => {
    if (activeTab === 'all') return MOCK_ORDERS;
    return MOCK_ORDERS.filter(item => item.status === activeTab);
  }, [activeTab]);

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.status_pending;
      case 'confirmed': return styles.status_confirmed;
      case 'completed': return styles.status_completed;
      default: return styles.status_canceled;
    }
  };

  // ✅ 底部 TabBar 跳转逻辑
  const handleTabChange = (key: string) => {
    if (key === 'home') navigate('/');
    if (key === 'order') navigate('/order-list'); // 已经在当前页，其实不跳也行，但保持一致
    if (key === 'user') navigate('/user');
  };

  return (
    <div className={styles.container}>
      
      {/* 顶部固定区域 */}
      <div className={styles.topFixedArea}>
        {/* 🔥 修改：去掉了 back={null} 或 onBack，作为主页通常不显示返回箭头 */}
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
            <div key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.hotelName}>{item.hotelName}</div>
                <div className={`${styles.statusTag} ${getStatusClass(item.status)}`}>
                  {item.statusText}
                </div>
              </div>
              <div className={styles.cardBody}>
                <img src={item.image} className={styles.roomImg} alt="" />
                <div className={styles.infoCol}>
                  <div className={styles.roomName}>{item.roomName}</div>
                  <div className={styles.dateRange}>
                    {item.checkIn} 至 {item.checkOut} · {item.nights}晚
                  </div>
                  <div className={styles.priceRow}>
                     <span className={styles.priceLabel}>总价</span>
                     <span className={styles.currency}>¥</span>
                     <span className={styles.price}>{item.price}</span>
                  </div>
                </div>
              </div>
              <div className={styles.cardFooter}>
                 {item.status === 'pending' && (
                   <>
                     <Button size='small' onClick={() => { Toast.show('订单已取消'); }}>取消</Button>
                     <div style={{width: 8}}></div>
                     <Button size='small' color='primary' onClick={() => { Toast.show('支付成功'); }}>去支付</Button>
                   </>
                 )}
                 {item.status === 'confirmed' && (
                    <Button size='small' onClick={() => { Toast.show('已联系客服'); }}>联系酒店</Button>
                 )}
                 {(item.status === 'completed' || item.status === 'canceled') && (
                    <Button size='small' color='primary' fill='outline' onClick={() => { navigate('/'); }}>再次预订</Button>
                 )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;