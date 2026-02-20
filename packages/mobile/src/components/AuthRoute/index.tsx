import React from 'react';
import { ErrorBlock, Button } from 'antd-mobile';
import { useNavigate, useLocation } from 'react-router-dom';

// ==========================================
// 1. 公用的“无权限/请先登录”展示页面
// ==========================================
export const NoAuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#f5f5f9' 
    }}>
      {/* 使用 antd-mobile 自带的空状态组件，非常好看 */}
      <ErrorBlock 
        status="empty" 
        title="您还未登录" 
        description="请登录后再查看该页面内容" 
      />
      
      <Button 
        color="primary" 
        style={{ marginTop: 24, width: '160px' }}
        onClick={() => {
          // 跳转到登录页！
          // 💡 小技巧：把当前想去的路径 (location.pathname) 传给登录页，
          // 这样登录成功后，可以直接跳回这个页面，而不是傻傻地回首页。
          navigate('/login', { state: { from: location.pathname } });
        }}
      >
        去登录
      </Button>
    </div>
  );
};


// ==========================================
// 2. 核心鉴权包裹组件 (Wrapper)
// ==========================================
export const AuthRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 判断是否有权限（这里以检查 Token 为例）
  const token = localStorage.getItem('TOKEN');

  if (!token) {
    // 拦截！如果没有 Token，不渲染真实页面，而是原地渲染“无权限公用页面”
    // 好处是：浏览器的 URL 不会变，用户体验更连贯
    return <NoAuthPage />;
  }

  // 放行！如果有 Token，正常渲染传入的子组件（真实页面）
  return <>{children}</>;
};