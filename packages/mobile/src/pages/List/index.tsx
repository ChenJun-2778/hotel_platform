import React from 'react';
import { NavBar } from 'antd-mobile';
// 引入跳转钩子
import { useNavigate } from 'react-router-dom';

const List: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div>
      {/* 点击返回按钮跳回首页 */}
      <NavBar onBack={() => navigate('/')}>酒店列表</NavBar>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>这里是酒店列表页</h3>
      </div>
    </div>
  );
};

export default List;