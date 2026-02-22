import React, { useState } from 'react';
import { NavBar, CapsuleTabs, SearchBar } from 'antd-mobile';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import styles from './index.module.css';

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [keyword, setKeyword] = useState('');

  // ✅ 直接从路径中判断当前该亮哪个 Tab (所见即所得)
  const activeKey = location.pathname.includes('overseas') ? 'overseas' : 'domestic';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <NavBar onBack={() => navigate(-1)}>选择城市</NavBar>
        
        {/* Tab 切换 */}
        <div style={{ padding: '8px 12px 4px', background: '#fff' }}>
          <CapsuleTabs 
            activeKey={activeKey} 
            onChange={(key) => {
              // 切换时保持 URL 上的 ?current=xxx 参数不丢
              navigate(`/city-select/${key}${location.search}`);
            }}
          >
            <CapsuleTabs.Tab title="国内" key="domestic" />
            <CapsuleTabs.Tab title="海外" key="overseas" />
          </CapsuleTabs>
        </div>

        {/* 搜索框 */}
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
        {/* 渲染子路由组件 (DomesticCity / OverseasCity) */}
        <Outlet context={{ keyword }} />
      </div>
    </div>
  );
};

export default CitySelect;