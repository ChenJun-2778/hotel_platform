import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { IndexBar, List, Grid, DotLoading } from 'antd-mobile';
import { EnvironmentOutline } from 'antd-mobile-icons';
import { useNavigate, useSearchParams, useOutletContext } from 'react-router-dom';
import PinyinMatch from 'pinyin-match';
import { useLocation } from '@/utils/useLocation';
import { domesticHotCities, domesticCityGroups as allCityGroups } from '@/mock/cityData';
import styles from './index.module.css';

const DomesticCity: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [activeCity, setActiveCity] = useState(() => {
    const urlParam = searchParams.get('current'); // 首页点击传入的城市名
    const homeCity = localStorage.getItem('HOME_CITY'); // 首页卡片显示的城市
    const selected = localStorage.getItem('selectedCity'); // 历史选择

    // 必须加 trim()，防止因为多一个空格导致匹配失败
    const finalCity = (urlParam || homeCity || selected || '上海').trim();
    return finalCity;
  });

  // 初始化选中态：优先级 缓存 > URL > 上海
  useEffect(() => {
    const saved = localStorage.getItem('selectedCity');
    const urlParam = searchParams.get('current');
    setActiveCity(saved || urlParam || '上海');
  }, [searchParams]);

  const { keyword } = useOutletContext<{ keyword: string }>();
  const { locating, getCurrentCity } = useLocation();
  const [locatedCity, setLocatedCity] = useState<string | null>(null);
  const [locateFailed, setLocateFailed] = useState(false);

  // ✅ 2. 优化定位函数：移除 useCallback 依赖，或者在 useEffect 中断开依赖链
  const doLocate = async () => {
    if (locating) return; // 防止重复点击
    setLocateFailed(false);
    try {
      const city = await getCurrentCity();
      setLocatedCity(city);
    } catch (error) {
      console.error('定位失败:', error);
      setLocateFailed(true);
    }
  };

  useEffect(() => {
    const currentParam = searchParams.get('current');
    if (currentParam) {
      setActiveCity(currentParam);
    }
  }, [searchParams]); // 监听 URL 变化，强制同步激活态

  // ✅ 3. 核心修复：只在组件初次挂载时运行一次定位
  useEffect(() => {
    doLocate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 👈 保持空依赖，防止死循环

  // 在 handleSelect 时，同时更新两个键名，确保数据彻底同步
  const handleSelect = (city: string) => {
    localStorage.setItem('selectedCity', city);
    localStorage.setItem('HOME_CITY', city); // 同步给首页卡片使用
    setActiveCity(city);
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
      <div className={styles.body}>
        <IndexBar>
          {!keyword ? (
            <IndexBar.Panel index="#" title="当前定位">
              <div className={styles.sectionContent}>
                {/* ✅ 修复定位点击：支持点击城市选中，点击失败处重试 */}
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
          ) : null}

          {!keyword ? (
            <IndexBar.Panel index="热" title="热门城市">
              <div className={styles.sectionContent}>
                <Grid columns={4} gap={8}>
                  {domesticHotCities.map(city => (
                    <Grid.Item key={city} onClick={() => handleSelect(city)}>
                      <div className={`${styles.cityTag} ${city === activeCity ? styles.activeTag : ''}`}>
                        {city}
                      </div>
                    </Grid.Item>
                  ))}
                </Grid>
              </div>
            </IndexBar.Panel>
          ) : null}
          {/* // 城市列表部分 */}
          {filteredCityGroups.map(group => (
            <IndexBar.Panel index={group.title} title={group.title} key={group.title}>
              <List>
                {group.items.map(city => (
                  <List.Item
                    key={city}
                    onClick={() => handleSelect(city)}
                    extra={city === activeCity ? '✔' : ''}
                  >
                    <span style={{ color: city === activeCity ? '#0086F6' : '#333' }}>
                      {city}
                    </span>
                  </List.Item>
                ))}
              </List>
            </IndexBar.Panel>
          ))}
        </IndexBar>

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