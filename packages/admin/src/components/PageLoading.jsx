import { Spin } from 'antd';

const PageLoading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '400px' 
  }}>
    <Spin size="large" />
  </div>
);

export default PageLoading;
