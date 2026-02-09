import React, { useState, useEffect } from 'react';
import { 
  NavBar, Form, Input, Button, Toast, Dialog, Popup, 
  PasscodeInput, NumberKeyboard 
} from 'antd-mobile';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { CloseOutline } from 'antd-mobile-icons';
import styles from './index.module.css';

const OrderFill: React.FC = () => {
  const navigate = useNavigate();
  // const { id } = useParams(); // 暂时没用到，先注释防止报 warning
  const [searchParams] = useSearchParams();

  const roomName = searchParams.get('roomName') || '高级大床房';
  const price = Number(searchParams.get('price')) || 500;
  const hotelName = '上海陆家嘴禧玥酒店';
  const checkIn = '02月20日';
  const checkOut = '02月22日';
  const nights = 2;
  const totalPrice = price * nights;

  const [form] = Form.useForm();

  // ✅ 1. 补全：控制弹窗显示的状态
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // ✅ 2. 补全：控制密码输入的状态
  const [password, setPassword] = useState('');

  // 监听密码长度，满了6位自动提交
  useEffect(() => {
    if (password.length === 6) {
      handlePayment(password);
    }
  }, [password]);

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      // 打开密码弹窗
      setPasswordVisible(true);
    } catch (error) {
      Toast.show({ icon: 'fail', content: '请填写完整信息' });
    }
  };

  const handlePayment = (value: string) => {
    Toast.show({
      icon: 'loading',
      content: '支付中...',
      duration: 1500,
    });

    setTimeout(() => {
      setPasswordVisible(false);
      setPassword(''); // 清空密码
      
      Dialog.alert({
        header: '🎉 支付成功',
        title: '预订成功',
        content: `恭喜您，订单已确认！我们会尽快发送确认短信。`,
        onConfirm: () => {
          navigate('/'); 
        },
      });
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <NavBar onBack={() => navigate(-1)}>填写订单</NavBar>

      <div className={styles.content}>
        <div className={styles.infoCard}>
          <div className={styles.hotelName}>{hotelName}</div>
          <div className={styles.roomName}>{roomName}</div>
          <div className={styles.dateRow}>
            <span>入住: {checkIn}</span>
            <span className={styles.divider}>|</span>
            <span>离店: {checkOut}</span>
            <span className={styles.nights}>共{nights}晚</span>
          </div>
          <div className={styles.tags}>
            <span>早餐: 含双早</span>
            <span>取消规则: 不可取消</span>
          </div>
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
              rules={[{ required: true, message: '请输入手机号' }]}
            >
              <Input placeholder='用于接收确认短信' type='number' />
            </Form.Item>
          </Form>
        </div>

        <div className={styles.priceCard}>
          <div className={styles.cardTitle}>费用明细</div>
          <div className={styles.priceRow}>
            <span>房费 ({nights}晚)</span>
            <span>¥{totalPrice}</span>
          </div>
          <div className={styles.priceRow}>
            <span>优惠券</span>
            <span className={styles.discount}>-¥0</span>
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.priceArea}>
            <span className={styles.totalLabel}>总价</span>
            <span className={styles.currency}>¥</span>
            <span className={styles.totalPrice}>{totalPrice}</span>
        </div>
        <Button 
            color='primary' 
            className={styles.submitBtn}
            onClick={handleSubmit}
        >
            提交订单
        </Button>
      </div>

      {/* --- 支付弹窗 --- */}
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
                <CloseOutline fontSize={24} color='#999' onClick={() => setPasswordVisible(false)}/>
            </div>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '14px', color: '#666' }}>向 携程酒店 支付</div>
                <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '8px' }}>¥{totalPrice}</div>
            </div>

            {/* ✅ 修复：这里去掉了 keyboard 属性 */}
            <PasscodeInput 
                seperated 
                value={password}
                length={6}
            />

            {/* ✅ 数字键盘 */}
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

export default OrderFill;