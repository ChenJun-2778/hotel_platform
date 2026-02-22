import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { IndexBar, List, Grid, DotLoading } from 'antd-mobile';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { useNavigate, useOutletContext } from 'react-router-dom';
import PinyinMatch from 'pinyin-match';
import { useLocation } from '@/utils/useLocation';
import { domesticHotCities, domesticCityGroups as allCityGroups } from '@/mock/cityData';
import styles from './index.module.css';

const DomesticCity: React.FC = () => {
  const navigate = useNavigate();
  
  // ✅ 获取父组件共享的搜索词
  const { keyword } = useOutletContext<{ keyword: string }>();

  // ✅ 定位相关状态
  const { locating, getCurrentCity } = useLocation();
  const [locatedCity, setLocatedCity] = useState<string | null>(null);
  const [locateFailed, setLocateFailed] = useState(false);

  // ✅ 1. 纯粹的定位函数
  const doLocate = async () => {
    if (locating) return;
    setLocateFailed(false);
    try {
      const city = await getCurrentCity();
      setLocatedCity(city);
    } catch (error) {
      console.error('定位失败:', error);
      setLocatedCity(null);
      setLocateFailed(true);
    }
  };

  // ✅ 2. 只在进入页面时定位一次，不依赖任何状态
  useEffect(() => {
    doLocate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ 3. 极简的选择逻辑：存完就跳，不维护 activeCity 状态
  const handleSelect = (city: string) => {
    localStorage.setItem('HOME_CITY', city); 
    localStorage.setItem('selectedCity', city);
    navigate(-1);
  };

  // ✅ 4. 搜索过滤
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
      <div className={styles.body}>
        <IndexBar>
          {/* ✅ 1. 分开写：确保 IndexBar.Panel 是 IndexBar 的直接子元素 */}
          
          {/* 当前定位 Panel */}
          {!keyword && (
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
                </div>
              </div>
            </IndexBar.Panel>
          )}
  
          {/* 热门城市 Panel */}
          {!keyword && (
            <IndexBar.Panel index="热" title="热门城市">
              <div className={styles.sectionContent}>
                <Grid columns={4} gap={8}>
                  {domesticHotCities.map(city => (
                    <Grid.Item key={city} onClick={() => handleSelect(city)}>
                      <div className={styles.cityTag}>
                        {city}
                      </div>
                    </Grid.Item>
                  ))}
                </Grid>
              </div>
            </IndexBar.Panel>
          )}
  
          {/* 城市列表 Panel (由于 filteredCityGroups 本身是数组 map 出来的，这里没问题) */}
          {filteredCityGroups.map(group => (
            <IndexBar.Panel index={group.title} title={group.title} key={group.title}>
              <List>
                {group.items.map(city => (
                  <List.Item
                    key={city}
                    onClick={() => handleSelect(city)}
                    arrow={false}
                  >
                    {city}
                  </List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          ))}
        </IndexBar>
  
        {/* 搜索无结果提示 */}
        {keyword && filteredCityGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            未找到匹配的城市
          </div>
        )}
      </div>
    </div>
  );
};

export default DomesticCity;