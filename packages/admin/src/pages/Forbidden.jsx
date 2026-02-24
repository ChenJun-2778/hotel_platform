import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Forbidden = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const handleBackHome = () => {
    // 根据用户角色跳转到对应的首页
    if (user?.role_type === 1) {
      navigate('/admin/dashboard');
    } else if (user?.role_type === 2) {
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
