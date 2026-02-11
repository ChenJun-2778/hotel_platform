import React, { useState, useEffect, useRef  } from 'react';
import { NavBar, CapsuleTabs, DotLoading, Dropdown, Radio, Space, Button } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { EnvironmentOutline, SearchOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
// 导入酒店卡牌组件
import HotelCard from '@/components/HotelCard';
// import type { HotelList } from '@/components/HotelCard/type'
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
  
  // 新增状态：控制排序
  // def = 默认, price_asc = 价格低到高, score_desc = 评分高到低
  const [sortType, setSortType] = useState<string>('def'); 

  // 新增引用：用来手动控制 Dropdown 关闭
  const dropdownRef = useRef<any>(null);
  // 返回逻辑
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

  const [hotelList, setHotelList] = useState<any[]>([]); // 存放列表数据
  const [loading, setLoading] = useState(true); // 控制 Loading 显示
  useEffect(() => {
    // 设置请求方法
    const getHotelList = async () => {
      setLoading(true)
      try {
        // ✅ 把 sortType 传给 API
        const res: any = await apiGetHotelList({ 
          city, 
          beginDate, 
          endDate, 
          type,
          sortType // <--- 关键：传给后端
      });
        if (res && res.code === 200) {
          setHotelList(res.data);
        }
      } catch (error) {
        
      } finally {
        setLoading(false)
      }
    }

    getHotelList()
  }, [city, type, beginDate, endDate, sortType])

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
        {/* ✅ 核心修改区域：使用 Dropdown 替换原来的静态 div */}
        <div className={styles.dropdownWrapper}>
          <Dropdown ref={dropdownRef}>
            {/* 第一项：排序 */}
            <Dropdown.Item key='sort' title={
                sortType === 'def' ? '欢迎度排序' : 
                sortType === 'price_asc' ? '价格低到高' : '高分优先'
            }>
              <div style={{ padding: 12 }}>
                <Radio.Group 
                    value={sortType} 
                    onChange={(val) => {
                        setSortType(val as string);
                        dropdownRef.current?.close(); // 选中后自动关闭菜单
                    }}
                >
                  <Space direction='vertical' block>
                    <Radio block value='def'>欢迎度排序 (默认)</Radio>
                    <Radio block value='price_asc'>价格从低到高</Radio>
                    <Radio block value='score_desc'>评分从高到低</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Dropdown.Item>

            {/* 第二项：位置 (这里仅做演示，暂时放个空内容) */}
            <Dropdown.Item key='position' title='位置距离'>
              <div style={{ padding: 12, height: 200 }}>
                 这里可以放商圈/地铁站选择组件...
              </div>
            </Dropdown.Item>

            {/* 第三项：价格星级 */}
            <Dropdown.Item key='price' title='价格/星级'>
               <div style={{ padding: 12 }}>
                  <h3>价格区间</h3>
                  <div style={{display: 'flex', gap: 10, marginBottom: 20}}>
                      <Button size='mini'>0-150</Button>
                      <Button size='mini'>150-300</Button>
                      <Button size='mini'>300-600</Button>
                  </div>
                  <h3>星级</h3>
                  <div style={{display: 'flex', gap: 10}}>
                      <Button size='mini'>三星</Button>
                      <Button size='mini'>四星</Button>
                      <Button size='mini'>五星</Button>
                  </div>
               </div>
            </Dropdown.Item>
            
            {/* 第四项：筛选 */}
            <Dropdown.Item key='more' title='筛选'>
               <div style={{ padding: 12 }}>更多筛选条件...</div>
            </Dropdown.Item>
          </Dropdown>
        </div>

        {/* 胶囊标签 (保持不变) */}
        <div className={styles.quickTags}>
             <CapsuleTabs defaultActiveKey='1'>
                <CapsuleTabs.Tab title='外滩' key='1' />
                <CapsuleTabs.Tab title='双床房' key='2' />
                <CapsuleTabs.Tab title='含早餐' key='3' />
                <CapsuleTabs.Tab title='免费兑早餐' key='4' />
             </CapsuleTabs>
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