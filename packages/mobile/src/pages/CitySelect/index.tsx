import React, { useState } from 'react';
import { NavBar, SearchBar, IndexBar, List, Grid } from 'antd-mobile';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';

const CitySelect: React.FC = () => {
  const navigate = useNavigate();
  
  // 1. 模拟数据：热门城市
  const hotCities = ['北京', '上海', '广州', '深圳', '成都', '杭州', '三亚', '西安'];

  // 2. 模拟数据：A-Z 城市列表
  // 实际开发中，这些数据通常由后端接口一次性返回
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
      title: 'C',
      items: ['成都', '重庆', '长沙', '长春', '沧州', '常德', '昌都', '长治', '常州', '巢湖', '朝阳', '潮州', '承德']
    },
    {
      title: 'S',
      items: ['上海', '深圳', '三亚', '石家庄', '苏州', '沈阳', '绍兴', '三门峡', '三明', '商洛', '商丘', '上饶', '山南', '汕头', '汕尾']
    },
    {
      title: 'X',
      items: ['西安', '厦门', '西宁', '香港', '湘潭', '湘西', '襄阳', '咸宁', '咸阳', '孝感', '忻州', '新乡', '信阳', '新余', '邢台', '西双版纳', '徐州', '许昌']
    }
  ];

  return (
    <div className={styles.container}>
      {/* 顶部导航 */}
      <div className={styles.header}>
        <NavBar onBack={() => navigate(-1)}>选择城市</NavBar>
        <div className={styles.searchWrapper}>
          <SearchBar placeholder='输入城市名、拼音或首字母查询' style={{ '--background': '#f5f5f5' }} />
        </div>
      </div>

      {/* 列表区域 - 使用 IndexBar 实现索引吸顶效果 */}
      <div className={styles.body}>
        <IndexBar>
          {/* 特殊区块：当前定位 */}
          <IndexBar.Panel index="#" title="当前定位">
            <div className={styles.sectionContent}>
               <div className={styles.locationCity}>
                 <span className={styles.locationIcon}>📍</span> 上海
                 <span className={styles.gpsText}>GPS定位</span>
               </div>
            </div>
          </IndexBar.Panel>

          {/* 特殊区块：热门城市 */}
          <IndexBar.Panel index="热" title="热门城市">
            <div className={styles.sectionContent}>
              <Grid columns={4} gap={8}>
                {hotCities.map(city => (
                  <Grid.Item key={city}>
                    <div className={styles.cityTag}>{city}</div>
                  </Grid.Item>
                ))}
              </Grid>
            </div>
          </IndexBar.Panel>

          {/* 常规区块：A-Z 列表 */}
          {cityGroups.map(group => (
            <IndexBar.Panel
              index={group.title}
              title={group.title}
              key={group.title}
            >
              <List>
                {group.items.map(city => (
                  <List.Item key={city}>{city}</List.Item>
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