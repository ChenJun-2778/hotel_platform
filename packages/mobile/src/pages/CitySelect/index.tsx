import React, { useState } from 'react';
import { NavBar, CapsuleTabs, SearchBar } from 'antd-mobile';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styles from './index.module.css';

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // ✅ 搜索词状态上移到父组件
  const [keyword, setKeyword] = useState('');

  const activeKey = location.pathname.includes('overseas') ? 'overseas' : 'domestic';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <NavBar onBack={() => navigate(-1)}>选择城市</NavBar>
        
        {/* Tab 切换 */}
        <div style={{ padding: '8px 12px 4px', background: '#fff' }}>
          <CapsuleTabs 
            activeKey={activeKey} 
            onChange={(key) => navigate(`/city-select/${key}${location.search}`)}
          >
            <CapsuleTabs.Tab title="国内" key="domestic" />
            <CapsuleTabs.Tab title="海外" key="overseas" />
          </CapsuleTabs>
        </div>

        {/* ✅ 搜索框统一放在这里，境内境外共用 */}
        <div className={styles.searchWrapper}>
          <SearchBar 
            placeholder='输入城市名、拼音或首字母查询' 
            style={{ '--background': '#f5f5f5' }} 
            value={keyword}
            onChange={val => setKeyword(val)}
            onClear={() => setKeyword('')}
          />
        </div>
      </div>

      <div className={styles.contentWrapper} style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        {/* ✅ 通过 context 将 keyword 传给子路由组件 */}
        <Outlet context={{ keyword }} />
      </div>
    </div>
  );
};

export default CitySelect;