import React, { useEffect } from 'react';
import { Button, Result } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleFill, CloseCircleFill } from 'antd-mobile-icons';
import styles from './index.module.css';

const PaymentResult: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const success = searchParams.get('success') === 'true';
  const orderNo = searchParams.get('orderNo') || '';
  const message = searchParams.get('message') || '';

  // 支付成功后3秒自动跳转到订单列表
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate('/order-list', { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className={styles.container}>
      <Result
        status={success ? 'success' : 'error'}
        title={success ? '支付成功' : '支付失败'}
        description={
          success 
            ? `订单号：${orderNo}\n我们会尽快发送确认短信` 
            : message || '支付过程中出现问题，请重试'
        }
        icon={
          success 
            ? <CheckCircleFill style={{ fontSize: 64, color: '#00b578' }} />
            : <CloseCircleFill style={{ fontSize: 64, color: '#ff3141' }} />
        }
      />
      
      <div className={styles.buttonGroup}>
        {success ? (
          <>
            <Button 
              block 
              color='primary' 
              size='large'
              onClick={() => navigate('/order-list', { replace: true })}
            >
              查看订单
            </Button>
            <Button 
              block 
              fill='outline'
              size='large'
              style={{ marginTop: 12 }}
              onClick={() => navigate('/', { replace: true })}
            >
              返回首页
            </Button>
          </>
        ) : (
          <>
            <Button 
              block 
              color='primary' 
              size='large'
              onClick={() => navigate(-1)}
            >
              重新支付
            </Button>
            <Button 
              block 
              fill='outline'
              size='large'
              style={{ marginTop: 12 }}
              onClick={() => navigate('/order-list', { replace: true })}
            >
              查看订单
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentResult;
