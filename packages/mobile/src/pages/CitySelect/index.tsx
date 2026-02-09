import React from 'react';
import { NavBar, SearchBar, IndexBar, List, Grid } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './index.module.css';

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  // 1. 获取 URL 参数，方便知道刚才选的是哪个城市 (用于高亮回显)
  const [searchParams] = useSearchParams();
  const currentCity = searchParams.get('current') || '上海';

  // 模拟数据
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
    },
    // ... 可以补充更多
  ];

  // ✅ 核心逻辑：点击城市后的动作
  const handleSelect = (city: string) => {
    // 1. 存入信箱 (localStorage)
    localStorage.setItem('selectedCity', city);
    
    // 2. 返回上一页 (SearchBase 会监听到这个变化)
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
               <div 
                 className={styles.locationCity}
                 // ✅ 点击定位也能选
                 onClick={() => handleSelect('上海')} 
               >
                 <span className={styles.locationIcon}>📍</span> 上海
                 <span className={styles.gpsText}>GPS定位</span>
               </div>
            </div>
          </IndexBar.Panel>

          <IndexBar.Panel index="热" title="热门城市">
            <div className={styles.sectionContent}>
              <Grid columns={4} gap={8}>
                {hotCities.map(city => (
                  <Grid.Item key={city} onClick={() => handleSelect(city)}>
                    {/* ✅ 增加选中高亮样式：如果等于 currentCity，变蓝色 */}
                    <div 
                      className={`${styles.cityTag} ${city === currentCity ? styles.activeTag : ''}`}
                    >
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
                    onClick={() => handleSelect(city)} // ✅ 列表项绑定点击
                    arrow={false} // 去掉右侧箭头，更像选择列表
                    extra={city === currentCity ? '✔' : ''} // ✅ 选中项显示对勾
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