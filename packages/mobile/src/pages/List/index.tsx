import React, { useState, useEffect, useRef } from 'react';
import { NavBar, CapsuleTabs, DotLoading, Dropdown, Radio, Space, Toast } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { EnvironmentOutline, SearchOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
// 引入组件
import HotelCard from '@/components/HotelCard';
import SearchPanel from './components/SearchPanel';
import { apiGetHotelList } from '@/api/hotel';

const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ 这里需要 setSearchParams
  const navigate = useNavigate();

  // --- 1. 参数提取与默认值处理  ---
  const type = searchParams.get('type');
  const city = searchParams.get('city') || '上海';
  
  // 确保 beginDate 和 endDate 永远是字符串
  const rawBegin = searchParams.get('beginDate');
  const rawEnd = searchParams.get('endDate');
  
  const safeBeginDate = rawBegin || dayjs().format('YYYY-MM-DD'); // 默认今天
  const safeEndDate = rawEnd || dayjs().add(1, 'day').format('YYYY-MM-DD'); // 默认明天
  
  // 计算晚数
  const nightCount = dayjs(safeEndDate).diff(dayjs(safeBeginDate), 'day');
  
  // 控制排序
  const [sortType, setSortType] = useState<string>('def'); 
  // 控制 Dropdown 关闭
  const dropdownRef = useRef<any>(null);

  // 控制弹窗显示
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  // 左侧：打开弹窗
  const handleLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    setShowSearchPanel(true);
  };
  // 右侧：去搜索页
  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('去搜索页');
  };

  // 下拉编辑面板确认逻辑
  const handleConfirm = () => {
    setShowSearchPanel(false);
    
    // 模拟数据更新：这里暂时只是提示
    // 如果想要真的更新列表，你需要在这里调用 setSearchParams
    // 例如：
    /*
    setSearchParams({
        ...Object.fromEntries(searchParams),
        city: city, // 这里应该是 SearchPanel 传回来的新城市
        beginDate: safeBeginDate, // 这里应该是 SearchPanel 传回来的新日期
        endDate: safeEndDate
    });
    */
    
    Toast.show({ content: '模拟更新成功', position: 'bottom' });
  };
   // 返回逻辑
  const handleBack = () => {
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
  // 存放列表数据
  const [hotelList, setHotelList] = useState<any[]>([]); 
  // 加载显示
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const getHotelList = async () => {
      setLoading(true);
      try {
        const res: any = await apiGetHotelList({ 
          city, 
          beginDate: safeBeginDate, // ✅ 传安全的参数
          endDate: safeEndDate,     // ✅ 传安全的参数
          type,
          sortType
      });
        if (res && res.code === 200) {
          setHotelList(res.data);
        }
      } catch (error) {
        
      } finally {
        setLoading(false);
      }
    }

    getHotelList();
  }, [city, type, safeBeginDate, safeEndDate, sortType]) // ✅ 依赖项也改成 safe 变量

  return (
    <div className={styles.listContainer}>
      <div className={styles.headerSticky}>
        <NavBar 
          onBack={handleBack} 
          right={renderRight} 
          className={styles.customNav}
        >
          <div className={styles.searchBox}>
            {/* 左侧三个元素 */}
            <div onClick={handleLeftClick} style={{display: 'flex', alignItems: 'center'}}>
               {/* 注意：为了布局对齐，建议在这里加个 style flex，或者去 CSS 里把 cityText 的父级处理好 */}
              <div className={styles.cityText}>{city}</div>
                <div className={styles.dateRange}>
                  <div className={styles.dateItem}>
                    <span>住</span>{dayjs(safeBeginDate).format('MM-DD')}
                  </div>
                  <div className={styles.dateItem}>
                    <span>离</span>{dayjs(safeEndDate).format('MM-DD')}
                  </div>
                </div>
            </div>
            <div className={styles.nightBadge} onClick={handleLeftClick}>{nightCount}晚</div>
            
            {/* 右侧搜索框 */}
            <div className={styles.inputMock} onClick={handleRightClick}>
               <SearchOutline className={styles.searchIcon} />
               <span className={styles.placeholder}>位置/品牌/酒店</span>
            </div>
          </div>
        </NavBar>

        {/* 筛选区 */}
        <div className={styles.dropdownWrapper}>
          <Dropdown ref={dropdownRef}>
            <Dropdown.Item key='sort' title={
                sortType === 'def' ? '欢迎度排序' : 
                sortType === 'price_asc' ? '价格低到高' : '高分优先'
            }>
              <div style={{ padding: 12 }}>
                <Radio.Group 
                    value={sortType} 
                    onChange={(val) => {
                        setSortType(val as string);
                        dropdownRef.current?.close();
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

            {/* 其他下拉项保持不变... */}
            <Dropdown.Item key='position' title='位置距离'>
              <div style={{ padding: 12, height: 200 }}>这里可以放商圈/地铁站选择组件...</div>
            </Dropdown.Item>
            <Dropdown.Item key='price' title='价格/星级'>
               <div style={{ padding: 12 }}>更多筛选...</div>
            </Dropdown.Item>
            <Dropdown.Item key='more' title='筛选'>
               <div style={{ padding: 12 }}>更多筛选条件...</div>
            </Dropdown.Item>
          </Dropdown>
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

      <div className={styles.listContent}>
         {loading ? (
           <div className={styles.loadingWrapper}>
             <DotLoading color='primary' /> 正在寻找酒店...
           </div>
         ) : (
           hotelList.map((item, index) => (
             // ✅ 注意：如果数据有重复，建议 key 加上 index: `${item.id}-${index}`
             <div key={`${item.id}-${index}`} onClick={() => navigate(`/detail/${item.id}`)}>
               <HotelCard hotel={item} />
             </div>
           ))
         )}
         
         {!loading && hotelList.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>暂无数据</div>
         )}
      </div>

      {/* 下拉编辑框 */}
      <SearchPanel 
        visible={showSearchPanel}
        onClose={() => setShowSearchPanel(false)}
        city={city}
        beginDate={safeBeginDate} // ✅ 传 safeBeginDate (string)
        endDate={safeEndDate}     // ✅ 传 safeEndDate (string)
        nightCount={nightCount}
        onConfirm={handleConfirm}
      />
    </div>
  );
};

export default List;