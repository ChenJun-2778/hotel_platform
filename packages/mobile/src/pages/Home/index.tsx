import { useState, useEffect } from 'react';
import { CapsuleTabs, NavBar, TabBar } from 'antd-mobile';
import { FireFill } from 'antd-mobile-icons'; // 需要安装图标库
import styles from './index.module.css';
// 引入跳转钩子
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// 引入组件
import HotelCard from '@/components/HotelCard';
import { MOCK_HOTEL_LIST } from '@/mock/data'
import dayjs from 'dayjs';
import type { HomeContextType } from './type/homeContextType';


const Home = () => {
  const navigate = useNavigate()

  // 1. 在这里定义日期状态 (Source of Truth)
  // 优先从 sessionStorage 读取
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    try {
      const cached = sessionStorage.getItem('HOME_DATE_RANGE');
      if (cached) {
        const [start, end] = JSON.parse(cached);
        // 注意：JSON 取出来是字符串，必须转回 Date 对象
        // 还要防止存储的是过期日期（可选优化，这里先不加，保持简单）
        return [new Date(start), new Date(end)];
      }
    } catch (e) {
      console.error('日期解析失败', e);
    }
    // 没缓存，才用默认值
    return [new Date(), dayjs().add(1, 'day').toDate()];
  });
  // 跳转到list页面
  // const goList = () => navigate('/list')
  const location = useLocation();

  // 根据当前路由确定激活哪个 Tab
  const activeKey = location.pathname.split('/').pop() || 'domestic';
  // 新增监听：日期一变，立马存入 sessionStorage
  useEffect(() => {
    sessionStorage.setItem('HOME_DATE_RANGE', JSON.stringify(dateRange));
  }, [dateRange]);

  // 快捷入口配置（方便后续修改词条）
  const quickEntries = [
    { 
      label: '特价酒店', 
      type: 'discount',
      params: { sortType: 'price_asc', price_max: '300' }  // 特殊逻辑：价格筛选
    },
    { 
      label: '亲子房', 
      type: 'keyword',
      keyword: '亲子'  // 关键词搜索
    },
    { 
      label: '免费停车', 
      type: 'keyword',
      keyword: '停车'  // 关键词搜索
    },
    { 
      label: '游泳池', 
      type: 'keyword',
      keyword: '游泳'  // 关键词搜索
    }
  ];

  // 快捷入口点击处理
  const handleQuickEntry = (entry: typeof quickEntries[0]) => {
    // 获取当前城市（从 localStorage 读取，默认上海）
    const city = localStorage.getItem('HOME_CITY') || '上海';
    const beginDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
    const endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
    
    // 基础参数
    const baseParams = `city=${city}&beginDate=${beginDate}&endDate=${endDate}&type=1`;
    
    // 根据类型构建额外参数
    let extraParams = '';
    if (entry.type === 'discount' && entry.params) {
      // 特价酒店：使用自定义参数
      extraParams = Object.entries(entry.params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
    } else if (entry.type === 'keyword' && entry.keyword) {
      // 关键词搜索
      extraParams = `keyword=${encodeURIComponent(entry.keyword)}`;
    }
    
    navigate(`/list?${baseParams}&${extraParams}`);
  };

  // 制作假数据
  const recommendList = [
    ...MOCK_HOTEL_LIST,
    ...MOCK_HOTEL_LIST,
    ...MOCK_HOTEL_LIST,
    ...MOCK_HOTEL_LIST
  ]
  return (
    <div className={styles.homeContainer}>
      <NavBar back={null} className={styles.navBar}>易宿酒店预订</NavBar>

      <div className={styles.banner}>
        <div className={styles.bannerTag}>携程在手，说走就走</div>
      </div>
      {/* 1. 业务类型切换 Tab */}
      <div className={styles.tabWrapper}>
        <CapsuleTabs
          activeKey={activeKey}
          onChange={key => navigate(key)}
        >
          <CapsuleTabs.Tab title='国内' key='domestic' />
          <CapsuleTabs.Tab title='海外' key='overseas' />
          <CapsuleTabs.Tab title='钟点房' key='hourly' />
          <CapsuleTabs.Tab title='民宿' key='inn' />
        </CapsuleTabs>
      </div>
      {/* 2. 子路由占位符：这里会根据路由显示 Domestic/Overseas/etc. */}
      <div className={styles.searchCardWrapper}>
        <Outlet context={{ dateRange, setDateRange } satisfies HomeContextType} />
      </div>

      {/* 4. 快捷入口金刚区 */}
      <div className={styles.gridContainer}>
        {quickEntries.map(entry => (
          <div 
            key={entry.label} 
            className={styles.gridItem}
            onClick={() => handleQuickEntry(entry)}
          >
            <div className={styles.gridIcon}></div>
            <div className={styles.gridLabel}>{entry.label}</div>
          </div>
        ))}
      </div>

      {/* ✅ 3. 新增：猜你喜欢 / 推荐列表 */}
      <div className={styles.recommendSection}>
        <div className={styles.sectionTitle}>
           <FireFill color='#ff3141' /> 猜你喜欢
        </div>
        
        <div className={styles.cardList}>
          {recommendList.map((item, index) => (
            // 注意：因为数据是重复的，key 不能只用 item.id，要加上 index 避免重复报错
            <div 
                key={`${item.id}-${index}`} 
                className={styles.cardWrapper}
                onClick={() => {
                  // 1. 格式化日期
                  const beginStr = dayjs(dateRange[0]).format('YYYY-MM-DD');
                  const endStr = dayjs(dateRange[1]).format('YYYY-MM-DD');
                  
                  // 2. 带着参数跳转
                  navigate(`/detail/${item.id}?beginDate=${beginStr}&endDate=${endStr}`);
              }}
            >
              {/* 直接复用你之前写的卡片 */}
              <HotelCard hotel={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;