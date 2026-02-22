// 路径：src/pages/CitySelect/index.tsx
import React from 'react';
import { NavBar, CapsuleTabs } from 'antd-mobile';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styles from './index.module.css'; // 确保这里面写了 .container { height: 100vh; overflow: hidden; }

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const activeKey = location.pathname.includes('overseas') ? 'overseas' : 'domestic';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <NavBar onBack={() => navigate(-1)}>选择城市</NavBar>
        
        <div style={{ padding: '8px 12px', background: '#fff' }}>
          <CapsuleTabs 
            activeKey={activeKey} 
            onChange={(key) => {
              // ✅ 修复 Bug 1：必须是 /city-select/，不能是 /city/
              navigate(`/city-select/${key}${location.search}`); 
            }}
          >
            <CapsuleTabs.Tab title="国内" key="domestic" />
            <CapsuleTabs.Tab title="海外" key="overseas" />
          </CapsuleTabs>
        </div>
      </div>

      {/* ✅ 修复 Bug 2：加上 minHeight: 0 彻底锁死高度，防止子组件撑爆屏幕 */}
      <div className={styles.contentWrapper} style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </div>
    </div>
  );
};

export default CitySelect;