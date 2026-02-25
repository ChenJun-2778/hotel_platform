import { useState, useEffect } from 'react';
import { CapsuleTabs, NavBar, TabBar, InfiniteScroll, DotLoading, Toast } from 'antd-mobile';
import { FireFill, HeartFill, StarFill } from 'antd-mobile-icons'; // 需要安装图标库
import styles from './index.module.css';
// 引入跳转钩子
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// 引入组件
import HotelCard from '@/components/HotelCard';
import dayjs from 'dayjs';
import type { HomeContextType } from './type/homeContextType';
// 引入 API
import { apiGetHotelList } from '@/api/Hotel/index';


const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. 普通酒店（国内、海外、民宿）的日期状态
  const [dateRange, setDateRange] = useState<[Date, Date]>(() => {
    try {
      const cached = sessionStorage.getItem('HOME_DATE_RANGE');
      if (cached) {
        const [start, end] = JSON.parse(cached);
        return [new Date(start), new Date(end)];
      }
    } catch (e) {
      console.error('日期解析失败', e);
    }
    // 默认：今天入住，明天离店（1晚）
    return [new Date(), dayjs().add(1, 'day').toDate()];
  });

  // 2. 钟点房的日期状态（单独维护）
  const [hourlyDate, setHourlyDate] = useState<[Date, Date]>(() => {
    try {
      const cached = sessionStorage.getItem('HOME_HOURLY_DATE');
      if (cached) {
        const [start] = JSON.parse(cached);
        const date = new Date(start);
        return [date, date]; // 钟点房入住和离店是同一天
      }
    } catch (e) {
      console.error('钟点房日期解析失败', e);
    }
    // 默认：今天
    const today = new Date();
    return [today, today];
  });

  // 根据当前路由确定激活哪个 Tab
  const activeKey = location.pathname.split('/').pop() || 'domestic';
  
  // 判断当前是否是钟点房
  const isHourly = activeKey === 'hourly';
  
  // 根据类型选择对应的日期状态
  const currentDateRange = isHourly ? hourlyDate : dateRange;
  const setCurrentDateRange = isHourly ? setHourlyDate : setDateRange;

  // 监听日期变化，分别存储到不同的 sessionStorage key
  useEffect(() => {
    sessionStorage.setItem('HOME_DATE_RANGE', JSON.stringify(dateRange));
  }, [dateRange]);

  useEffect(() => {
    sessionStorage.setItem('HOME_HOURLY_DATE', JSON.stringify(hourlyDate));
  }, [hourlyDate]);

  // 智能同步：切换到钟点房时，如果钟点房日期是今天，则自动同步国内的入住日期
  useEffect(() => {
    if (isHourly) {
      const today = dayjs().startOf('day');
      const hourlyDateDay = dayjs(hourlyDate[0]).startOf('day');
      
      // 如果钟点房日期是今天（初始值），则同步国内的入住日期
      if (hourlyDateDay.isSame(today, 'day')) {
        const normalCheckInDate = dayjs(dateRange[0]).startOf('day').toDate();
        setHourlyDate([normalCheckInDate, normalCheckInDate]);
      }
    }
    // 注意：这里只监听 isHourly 和 dateRange[0]，不监听 hourlyDate，避免无限循环
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHourly, dateRange[0]]);

  // 快捷入口配置（补充了渐变色和图标）
  const quickEntries = [
    { 
      label: '特价酒店', 
      type: 'discount',
      params: { sortType: 'price_asc', price_max: '300' },
      icon: <FireFill />,
      color: 'linear-gradient(135deg, #ff8b6e, #ff4d4f)' // 热情促销红
    },
    { 
      label: '亲子房', 
      type: 'keyword',
      keyword: '亲子',
      icon: <HeartFill />,
      color: 'linear-gradient(135deg, #ff9a9e, #fecfef)' // 温馨亲子粉
    },
    { 
      label: '免费停车', 
      type: 'keyword',
      keyword: '停车',
      icon: <span style={{ fontFamily: 'Arial, sans-serif', fontStyle: 'italic', paddingRight: '2px' }}>P</span>, // 停车场专属大 P
      color: 'linear-gradient(135deg, #70a1ff, #1e90ff)' // 商务安心蓝
    },
    { 
      label: '游泳池', 
      type: 'keyword',
      keyword: '游泳',
      icon: <StarFill />,
      color: 'linear-gradient(135deg, #4facfe, #00f2fe)' // 清凉泳池蓝
    }
  ];

  // 快捷入口点击处理
  const handleQuickEntry = (entry: typeof quickEntries[0]) => {
    // 获取当前城市（从 localStorage 读取，默认上海）
    const city = localStorage.getItem('HOME_CITY') || '上海';
    // 使用当前类型对应的日期
    let beginDate = dayjs(currentDateRange[0]).format('YYYY-MM-DD');
    let endDate = dayjs(currentDateRange[1]).format('YYYY-MM-DD');
    
    // 钟点房特殊处理：如果入住和离店是同一天，后端需要传第二天
    if (isHourly && beginDate === endDate) {
      endDate = dayjs(currentDateRange[0]).add(1, 'day').format('YYYY-MM-DD');
    }
    
    // 检查是否有用户输入的关键词草稿
    const existingKeyword = localStorage.getItem('SEARCH_KEYWORD_DRAFT') || '';
    
    // 基础参数
    const baseParams = `city=${city}&beginDate=${beginDate}&endDate=${endDate}&type=1`;
    
    // 根据类型构建额外参数
    let extraParams = '';
    if (entry.type === 'discount' && entry.params) {
      // 特价酒店：使用自定义参数（不涉及关键词）
      extraParams = Object.entries(entry.params)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
      
      // 如果有用户输入的关键词，也带上
      if (existingKeyword.trim()) {
        extraParams += `&keyword=${encodeURIComponent(existingKeyword.trim())}`;
      }
    } else if (entry.type === 'keyword' && entry.keyword) {
      // 关键词搜索：合并用户输入的关键词和快捷入口的关键词
      let finalKeyword = entry.keyword;
      
      if (existingKeyword.trim()) {
        // 如果用户已经输入了关键词，合并两个关键词（用空格分隔）
        finalKeyword = `${existingKeyword.trim()} ${entry.keyword}`;
      }
      
      extraParams = `keyword=${encodeURIComponent(finalKeyword)}`;
    }
    
    navigate(`/list?${baseParams}&${extraParams}`);
    
    // 跳转后清除关键词草稿（因为已经用于搜索了）
    localStorage.removeItem('SEARCH_KEYWORD_DRAFT');
  };

  // 猜你喜欢列表数据
  const [recommendList, setRecommendList] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // 首次加载猜你喜欢数据
  useEffect(() => {
    const loadRecommendList = async () => {
      setLoading(true);
      try {
        const res = await apiGetHotelList({
          city: '', // 不限城市
          beginDate: dayjs().format('YYYY-MM-DD'),
          endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
          page: 1,
          pageSize: 20
        });

        if (res && res.success) {
          const newList = res.data.list || [];
          setRecommendList(newList);
          // ✅ 修复爆红：通过判断返回的数组长度是否等于请求的 pageSize 来决定是否有下一页
          setHasMore(newList.length === 20); 
          setPage(2);
        }
      } catch (error) {
        console.error('加载推荐列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendList();
  }, []);

  // 加载更多推荐数据
  const loadMoreRecommend = async () => {
    if (!hasMore || loading) return;

    try {
      const res = await apiGetHotelList({
        city: '',
        beginDate: dayjs().format('YYYY-MM-DD'),
        endDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
        page,
        pageSize: 20
      });

      if (res && res.success) {
        const newList = res.data.list || [];
        setRecommendList(prev => [...prev, ...newList]);
        // 同样修复爆红
        setHasMore(newList.length === 20);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      Toast.show({ icon: 'fail', content: '加载失败' });
    }
  };
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
        <Outlet context={{ dateRange: currentDateRange, setDateRange: setCurrentDateRange } satisfies HomeContextType} />
      </div>

      {/* 4. 快捷入口金刚区 */}
      <div className={styles.gridContainer}>
        {quickEntries.map(entry => (
          <div 
            key={entry.label} 
            className={styles.gridItem}
            onClick={() => handleQuickEntry(entry)}
          >
            {/* ✅ 核心修改：注入渐变背景色和居中显示的白色图标 */}
            <div 
              className={styles.gridIcon}
              style={{ 
                background: entry.color,
                color: '#fff',
                fontSize: '22px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 4px 10px rgba(0,0,0,0.1)' // 加一点点投影让它浮起来
              }}
            >
              {entry.icon}
            </div>
            <div className={styles.gridLabel}>{entry.label}</div>
          </div>
        ))}
      </div>

      {/* ✅ 3. 新增：猜你喜欢 / 推荐列表 */}
      <div className={styles.recommendSection}>
        <div className={styles.sectionTitle}>
           <FireFill color='#ff3141' /> 猜你喜欢
        </div>
        
        {loading && recommendList.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#999' }}>
            <DotLoading color='primary' /> 加载中...
          </div>
        ) : (
          <div className={styles.cardList}>
            {recommendList.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                className={styles.cardWrapper}
                onClick={() => {
                  // 使用酒店自己的城市信息，而不是首页选择的城市
                  const hotelCity = item.location || '上海';
                  
                  // 1. 格式化日期（使用当前类型对应的日期）
                  let beginStr = dayjs(currentDateRange[0]).format('YYYY-MM-DD');
                  let endStr = dayjs(currentDateRange[1]).format('YYYY-MM-DD');
                  
                  // 钟点房特殊处理：如果入住和离店是同一天，后端需要传第二天
                  if (isHourly && beginStr === endStr) {
                    endStr = dayjs(currentDateRange[0]).add(1, 'day').format('YYYY-MM-DD');
                  }
                  
                  // 2. 带着参数跳转（包括酒店所在城市）
                  navigate(`/detail/${item.id}?beginDate=${beginStr}&endDate=${endStr}&city=${hotelCity}`);
                }}
              >
                <HotelCard hotel={item} />
              </div>
            ))}

            {/* 无限滚动组件 */}
            <InfiniteScroll loadMore={loadMoreRecommend} hasMore={hasMore}>
              {hasMore ? (
                <div style={{ textAlign: 'center', padding: '12px', color: '#999' }}>
                  <DotLoading /> 加载中...
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '12px', color: '#999' }}>
                  {recommendList.length > 0 ? '没有更多了' : ''}
                </div>
              )}
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;