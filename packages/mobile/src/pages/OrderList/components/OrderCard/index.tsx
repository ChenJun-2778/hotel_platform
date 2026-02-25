import React, { useState } from 'react';
import { Button, Toast, Dialog, Popup, PasscodeInput, NumberKeyboard } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import { CloseOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import styles from './index.module.css';
import { OrderStatus } from '@/api/Order/type';
import type { Order } from '@/api/Order/type';
import { apiPayOrder } from '@/api/Order/index';

// 读取环境变量
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

interface OrderCardProps {
  data: Order;
  onRefresh?: () => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ data, onRefresh }) => {
  const navigate = useNavigate();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');

  // 状态映射
  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return { text: '待付款', className: styles.status_pending };
      case OrderStatus.CONFIRMED:
        return { text: '待确定', className: styles.status_confirmed };
      case OrderStatus.CHECKED_IN:
        return { text: '待入住', className: styles.status_checked_in };
      case OrderStatus.COMPLETED:
        return { text: '已完成', className: styles.status_completed };
      default:
        return { text: '未知', className: '' };
    }
  };

  const statusInfo = getStatusInfo(data.status);

  // 处理房间图片
  const getRoomImage = () => {
    if (!data.room_images) {
      // 如果没有房间图片，使用酒店封面图
      return data.hotel_cover_image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32';
    }

    try {
      // 尝试解析 JSON 数组
      let imageList: string[] = [];
      
      // 如果是 JSON 数组字符串
      if (data.room_images.startsWith('[')) {
        imageList = JSON.parse(data.room_images);
      } else {
        // 如果是逗号分隔的字符串
        imageList = data.room_images.split(',').map(img => img.trim());
      }

      if (imageList.length > 0) {
        let firstImage = imageList[0];
        
        // 如果是完整的 URL（以 http 开头），直接使用
        if (firstImage.startsWith('http')) {
          return firstImage;
        }
        
        // 如果只是文件名，拼接完整的 URL
        // 假设图片存储在服务器的 /uploads 目录
        return `http://47.99.56.81:3000/uploads/${firstImage}`;
      }
    } catch (error) {
      console.error('解析房间图片失败:', error);
    }

    // 如果解析失败，使用酒店封面图或默认图
    return data.hotel_cover_image || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32';
  };

  const displayImage = getRoomImage();

  // 格式化日期
  const formatDate = (dateStr: string) => {
    return dayjs(dateStr).format('MM-DD');
  };

  // 支付按钮点击 - 打开支付密码弹窗
  const handlePay = () => {
    setPasswordVisible(true);
    setPassword('');
  };

  // 执行支付
  const handlePayment = async () => {
    // Mock 模式下模拟支付
    if (USE_MOCK) {
      Toast.show({ icon: 'loading', content: '支付中...', duration: 1000 });
      setTimeout(() => {
        Toast.show({ icon: 'success', content: '支付成功' });
        setPasswordVisible(false);
        setPassword('');
        onRefresh?.();
      }, 1000);
      return;
    }

    // 真实接口
    try {
      Toast.show({ icon: 'loading', content: '支付中...', duration: 0 });
      
      const res = await apiPayOrder(data.order_no);
      
      Toast.clear();
      setPasswordVisible(false);
      setPassword('');
      
      if (res.success) {
        Toast.show({ icon: 'success', content: '支付成功' });
        onRefresh?.();
      } else {
        Toast.show({ icon: 'fail', content: res.message || '支付失败' });
      }
    } catch (error: any) {
      Toast.clear();
      setPasswordVisible(false);
      setPassword('');
      Toast.show({ icon: 'fail', content: error.message || '支付失败' });
    }
  };

  // 监听密码输入，满6位自动提交
  React.useEffect(() => {
    if (password.length === 6) {
      handlePayment();
    }
  }, [password]);

  // 取消订单
  const handleCancel = () => {
    Dialog.confirm({
      content: '确定要取消这个订单吗？',
      onConfirm: () => {
        Toast.show('订单已取消');
        onRefresh?.();
      }
    });
  };

  // 联系酒店
  const handleContact = () => {
    Toast.show('客服电话：400-123-4567');
  };

  // 再次预订 - 跳转到酒店详情页
  const handleRebook = () => {
    if (data.hotel_id) {
      // 跳转到酒店详情页，带上酒店ID和日期参数
      const checkInDate = dayjs().format('YYYY-MM-DD');
      const checkOutDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
      navigate(`/detail/${data.hotel_id}?beginDate=${checkInDate}&endDate=${checkOutDate}`);
    } else {
      Toast.show({ icon: 'fail', content: '酒店信息不完整' });
    }
  };

  return (
    <div className={styles.card}>
      {/* 头部 */}
      <div className={styles.cardHeader}>
        <div className={styles.orderNo}>订单号：{data.order_no}</div>
        <div className={`${styles.statusTag} ${statusInfo.className}`}>
          {statusInfo.text}
        </div>
      </div>

      {/* 中间 */}
      <div className={styles.cardBody}>
        <img src={displayImage} className={styles.roomImg} alt="" />
        <div className={styles.infoCol}>
          {data.hotel_name && <div className={styles.hotelName}>{data.hotel_name}</div>}
          {data.room_type && <div className={styles.roomType}>{data.room_type}</div>}
          <div className={styles.guestName}>住客：{data.guest_name}</div>
          <div className={styles.guestPhone}>电话：{data.guest_phone}</div>
          <div className={styles.dateRange}>
            {formatDate(data.check_in_date)} 至 {formatDate(data.check_out_date)} · {data.nights}晚
          </div>
          <div className={styles.priceRow}>
            <span className={styles.priceLabel}>总价</span>
            <span className={styles.currency}>¥</span>
            <span className={styles.price}>{data.total_price}</span>
          </div>
        </div>
      </div>

      {/* 底部按钮 */}
      <div className={styles.cardFooter}>
        {data.status === OrderStatus.PENDING && (
          <>
            <Button size='small' onClick={handleCancel}>取消</Button>
            <div style={{ width: 8 }}></div>
            <Button size='small' color='primary' onClick={handlePay}>去支付</Button>
          </>
        )}
        {data.status === OrderStatus.CONFIRMED && (
          <Button size='small' onClick={handleContact}>联系酒店</Button>
        )}
        {(data.status === OrderStatus.CHECKED_IN || data.status === OrderStatus.COMPLETED) && (
          <Button size='small' color='primary' fill='outline' onClick={handleRebook}>再次预订</Button>
        )}
      </div>

      {/* 支付密码弹窗 */}
      <Popup
        visible={passwordVisible}
        onMaskClick={() => {
          setPasswordVisible(false);
          setPassword('');
        }}
        bodyStyle={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px', minHeight: '50vh' }}
      >
        <div style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>请输入支付密码</span>
            <CloseOutline 
              fontSize={24} 
              color='#999' 
              onClick={() => {
                setPasswordVisible(false);
                setPassword('');
              }}
            />
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>向 携程酒店 支付</div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>¥{data.total_price}</div>
          </div>

          <PasscodeInput 
            seperated 
            value={password}
            length={6}
          />

          <NumberKeyboard
            visible={passwordVisible}
            showCloseButton={false}
            onInput={(char) => {
              if (password.length < 6) {
                setPassword(val => val + char);
              }
            }}
            onDelete={() => {
              setPassword(val => val.slice(0, -1));
            }}
          />
        </div>
      </Popup>
    </div>
  );
};

export default OrderCard;
