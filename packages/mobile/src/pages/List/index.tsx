import React from 'react';
import { NavBar } from 'antd-mobile';
// 引入跳转钩子
import { useNavigate, useSearchParams } from 'react-router-dom';

const List: React.FC = () => {
  // 获取 searchParams 对象
  const [searchParams] = useSearchParams();
  const type  = Number(searchParams.get('type'))
  const navigate = useNavigate();
  const handleBack = () => {
  // 如果有历史记录就后退，否则根据参数手动跳转，防止“退无可退”
  if (window.history.length > 1) {
    navigate(-1);
    return
  } 
  const pathMap: Record<string, string> = {
    2: '/overseas',
    3: '/hourly',
    4: '/inn'
  }
  // 根据 type 获取路径，如果没有匹配到则回首页 '/'
  const targetPath = pathMap[type || ''] || '/';
  navigate(targetPath);

}
  return (
    <div>
      {/* 点击返回按钮跳回首页 */}
      <NavBar onBack={handleBack}>酒店列表</NavBar>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h3>这里是酒店列表页</h3>
      </div>
    </div>
  );
};

export default List;