import React from 'react';
import { Button, NavBar, TabBar } from 'antd-mobile';
import { AppOutline, UnorderedListOutline, UserOutline } from 'antd-mobile-icons'; // 需要安装图标库
import styles from './index.module.css';
// 引入跳转钩子
import { useNavigate } from 'react-router-dom';


const Home: React.FC = () => {
  const navigate = useNavigate()
  // 跳转到list页面
  const goList = () => navigate('/list')
  return (
    <div className={styles.homeContainer}>
      <NavBar back={null} className={styles.navBar}>易宿酒店预订</NavBar>

      <div className={styles.banner}>
        <div className={styles.bannerTag}>携程在手，说走就走</div>
      </div>

      {/* 搜索卡片 */}
      <div className={styles.searchCard}>
        <div className={styles.inputItem}>
          <div className={styles.label}>目的地</div>
          <div className={styles.value}>上海</div>
        </div>
        <div className={styles.inputItem}>
          <div className={styles.dateRow}>
            <div className={styles.dateBlock}>
              <div className={styles.label}>入住</div>
              <div className={styles.dateValue}>01月30日</div>
            </div>
            <div className={styles.nightCount}>1晚</div>
            <div className={`${styles.dateBlock} ${styles.textRight}`}>
              <div className={styles.label}>离店</div>
              <div className={styles.dateValue}>01月31日</div>
            </div>
          </div>
        </div>
        <div className={styles.btnWrapper}>
          <Button
            block color='primary'
            size='large'
            onClick={goList}
            className={styles.searchBtn}
            >
            查询酒店
          </Button>
        </div>
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