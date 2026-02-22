import React, { useState, useMemo } from 'react';
import { SideBar, Grid, Image } from 'antd-mobile';
import { useNavigate, useOutletContext } from 'react-router-dom';
// 导入最新的 mock 数据
import { overseasCityGroups } from '@/mock/cityData'; 
import styles from './index..module.css';

// 定义清晰的接口防止 TS 报错
interface OverseasCityContext {
  keyword: string;
}

const OverseasCity: React.FC = () => {
  const navigate = useNavigate();
  
  // ✅ 修复 1: 增加兜底，防止父级 context 缺失导致崩溃
  const context = useOutletContext<OverseasCityContext>();
  const keyword = context?.keyword || '';
  
  const [activeKey, setActiveKey] = useState('recommend');

  const handleSelect = (city: string) => {
    localStorage.setItem('HOME_CITY', city);
    localStorage.setItem('selectedCity', city);
    navigate(-1);
  };

  // ✅ 修复 2: 严格检查属性是否存在，防止 flatMap 抛出 500 错误
  const searchResults = useMemo(() => {
    if (!keyword) return [];
    
    // 确保 g.hotCities 是数组，如果不是则返回空数组
    const allHot = overseasCityGroups.flatMap(g => Array.isArray(g.hotCities) ? g.hotCities : []);
    const allOther = overseasCityGroups.flatMap(g => Array.isArray(g.otherCities) ? g.otherCities : [])
      .map(name => ({ name, image: '', pinyin: '' }));
    
    const combined = [...allHot, ...allOther];
    
    const uniqueMap = new Map();
    combined.forEach(c => {
      if (c && c.name) uniqueMap.set(c.name, c);
    });
    
    const kw = keyword.toLowerCase();
    return Array.from(uniqueMap.values()).filter(c => 
      c.name.includes(keyword) || 
      (c.pinyin && c.pinyin.toLowerCase().includes(kw))
    );
  }, [keyword]);

  return (
    <div className={styles.overseasContainer}>
      {keyword ? (
        <div className={styles.searchResult}>
          <div className={styles.sectionTitle}>搜索结果</div>
          <Grid columns={3} gap={10}>
            {searchResults.map(city => (
              <div key={city.name} className={styles.textTag} onClick={() => handleSelect(city.name)}>
                {city.name}
              </div>
            ))}
          </Grid>
        </div>
      ) : (
        <div className={styles.mainContent}>
          <SideBar 
            activeKey={activeKey} 
            onChange={setActiveKey} 
            className={styles.sideBar}
          >
            {overseasCityGroups.map(item => (
              <SideBar.Item key={item.key} title={item.title} />
            ))}
          </SideBar>
          
          <div className={styles.rightPanel}>
            {overseasCityGroups.map(group => (
              group.key === activeKey && (
                <div key={group.key}>
                  {/* ✅ 修复 3: 增加可选链 ?. 防止渲染时读取不到 hotCities 报错 */}
                  <div className={styles.sectionTitle}>{group.title}热门目的地</div>
                  <Grid columns={2} gap={10}>
                    {group.hotCities?.map(city => (
                      <div key={city.name} className={styles.cityCard} onClick={() => handleSelect(city.name)}>
                        <div className={styles.imageWrapper}>
                          <Image 
                            src={city.image} 
                            alt={city.name} 
                            className={styles.cityImage} 
                            lazy 
                            fit='cover'
                          />
                          <div className={styles.cityNameLabel}>{city.name}</div>
                        </div>
                      </div>
                    ))}
                  </Grid>

                  {group.otherCities && group.otherCities.length > 0 && (
                    <>
                      <div className={styles.sectionTitle} style={{ marginTop: '24px' }}>
                        {group.title}其他城市
                      </div>
                      <Grid columns={3} gap={8}>
                        {group.otherCities.map(name => (
                          <div 
                            key={name} 
                            className={styles.textTag} 
                            onClick={() => handleSelect(name)}
                          >
                            {name}
                          </div>
                        ))}
                      </Grid>
                    </>
                  )}
                </div>
              )
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OverseasCity;