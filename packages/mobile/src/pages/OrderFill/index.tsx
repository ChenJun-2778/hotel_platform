import React, { useState, useEffect } from 'react';
import { 
  NavBar, Form, Input, Button, Toast, Popup, 
  PasscodeInput, NumberKeyboard, Picker 
} from 'antd-mobile';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CloseOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import styles from './index.module.css';
// 导入订单的api
import { apiCreateOrder, apiPayOrder } from '@/api/Order/index'

// 钟点房时间段选项（动态生成，根据当前时间禁用已过去的时段）
const getHourlyTimeSlots = (checkInDate: string) => {
  const now = dayjs();
  const selectedDate = dayjs(checkInDate);
  const isToday = selectedDate.isSame(now, 'day');
  
  const allSlots = [
    { label: '上午时段 (08:00-12:00)', value: '08:00-12:00', endHour: 12 },
    { label: '下午时段 (12:00-18:00)', value: '12:00-18:00', endHour: 18 },
    { label: '晚间时段 (18:00-22:00)', value: '18:00-22:00', endHour: 22 },
    { label: '深夜时段 (22:00-次日06:00)', value: '22:00-06:00', endHour: 30 }, // 30表示次日6点
  ];
  
  // 如果不是今天，所有时段都可选
  if (!isToday) {
    return [allSlots.map(slot => ({ label: slot.label, value: slot.value }))];
  }
  
  // 如果是今天，根据当前时间禁用已过去的时段
  const currentHour = now.hour();
  
  return [allSlots.map(slot => {
    // 如果当前时间已经超过该时段的结束时间，则禁用
    const isPast = currentHour >= slot.endHour;
    
    return {
      label: isPast ? `${slot.label} (已过期)` : slot.label,
      value: slot.value,
      disabled: isPast
    };
  })];
};

