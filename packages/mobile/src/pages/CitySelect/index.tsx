import React, { useState, useEffect, useMemo } from 'react';
import { NavBar, SearchBar, IndexBar, List, Grid, DotLoading } from 'antd-mobile';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PinyinMatch from 'pinyin-match'; // ✅ 引入拼音匹配神器
import styles from './index.module.css';
import { useLocation } from '@/utils/useLocation';

// ✅ 引入抽离出来的静态全量数据
import { domesticHotCities, domesticCityGroups as allCityGroups } from '@/mock/cityData'; 

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get('current') || '上海';

  const { locating, getCurrentCity } = useLocation();
  const [locatedCity, setLocatedCity] = useState<string | null>(null);
  const [locateFailed, setLocateFailed] = useState(false);
  
  // ✅ 新增：控制搜索关键词的状态
  const [keyword, setKeyword] = useState('');

  const doLocate = async () => {
    setLocateFailed(false);
    try {
      const city = await getCurrentCity();
      setLocatedCity(city);
    } catch (error) {
      setLocateFailed(true);
    }
  };

  useEffect(() => {
    doLocate();
  }, []);

  const handleSelect = (city: string) => {
    localStorage.setItem('selectedCity', city);
    navigate(-1);
  };

  // ✅ 核心：利用 useMemo 实现高性能过滤 (线性复杂度计算)
  const filteredCityGroups = useMemo(() => {
    if (!keyword) return allCityGroups; // 没搜索时，直接返回全量数据

    const result: typeof allCityGroups = [];
    allCityGroups.forEach(group => {
      // 使用 PinyinMatch 匹配城市名，支持汉字、全拼、首字母
      const matchedItems = group.items.filter(city => PinyinMatch.match(city, keyword));
      if (matchedItems.length > 0) {
        result.push({ title: group.title, items: matchedItems });
      }
    });
    return result;
  }, [keyword]); // 只有 keyword 变化时才重新计算

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <NavBar onBack={() => navigate(-1)}>选择城市</NavBar>
        <div className={styles.searchWrapper}>
          <SearchBar 
            placeholder='输入城市名、拼音或首字母查询' 
            style={{ '--background': '#f5f5f5' }} 
            value={keyword}
            onChange={val => setKeyword(val)} // ✅ 绑定搜索输入
          />
        </div>
      </div>

      <div className={styles.body}>
        {/* 如果有搜索词，建议隐藏定位和热门，只展示搜索结果，提升信噪比 */}
        <IndexBar>
          {!keyword && (
            <>
              <IndexBar.Panel index="#" title="当前定位">
                <div className={styles.sectionContent}>
                  <div 
                    className={styles.locationCity}
                    onClick={() => {
                      if (locatedCity) handleSelect(locatedCity);
                      else if (locateFailed) doLocate();
                    }} 
                  >
                    <span className={styles.locationIcon}><EnvironmentOutline /></span>
                    {locating ? (
                      <span>定位中 <DotLoading color='currentColor' /></span>
                    ) : locateFailed ? (
                      <span style={{ color: '#ff3141' }}>定位失败，点击重试</span>
                    ) : (
                      <span>{locatedCity || '正在获取...'}</span>
                    )}
                    <span className={styles.gpsText}>GPS定位</span>
                  </div>
                </div>
              </IndexBar.Panel>

              <IndexBar.Panel index="热" title="热门城市">
                <div className={styles.sectionContent}>
                  <Grid columns={4} gap={8}>
                    {domesticHotCities.map(city => (
                      <Grid.Item key={city} onClick={() => handleSelect(city)}>
                        <div className={`${styles.cityTag} ${city === currentCity ? styles.activeTag : ''}`}>
                          {city}
                        </div>
                      </Grid.Item>
                    ))}
                  </Grid>
                </div>
              </IndexBar.Panel>
            </>
          )}

          {/* 渲染经过滤的城市列表 */}
          {filteredCityGroups.map(group => (
            <IndexBar.Panel
              index={group.title}
              title={group.title}
              key={group.title}
            >
              <List>
                {group.items.map(city => (
                  <List.Item 
                    key={city} 
                    onClick={() => handleSelect(city)} 
                    arrow={false} 
                    extra={city === currentCity ? '✔' : ''} 
                  >
                    <span style={{ color: city === currentCity ? '#0086F6' : '#333' }}>
                      {city}
                    </span>
                  </List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          ))}
          
          {/* 搜索无结果时的占位提示 */}
          {keyword && filteredCityGroups.length === 0 && (
             <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
               未找到匹配的城市
             </div>
          )}
        </IndexBar>
      </div>
    </div>
  );
};

export default CitySelect;