import React, { useState, useEffect } from 'react';
import { NavBar, CapsuleTabs, DotLoading } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { EnvironmentOutline, SearchOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
// 导入酒店卡牌组件
import HotelCard from '@/components/HotelCard';
import type { HotelList } from '@/components/HotelCard/type'
// 导入请求api
import { apiGetHotelList } from '@/api/hotel'

const List: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // 参数提取
  const type = searchParams.get('type');
  const city = searchParams.get('city') || '上海';
  const beginDate = searchParams.get('beginDate');
  const endDate = searchParams.get('endDate');
  const nightCount = beginDate && endDate ? dayjs(endDate).diff(dayjs(beginDate), 'day') : 1;

  // const handleBack = () => {
  //   if (window.history.length > 1) {
  //     navigate(-1);
  //     return;
  //   }
  //   const pathMap: Record<string, string> = { '2': '/overseas', '3': '/hourly', '4': '/inn' };
  //   navigate(pathMap[type || ''] || '/');
  // };
  const handleBack = () => {
    // 直接根据 type 决定回哪个首页 tab，简单粗暴且安全
    const pathMap: Record<string, string> = { '2': '/overseas', '3': '/hourly', '4': '/inn' };
    navigate(pathMap[type || ''] || '/');
  }

  // 1. 定义右侧地图按钮 (单独提取，布局更稳)
  const renderRight = (
    <div className={styles.mapIcon}>
      <EnvironmentOutline fontSize={18} />
      <span>地图</span>
    </div>
  );

  // 酒店的mock数据
//   const HOTELS: HotelList = [
//   {
//     id: '1',
//     name: '上海陆家嘴禧玥酒店',
//     image: 'https://pavo.elongstatic.com/i/Hotel180_120/nw_LSZ9S8H9S0.jpg',
//     score: 4.8,
//     scoreText: '超棒',
//     commentCount: 4695,
//     collectCount: '6.3万',
//     position: '近外滩 · 东方明珠',
//     recommend: 'BOSS:25楼是沪上知名米其林新荣记',
//     tags: ['免费升房', '新中式风', '免费停车', '一线江景'],
//     rank: '上海美景酒店榜 No.16',
//     price: 936,
//     star: 5
//   },
//   {
//     id: '2',
//     name: '艺龙安悦酒店(上海浦东大道歌德路地铁站店)',
//     image: 'https://pavo.elongstatic.com/i/Hotel180_120/nw_1g9Y9Y9Y9Y.jpg',
//     score: 4.7,
//     scoreText: '超棒',
//     commentCount: 6729,
//     collectCount: '4.5万',
//     position: '近歌德路地铁站 · LCM置汇旭辉广场',
//     recommend: '临滨江步道可欣赏陆家嘴夜景',
//     tags: ['免费停车', '免费洗衣服务', '机器人服务', '自助早餐'],
//     price: 199,
//     star: 3
//   }
// ];
const [hotelList, setHotelList] = useState<any[]>([]); // 存放列表数据
const [loading, setLoading] = useState(true); // 控制 Loading 显示
useEffect(() => {
  // 设置请求方法
  const getHotelList = async () => {
    setLoading(true)
    try {
      const res: any = await apiGetHotelList({ city, beginDate, endDate } as any)
      if (res && res.code === 200) {
        setHotelList(res.data);
      }
    } catch (error) {
      
    } finally {
      setLoading(false)
    }
  }

  getHotelList()
}, [city])

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
         {/* <HotelCard hotel={HOTELS[0]}></HotelCard> */}
         {loading ? (
           <div className={styles.loadingWrapper}>
             <DotLoading color='primary' /> 正在寻找酒店...
           </div>
         ) : (
           hotelList.map(item => (
             <div key={item.id} onClick={() => navigate(`/detail/${item.id}`)}>
               <HotelCard hotel={item} />
             </div>
           ))
         )}
         
         {!loading && hotelList.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>暂无数据</div>
         )}
      </div>
    </div>
  );
};

export default List;