// import React from 'react';
import { CapsuleTabs, NavBar, TabBar } from 'antd-mobile';
import { AppOutline, UnorderedListOutline, UserOutline, FireFill } from 'antd-mobile-icons'; // 需要安装图标库
import styles from './index.module.css';
// 引入跳转钩子
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
// 引入组件
import HotelCard from '@/components/HotelCard';
import { MOCK_HOTEL_LIST } from '@/mock/data'


const Home = () => {
  const navigate = useNavigate()
  // 跳转到list页面
  // const goList = () => navigate('/list')
  const location = useLocation();

  // 根据当前路由确定激活哪个 Tab
  const activeKey = location.pathname.split('/').pop() || 'domestic';

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
        <Outlet />
      </div>

      {/* 4. 快捷入口金刚区 (静态展示) */}
      <div className={styles.gridContainer}>
        {['特价酒店', '民宿客栈', '钟点房', '滑雪季'].map(item => (
          <div key={item} className={styles.gridItem}>
            <div className={styles.gridIcon}></div>
            <div className={styles.gridLabel}>{item}</div>
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
                onClick={() => navigate(`/detail/${item.id}`)}
            >
              {/* 直接复用你之前写的卡片 */}
              <HotelCard hotel={item} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. 底部固定导航 (TabBar) */}
      <div className={styles.bottomTabBar}>
        <TabBar activeKey='home'>
          <TabBar.Item key='home' icon={<AppOutline />} title='首页' />
          <TabBar.Item key='order' icon={<UnorderedListOutline />} title='订单' />
          <TabBar.Item key='user' icon={<UserOutline />} title='我的' />
        </TabBar>
      </div>
    </div>
  );
};

export default Home;