import React from 'react';
import { NavBar, CapsuleTabs } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { EnvironmentOutline, SearchOutline } from 'antd-mobile-icons';
import styles from './index.module.css';

const List: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 参数提取
  const type = searchParams.get('type');
  const city = searchParams.get('city') || '上海';
  const beginDate = searchParams.get('beginDate');
  const endDate = searchParams.get('endDate');
  const nightCount = beginDate && endDate ? dayjs(endDate).diff(dayjs(beginDate), 'day') : 1;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    const pathMap: Record<string, string> = { '2': '/overseas', '3': '/hourly', '4': '/inn' };
    navigate(pathMap[type || ''] || '/');
  };

  // 1. 定义右侧地图按钮 (单独提取，布局更稳)
  const renderRight = (
    <div className={styles.mapIcon}>
      <EnvironmentOutline fontSize={18} />
      <span>地图</span>
    </div>
  );

  return (
    <div className={styles.listContainer}>
      <div className={styles.headerSticky}>
        {/* 2. 修复 NavBar：删除 backArrow，使用 right 属性 */}
        <NavBar 
          onBack={handleBack} 
          right={renderRight} 
          className={styles.customNav}
        >
          {/* 中间：灰色胶囊搜索条 */}
          <div className={styles.searchBox}>
            <div className={styles.cityText}>{city}</div>
            
            <div className={styles.dateRange}>
              <div className={styles.dateItem}>
                <span>住</span>{dayjs(beginDate).format('MM-DD')}
              </div>
              <div className={styles.dateItem}>
                <span>离</span>{dayjs(endDate).format('MM-DD')}
              </div>
            </div>

            <div className={styles.nightBadge}>{nightCount}晚</div>

            <div className={styles.inputMock}>
               <SearchOutline className={styles.searchIcon} />
               <span className={styles.placeholder}>位置/品牌/酒店</span>
            </div>
          </div>
        </NavBar>

        {/* 筛选区 */}
        <div className={styles.filterSection}>
          <div className={styles.filterRow}>
             <div className={styles.filterItem}>欢迎度排序 ▼</div>
             <div className={styles.filterItem}>位置距离 ▼</div>
             <div className={styles.filterItem}>价格/星级 ▼</div>
             <div className={styles.filterItem}>筛选 ▼</div>
          </div>
          <div className={styles.quickTags}>
             <CapsuleTabs defaultActiveKey='1'>
                <CapsuleTabs.Tab title='外滩' key='1' />
                <CapsuleTabs.Tab title='双床房' key='2' />
                <CapsuleTabs.Tab title='含早餐' key='3' />
                <CapsuleTabs.Tab title='免费兑早餐' key='4' />
             </CapsuleTabs>
          </div>
        </div>
      </div>

      {/* 3. 酒店列表区域 (目前是白的，马上填) */}
      <div className={styles.listContent}>
         {/* 稍后在这里放 HotelCard */}
      </div>
    </div>
  );
};

export default List;