import React, { useState } from 'react';
import { NavBar, SearchBar, IndexBar, List } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  // 模拟城市数据
  const cityData = [
    { label: '热门', items: ['上海', '北京', '广州', '成都'] },
    { label: 'A', items: ['阿坝', '安庆'] },
    { label: 'B', items: ['北京', '保定'] },
  ];

  const handleSelect = (cityName: string) => {
    // 方案：将选择结果存入本地存储，回到首页时读取
    localStorage.setItem('selectedCity', cityName);
    navigate(-1); // 返回上一页
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#fff' }}>
      <NavBar onBack={() => navigate(-1)}>选择城市</NavBar>
      
      <div style={{ padding: '10px' }}>
        <SearchBar 
          placeholder='城市名/拼音' 
          value={searchText}
          onChange={setSearchText}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        <IndexBar>
          {cityData.map(group => (
            <IndexBar.Panel index={group.label} title={group.label} key={group.label}>
              <List>
                {group.items.map(city => (
                  <List.Item key={city} onClick={() => handleSelect(city)}>
                    {city}
                  </List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          ))}
        </IndexBar>
      </div>
    </div>
  );
};

export default CitySelect;