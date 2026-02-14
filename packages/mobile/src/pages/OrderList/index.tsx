import React, { useState, useMemo } from 'react';
import { NavBar, Tabs, Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

// 1. Mock 数据
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
  // ✅ 1. 恢复状态管理
  const [activeTab, setActiveTab] = useState('all');

  // ✅ 2. 计算筛选后的列表 (使用 useMemo 优化性能，其实直接 filter 也可以)
  const filteredList = useMemo(() => {
    if (activeTab === 'all') {
      return MOCK_ORDERS;
    }
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

  return (
    <div className={styles.container}>
      
      {/* ✅ 头部固定区域：包含 NavBar 和 Tabs */}
      <div className={styles.topFixedArea}>
        <NavBar onBack={() => navigate(-1)} style={{ background: '#fff' }}>我的订单</NavBar>
        
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
              
              {/* 卡片头部 */}
              <div className={styles.cardHeader}>
                <div className={styles.hotelName}>{item.hotelName}</div>
                <div className={`${styles.statusTag} ${getStatusClass(item.status)}`}>
                  {item.statusText}
                </div>
              </div>

              {/* 中间信息 */}
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

              {/* 底部按钮 (注意 onClick 的花括号写法) */}
              <div className={styles.cardFooter}>
                 {item.status === 'pending' && (
                   <>
                     <Button size='small' onClick={() => {
                        Toast.show('订单已取消');
                     }}>取消</Button>
                     {/* 间隔一下 */}
                     <div style={{width: 8}}></div>
                     <Button size='small' color='primary' onClick={() => {
                        Toast.show('支付成功');
                     }}>去支付</Button>
                   </>
                 )}
                 {item.status === 'confirmed' && (
                    <Button size='small' onClick={() => {
                        Toast.show('已联系客服');
                    }}>联系酒店</Button>
                 )}
                 {(item.status === 'completed' || item.status === 'canceled') && (
                    <Button size='small' color='primary' fill='outline' onClick={() => {
                        navigate('/'); 
                    }}>再次预订</Button>
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