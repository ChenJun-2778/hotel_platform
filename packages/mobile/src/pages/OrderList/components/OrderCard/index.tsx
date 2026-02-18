import React from 'react';
import { Button, Toast } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

interface OrderCardProps {
  data: any; // 实际项目中最好定义详细的 Order 类型
}

const OrderCard: React.FC<OrderCardProps> = ({ data }) => {
  const navigate = useNavigate();

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending': return styles.status_pending;
      case 'confirmed': return styles.status_confirmed;
      case 'completed': return styles.status_completed;
      default: return styles.status_canceled;
    }
  };

  // 具体的按钮点击逻辑也可以封装在这里，或者通过 props 传进来
  const handleCancel = () => {Toast.show('订单已取消')};
  const handlePay = () => {Toast.show('支付成功')};
  const handleContact = () => {Toast.show('已联系客服')};
  const handleRebook = () => navigate('/');

  return (
    <div className={styles.card}>
      {/* 头部 */}
      <div className={styles.cardHeader}>
        <div className={styles.hotelName}>{data.hotelName}</div>
        <div className={`${styles.statusTag} ${getStatusClass(data.status)}`}>
          {data.statusText}
        </div>
      </div>

      {/* 中间 */}
      <div className={styles.cardBody}>
        <img src={data.image} className={styles.roomImg} alt="" />
        <div className={styles.infoCol}>
          <div className={styles.roomName}>{data.roomName}</div>
          <div className={styles.dateRange}>
            {data.checkIn} 至 {data.checkOut} · {data.nights}晚
          </div>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>总价</span>
            <span className={styles.currency}>¥</span>
            <span className={styles.price}>{data.price}</span>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className={styles.cardFooter}>
        {data.status === 'pending' && (
          <>
            <Button size='small' onClick={handleCancel}>取消</Button>
            <div style={{ width: 8 }}></div>
            <Button size='small' color='primary' onClick={handlePay}>去支付</Button>
          </>
        )}
        {data.status === 'confirmed' && (
          <Button size='small' onClick={handleContact}>联系酒店</Button>
        )}
        {(data.status === 'completed' || data.status === 'canceled') && (
          <Button size='small' color='primary' fill='outline' onClick={handleRebook}>再次预订</Button>
        )}
      </div>
    </div>
  );
};

export default OrderCard;