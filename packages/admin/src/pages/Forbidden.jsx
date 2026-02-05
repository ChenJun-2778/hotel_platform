import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Forbidden = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleBackHome = () => {
    // 根据用户角色跳转到对应的首页
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'merchant') {
      navigate('/merchant/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: '#f0f2f5'
    }}>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问此页面。"
        extra={
          <Button type="primary" onClick={handleBackHome}>
            返回首页
          </Button>
        }
      />
    </div>
  );
};

export default Forbidden;
