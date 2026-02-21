import React, { useState, useEffect } from 'react';
import { NavBar, SearchBar, IndexBar, List, Grid, DotLoading } from 'antd-mobile'; // ✅ 引入 DotLoading
import { EnvironmentOutline } from 'antd-mobile-icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.css';

// ✅ 1. 引入我们刚写的强大 Hook
import { useLocation } from '@/utils/useLocation';

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get('current') || '上海';

  // ✅ 2. 取出定位状态和定位方法
  const { locating, getCurrentCity } = useLocation();
  // 专门用一个 state 存定位到的城市，初始为空
  const [locatedCity, setLocatedCity] = useState<string | null>(null);
  // 记录是否定位失败，方便用户点击重试
  const [locateFailed, setLocateFailed] = useState(false);

  // ✅ 3. 封装一个执行定位的函数
  const doLocate = async () => {
    setLocateFailed(false);
    try {
      const city = await getCurrentCity();
      setLocatedCity(city);
    } catch (error) {
      setLocateFailed(true);
    }
  };

  // ✅ 4. 页面一加载，自动触发一次定位
  useEffect(() => {
    doLocate();
  }, []);

  const hotCities = ['北京', '上海', '广州', '深圳', '成都', '杭州', '三亚', '西安'];
  const cityGroups = [
    {
      title: 'A',
      items: ['阿坝', '阿拉善', '阿里', '安康', '安庆', '鞍山', '安顺', '安阳', '澳门']
    },
    {
      title: 'B',
      items: ['北京', '白银', '保定', '宝鸡', '保山', '包头', '巴中', '北海', '蚌埠', '本溪', '毕节', '滨州']
    },
    {
      title: 'S',
      items: ['上海', '深圳', '三亚', '石家庄', '苏州', '沈阳', '绍兴', '三门峡', '三明', '商洛', '商丘', '上饶', '山南', '汕头', '汕尾']
    }
  ];

  const handleSelect = (city: string) => {
    localStorage.setItem('selectedCity', city);
    navigate(-1);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <NavBar onBack={() => navigate(-1)}>选择城市</NavBar>
        <div className={styles.searchWrapper}>
          <SearchBar placeholder='输入城市名、拼音或首字母查询' style={{ '--background': '#f5f5f5' }} />
        </div>
      </div>

      <div className={styles.body}>
        <IndexBar>
          <IndexBar.Panel index="#" title="当前定位">
            <div className={styles.sectionContent}>
              {/* ✅ 5. 动态渲染定位区域 */}
              <div 
                className={styles.locationCity}
                onClick={() => {
                  if (locatedCity) {
                    // 如果已经定位成功，点击就是选择该城市
                    handleSelect(locatedCity);
                  } else if (locateFailed) {
                    // 如果定位失败，点击就是重新定位
                    doLocate();
                  }
                }} 
              >
                <span className={styles.locationIcon}><EnvironmentOutline /></span>
                {/* 根据当前状态显示不同内容 */}
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
                {hotCities.map(city => (
                  <Grid.Item key={city} onClick={() => handleSelect(city)}>
                    <div className={`${styles.cityTag} ${city === currentCity ? styles.activeTag : ''}`}>
                      {city}
                    </div>
                  </Grid.Item>
                ))}
              </Grid>
            </div>
          </IndexBar.Panel>

          {cityGroups.map(group => (
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
        </IndexBar>
      </div>
    </div>
  );
};

export default CitySelect;