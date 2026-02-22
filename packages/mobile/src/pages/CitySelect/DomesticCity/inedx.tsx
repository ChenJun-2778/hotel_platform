import React, { useState, useEffect, useMemo } from 'react';
import { SearchBar, IndexBar, List, Grid, DotLoading } from 'antd-mobile';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PinyinMatch from 'pinyin-match';
import { useLocation } from '@/utils/useLocation';
import { domesticHotCities, domesticCityGroups as allCityGroups } from '@/mock/cityData'; 
// 🚨 注意：引入你刚才配好高度的 CSS 文件
import styles from './index.module.css'; 

const DomesticCity: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get('current') || '上海';

  const { locating, getCurrentCity } = useLocation();
  const [locatedCity, setLocatedCity] = useState<string | null>(null);
  const [locateFailed, setLocateFailed] = useState(false);
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

  const filteredCityGroups = useMemo(() => {
    if (!keyword) return allCityGroups;
    const result: typeof allCityGroups = [];
    allCityGroups.forEach(group => {
      const matchedItems = group.items.filter(city => PinyinMatch.match(city, keyword));
      if (matchedItems.length > 0) {
        result.push({ title: group.title, items: matchedItems });
      }
    });
    return result;
  }, [keyword]);

  return (
    <div className={styles.domesticContainer}>
      <div className={styles.searchWrapper}>
        <SearchBar 
          placeholder='输入城市名、拼音或首字母查询' 
          style={{ '--background': '#f5f5f5' }} 
          value={keyword}
          onChange={val => setKeyword(val)} 
        />
      </div>

      <div className={styles.body}>
        {/* ✅ 彻底抛弃数组和 Fragment，用原生的三元表达式喂给 IndexBar */}
        <IndexBar>
          
          {/* 1. 当前定位 */}
          {!keyword ? (
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
          ) : null}

          {/* 2. 热门城市 */}
          {!keyword ? (
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
          ) : null}

          {/* 3. 渲染经过滤的城市列表 */}
          {filteredCityGroups.map(group => (
            <IndexBar.Panel index={group.title} title={group.title} key={group.title}>
              <List>
                {group.items.map(city => (
                  <List.Item 
                    key={city} onClick={() => handleSelect(city)} 
                    arrow={false} extra={city === currentCity ? '✔' : ''} 
                  >
                    <span style={{ color: city === currentCity ? '#0086F6' : '#333' }}>{city}</span>
                  </List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          ))}

        </IndexBar>

        {/* 搜索无结果时的占位 */}
        {keyword && filteredCityGroups.length === 0 && (
           <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>未找到匹配的城市</div>
        )}
      </div>
    </div>
  );
};

export default DomesticCity;