const OrderFill: React.FC = () => {
  const navigate = useNavigate();
  const { id: roomId } = useParams(); // 房间ID
  const [searchParams] = useSearchParams();

  // 从 URL 获取参数
  const hotelId = searchParams.get('hotelId');
  const hotelName = searchParams.get('hotelName') || '酒店';
  const roomName = searchParams.get('roomName') || '房间';
  const price = Number(searchParams.get('price')) || 0;
  const checkInDate = searchParams.get('beginDate') || dayjs().format('YYYY-MM-DD');
  const checkOutDate = searchParams.get('endDate') || dayjs().add(1, 'day').format('YYYY-MM-DD');
  const type = searchParams.get('type') || '1'; // 获取酒店类型
  
  // 判断是否是钟点房（type=3）
  const isHourly = type === '3';
  
  const nights = isHourly ? 0 : dayjs(checkOutDate).diff(dayjs(checkInDate), 'day');
  const totalPrice = isHourly ? price : price * nights;

  const [form] = Form.useForm();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [orderNo, setOrderNo] = useState(''); // 保存订单号
  const [submitting, setSubmitting] = useState(false);
  
  // 钟点房时间段选择
  const [timeSlotVisible, setTimeSlotVisible] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string[]>(['08:00-12:00']);
  
  // 动态生成时间段选项
  const hourlyTimeSlots = getHourlyTimeSlots(checkInDate);
  
  // 初始化时选择第一个可用的时间段
  useEffect(() => {
    if (isHourly) {
      const availableSlots = hourlyTimeSlots[0].filter((slot: any) => !slot.disabled);
      if (availableSlots.length > 0) {
        setSelectedTimeSlot([availableSlots[0].value]);
      }
    }
  }, [isHourly, checkInDate]);

  // 监听密码长度，满了6位自动提交
  useEffect(() => {
    if (password.length === 6) {
      handlePayment();
    }
  }, [password]);

  const handleSubmit = async (payNow: boolean = true) => {
    if (submitting) return;
    
    try {
      await form.validateFields();
      const values = form.getFieldsValue();
      
      // 获取用户信息
      const userInfoStr = localStorage.getItem('USER_INFO');
      // console.log('localStorage USER_INFO:', userInfoStr); // 调试日志
      
      if (!userInfoStr) {
        Toast.show({ icon: 'fail', content: '请先登录' });
        navigate('/login');
        return;
      }
      
      const userInfo = JSON.parse(userInfoStr);
      // console.log('userInfo:', userInfo); // 调试日志
      // console.log('user_id:', userInfo.id); // 调试日志
      
      if (!hotelId || !roomId) {
        Toast.show({ icon: 'fail', content: '订单信息不完整' });
        return;
      }

      setSubmitting(true);
      Toast.show({ icon: 'loading', content: '正在创建订单...', duration: 0 });

      const orderData = {
        hotel_id: Number(hotelId),
        room_id: Number(roomId),
        user_id: userInfo.id,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        guest_name: values.name,
        guest_phone: values.mobile,
        total_price: totalPrice
      };
      
      // console.log('发送的订单数据:', orderData); // 调试日志

      // 创建订单
      const res = await apiCreateOrder(orderData);

      Toast.clear();

      if (res.success) {
        setOrderNo(res.data.order_no);
        
        if (payNow) {
          // 立即支付：打开支付密码弹窗
          setPasswordVisible(true);
        } else {
          // 稍后支付：跳转到订单列表
          Toast.show({ icon: 'success', content: '订单创建成功' });
          setTimeout(() => {
            navigate('/order-list', { replace: true });
          }, 1500);
        }
      } else {
        Toast.show({ icon: 'fail', content: res.message || '创建订单失败' });
      }
    } catch (error: any) {
      console.error('❌ 创建订单失败:', error); // 调试日志
      Toast.clear();
      Toast.show({ icon: 'fail', content: error.message || '创建订单失败' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePayment = async () => {
    if (!orderNo) return;

    try {
      Toast.show({ icon: 'loading', content: '支付中...', duration: 0 });

      // 调用支付接口
      const res = await apiPayOrder(orderNo);

      Toast.clear();
      setPasswordVisible(false);
      setPassword('');

      if (res.success) {
        // 跳转到支付成功页面
        navigate(`/payment-result?success=true&orderNo=${orderNo}`, { replace: true });
      } else {
        // 跳转到支付失败页面
        navigate(`/payment-result?success=false&message=${encodeURIComponent(res.message)}`, { replace: true });
      }
    } catch (error: any) {
      Toast.clear();
      setPasswordVisible(false);
      setPassword('');
      // 跳转到支付失败页面
      navigate(`/payment-result?success=false&message=${encodeURIComponent(error.message || '支付失败')}`, { replace: true });
    }
  };

  return (
    <div className={styles.container}>
      <NavBar onBack={() => navigate(-1)}>填写订单</NavBar>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <div className={styles.hotelName}>{hotelName}</div>
          <div className={styles.roomName}>{roomName}</div>
          {isHourly ? (
            // 钟点房：只显示使用日期
            <div className={styles.dateRow}>
              <span>使用日期: {dayjs(checkInDate).format('MM月DD日')}</span>
            </div>
          ) : (
            // 普通酒店：显示入住、离店、晚数
            <div className={styles.dateRow}>
              <span>入住: {dayjs(checkInDate).format('MM月DD日')}</span>
              <span className={styles.divider}>|</span>
              <span>离店: {dayjs(checkOutDate).format('MM月DD日')}</span>
              <span className={styles.nights}>共{nights}晚</span>
            </div>
          )}
        </div>

        <div className={styles.formCard}>
          <div className={styles.cardTitle}>入住信息</div>
          <Form 
            form={form} 
            layout='horizontal'
            footer={null}
            className={styles.customForm}
          >
            <Form.Item 
              name='name' 
              label='住客姓名' 
              rules={[{ required: true, message: '请输入姓名' }]}
            >
              <Input placeholder='请输入真实姓名' />
            </Form.Item>
            <Form.Item 
              name='mobile' 
              label='手机号码' 
              rules={[
                { required: true, message: '请输入手机号' },
                { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' }
              ]}
            >
              <Input placeholder='用于接收确认短信' type='tel' maxLength={11} />
            </Form.Item>
            
            {/* 钟点房：添加时间段选择 */}
            {isHourly && (
              <Form.Item label='使用时段'>
                <div 
                  onClick={() => setTimeSlotVisible(true)}
                  style={{ 
                    padding: '8px 0', 
                    color: selectedTimeSlot[0] ? '#333' : '#999',
                    cursor: 'pointer'
                  }}
                >
                  {hourlyTimeSlots[0].find(slot => slot.value === selectedTimeSlot[0])?.label || '请选择使用时段'}
                </div>
              </Form.Item>
            )}
          </Form>
        </div>

        <div className={styles.priceCard}>
          <div className={styles.cardTitle}>费用明细</div>
          <div className={styles.priceRow}>
            <span>{isHourly ? '钟点房费用' : `房费 (${nights}晚)`}</span>
            <span>¥{totalPrice}</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.priceArea}>
            <span className={styles.totalLabel}>总价</span>
            <span className={styles.currency}>¥</span>
            <span className={styles.totalPrice}>{totalPrice}</span>
        </div>
        <div className={styles.buttonGroup}>
          <Button 
              color='default' 
              className={styles.laterBtn}
              onClick={() => handleSubmit(false)}
              loading={submitting}
              disabled={submitting}
          >
              稍后支付
          </Button>
          <Button 
              color='primary' 
              className={styles.submitBtn}
              onClick={() => handleSubmit(true)}
              loading={submitting}
              disabled={submitting}
          >
              立即支付
          </Button>
        </div>
      </div>

      {/* 支付弹窗 */}
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
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>¥{totalPrice}</div>
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

      {/* 钟点房时间段选择器 */}
      {isHourly && (
        <Picker
          columns={hourlyTimeSlots}
          visible={timeSlotVisible}
          onClose={() => setTimeSlotVisible(false)}
          value={selectedTimeSlot}
          onConfirm={(value) => {
            setSelectedTimeSlot(value as string[]);
            setTimeSlotVisible(false);
          }}
        />
      )}
    </div>
  );
};

export default OrderFill;