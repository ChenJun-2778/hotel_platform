import React, { useState, useEffect, useRef } from 'react';
import { NavBar, CapsuleTabs, DotLoading, Toast, Dropdown, Button, Input } from 'antd-mobile';
import { useNavigate, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { EnvironmentOutline, SearchOutline, CloseCircleFill } from 'antd-mobile-icons';
import styles from './index.module.css';
import 'dayjs/locale/zh-cn';
dayjs.locale('zh-cn');
// 自定义路由跳转钩子
import { useGoCities } from '@/utils/routerUtils';
// 引入组件
import HotelCard from '@/components/HotelCard';
// 下拉弹框
import SearchPanel from './components/SearchPanel';
// 日历组件
import DateRangePicker from '@/components/DateRangePicker';
// ✅ 1. 引入新抽离的智能排序组件
import SmartSortPanel from './components/SmartSortPanel';
// 引入价格组件
import PricePanel from './components/PricePanel';
// ✅ 引入评分组件
import ScoreStarPanel from './components/ScoreStarPanel';
// 引入api
import { apiGetHotelList } from '@/api/Hotel/index';
// 引入筛选组件
import FilterPanel from './components/FilterPanel';
// const TYPE_MAP_STR_TO_NUM: Record<string, number> = {
//   'domestic': 1,
//   'overseas': 2,
//   'hourly': 3,
//   'inn': 4
// };
const List: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // ✅ 这里需要 setSearchParams
  const navigate = useNavigate();
  // 搜索时的关键字
  const keyword = searchParams.get('keyword') || '';
  // --- 1. 参数提取与默认值处理  ---
  const type = searchParams.get('type');
  const city = searchParams.get('city') || '上海';
  const { goCities } = useGoCities(); // 获取城市跳转方法
  // 确保 beginDate 和 endDate 永远是字符串
  const rawBegin = searchParams.get('beginDate');
  const rawEnd = searchParams.get('endDate');
  // 设置安全值
  const safeBeginDate = rawBegin || dayjs().format('YYYY-MM-DD'); // 默认今天
  const safeEndDate = rawEnd || dayjs().add(1, 'day').format('YYYY-MM-DD'); // 默认明天

  // 计算晚数
  const nightCount = dayjs(safeEndDate).diff(dayjs(safeBeginDate), 'day');

  // 控制排序
  const [sortType, setSortType] = useState<string>('def');
  // 控制 Dropdown 关闭
  const dropdownRef = useRef<any>(null);
  // 排序的菜单数据保留在父组件，方便以后传给后端或做动态修改
  const sortOptions = [
    { label: '智能排序', value: 'def' },
    { label: '好评优先', value: 'score_desc', desc: '根据点评分、点评条数等综合排序' },
    { label: '低价优先', value: 'price_asc' },
    { label: '高价优先', value: 'price_desc' },
    { label: '高星优先', value: 'star_desc' },
  ];
  // 静态筛选条件的状态
  // const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]); // 价格
  const [filterScore, setFilterScore] = useState(''); // 分数
  // 综合
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [selectedComment, setSelectedComment] = useState('');
  const [filterStar, setFilterStar] = useState(''); //
  // 控制弹窗显示
  const [showSearchPanel, setShowSearchPanel] = useState(false);
  // 城市跳转方法
  const handleCityClick = () => {
    // ✅ 修复：直接把 URL 里的 type 字符串转成数字，兜底为 1
    const targetTypeId = Number(type) || 1;

    setShowSearchPanel(false);
    
    // 如果是海外，这里传过去的 targetTypeId 就是实打实的 2！
    goCities(targetTypeId, city);
  };
  // 左侧：打开弹窗
  const handleLeftClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSearchPanel(true);
  };
  const urlBeginDate = searchParams.get('beginDate') || dayjs().format('YYYY-MM-DD');
  const urlEndDate = searchParams.get('endDate') || dayjs().add(1, 'day').format('YYYY-MM-DD');

  // 1. 控制日历显示的状态
  const [showCalendar, setShowCalendar] = useState(false);
  // 定义中间量
  // 2. 临时日期状态 (用户在 SearchPanel/日历 里选的，还没确认的)
  const [tempDates, setTempDates] = useState<[string, string]>([urlBeginDate, urlEndDate]);
  // 城市草稿
  const [tempCity, setTempCity] = useState<string>(city)
  // 右侧：去搜索页
  const handleRightClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setTempDates([urlBeginDate, urlEndDate]); // 重置
    // 带着当前参数去搜索页
    const searchUrl = `/search?city=${city}&beginDate=${safeBeginDate}&endDate=${safeEndDate}&type=${type || ''}`;
    navigate(searchUrl);
  };
  // 3. 点击 SearchPanel 里的日期 -> 打开日历
  const handleDateClick = () => {
    setShowCalendar(true);
  };
  // 4. 日历选好了 -> 更新临时日期 -> 关闭日历
  const handleCalendarConfirm = (start: Date, end: Date) => {
    const newBegin = dayjs(start).format('YYYY-MM-DD');
    const newEnd = dayjs(end).format('YYYY-MM-DD');
    setTempDates([newBegin, newEnd]); // SearchPanel 上的数字会立马变
    setShowCalendar(false); // 关日历，回到 SearchPanel
  };

  // 下拉编辑面板确认逻辑
  const handleConfirm = () => {
    setShowSearchPanel(false);
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.set('city', tempCity); // 用草稿城市
      newParams.set('beginDate', tempDates[0]);
      newParams.set('endDate', tempDates[1]);
      return newParams;
    });
    // Toast.show({ content: '搜索已更新', position: 'bottom' });
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
  // 监听从城市页面返回
  useEffect(() => {
    const checkSelectedCity = () => {
      const selected = localStorage.getItem('selectedCity');
      if (selected) {
        // console.log('检测到新城市，更新草稿:', selected);
        // ✅ 关键修改 A：只更新“草稿城市”，不更新 URL
        setTempCity(selected);
        // 这里需要拿到最新的 safeBeginDate 和 safeEndDate
        setTempDates([safeBeginDate, safeEndDate]);
        // ✅ 关键修改 B：强制打开 SearchPanel，让用户确认
        setShowSearchPanel(true);
        localStorage.removeItem('selectedCity');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSelectedCity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    checkSelectedCity(); // 初始化检查

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [safeBeginDate, safeEndDate]);
  // ✅ 清除关键词的逻辑
  const handleClearKeyword = (e: React.MouseEvent) => {
    // 1. 阻止冒泡：防止触发父级 div 的点击跳转
    e.stopPropagation();
    // 2. 修改 URL参数：删除 keyword
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      newParams.delete('keyword');
      return newParams;
    });
    // 3. 此时 URL 变了，useEffect 会自动监听到变化并重新请求数据
  }
  // 请求酒店列表
  useEffect(() => {
    const getHotelList = async () => {
      setLoading(true);
      try {
        // 构建请求参数
        const params: any = {
          city,
          beginDate: safeBeginDate,
          endDate: safeEndDate,
          type, 
          sortType,
          keyword
        };

        // 添加价格筛选
        if (priceRange[0] > 0) {
          params.price_min = priceRange[0];
        }
        if (priceRange[1] < 1000) {
          params.price_max = priceRange[1];
        }

        // 添加评分筛选
        if (filterScore) {
          const scoreValue = parseFloat(filterScore);
          if (!isNaN(scoreValue)) {
            params.score_min = scoreValue;
          }
        }

        // 添加星级筛选
        if (filterStar) {
          const starValue = parseInt(filterStar);
          if (!isNaN(starValue)) {
            params.star_min = starValue;
          }
        }

        // 添加设施筛选（逗号分隔）
        if (selectedFacilities.length > 0) {
          params.facilities = selectedFacilities.join(',');
        }

        // 添加评价数筛选
        if (selectedComment) {
          // 从 "200条以上" 中提取数字 200
          const match = selectedComment.match(/(\d+)/);
          if (match) {
            params.review_count_min = parseInt(match[1]);
          }
        }

        // 调试：打印请求参数
        console.log('🔍 请求参数:', params);

        // 调用 API
        const res = await apiGetHotelList(params);

        // 处理返回的数据
        if (res && res.success) {
          setHotelList(res.data.list || []); 
        } else {
           Toast.show({ icon: 'fail', content: res.message || '查询失败' });
        }
      } catch (error) {
        Toast.show({ icon: 'fail', content: '网络异常，请重试' });
      } finally {
        setLoading(false);
      }
    }

    getHotelList();
  }, [city, type, safeBeginDate, safeEndDate, sortType, keyword, priceRange, filterScore, filterStar, selectedFacilities, selectedComment]);

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
            <div onClick={handleLeftClick} style={{ display: 'flex', alignItems: 'center' }}>
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
              <span className={styles.placeholder} style={{ color: keyword ? '#333' : '#999' }}>{keyword || '位置/品牌/酒店'}</span>
              {keyword && (
                <div
                  onClick={handleClearKeyword} // 绑定清除事件
                  style={{
                    padding: '4px', // 增加一点点击热区
                    display: 'flex',
                    alignItems: 'center',
                    color: '#ccc' // 灰色图标不抢眼
                  }}
                >
                  <CloseCircleFill fontSize={16} />
                </div>
              )}
            </div>
          </div>
        </NavBar>

        {/* 筛选区 */}
       {/* 筛选区 */}
       <div className={styles.sortContainer}>
          
          {/* ✅ Dropdown 占据剩余宽度 */}
          <div className={styles.dropdownWrapper}>
            <Dropdown ref={dropdownRef}>
              
              {/* 1. 智能排序下拉框 */}
              <Dropdown.Item 
                key='sort' 
                title={sortOptions.find(opt => opt.value === sortType)?.label || '智能排序'}
                highlight={sortType !== 'def'}
              >
                <SmartSortPanel
                  options={sortOptions}
                  currentSort={sortType}
                  onSortChange={setSortType}
                  onClose={() => dropdownRef.current?.close()}
                />
              </Dropdown.Item>

              {/* 2. 价格下拉 (彻底干掉行内样式) */}
              <Dropdown.Item 
                key='price' 
                title='价格'
                highlight={priceRange[0] > 0 || priceRange[1] < 1000}
              >
                <PricePanel
                  priceRange={priceRange}
                  onChange={setPriceRange}
                  onReset={() => { 
                    setPriceRange([0, 1000]); // 重置就是回归无限制
                  }}
                  onConfirm={() => dropdownRef.current?.close()}
                />
              </Dropdown.Item>

             {/* ✅ 3. 合并后的 评分/星级 下拉框 */}
             <Dropdown.Item 
               key='score_star' 
               title='评分/星级'
               highlight={!!filterScore || !!filterStar}
             >
                <ScoreStarPanel
                  filterScore={filterScore}
                  onScoreChange={setFilterScore}
                  filterStar={filterStar}
                  onStarChange={setFilterStar}
                  onReset={() => { 
                    setFilterScore(''); 
                    setFilterStar(''); 
                  }}
                  onConfirm={() => dropdownRef.current?.close()}
                />
              </Dropdown.Item>

              {/* 4. 综合筛选下拉框 */}
              <Dropdown.Item 
                key='filter' 
                title='筛选'
                highlight={selectedFacilities.length > 0 || !!selectedComment}
              >
                <FilterPanel
                  selectedFacilities={selectedFacilities}
                  onFacilitiesChange={setSelectedFacilities}
                  selectedComment={selectedComment}
                  onCommentChange={setSelectedComment}
                  onReset={() => {
                    // 重置时清空所有相关状态
                    setSelectedFacilities([]);
                    setSelectedComment('');
                  }}
                  onConfirm={() => dropdownRef.current?.close()}
                />
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
        
        {/* 快捷标签区 */}
        <div className={styles.quickTags}>
          <CapsuleTabs
            defaultActiveKey=''
            onChange={(key) => {
              setSearchParams(prev => {
                const newParams = new URLSearchParams(prev);
                if (key === '') {
                  newParams.delete('keyword');
                } else {
                  newParams.set('keyword', key);
                }
                return newParams;
              });
            }}
          >
            <CapsuleTabs.Tab title='全部' key='' />
            <CapsuleTabs.Tab title='免费停车' key='停车' />
            <CapsuleTabs.Tab title='近地铁' key='地铁' />
            <CapsuleTabs.Tab title='含早餐' key='早餐' />
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
            <div key={`${item.id}-${index}`} onClick={() => navigate(
              `/detail/${item.id}?` +
              `beginDate=${safeBeginDate}&` +
              `endDate=${safeEndDate}`
            )}>
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
        // 这里展示的是“草稿”数据
        city={tempCity}         // 传 tempCity
        beginDate={tempDates[0]} // 传 tempDates
        endDate={tempDates[1]}
        nightCount={dayjs(tempDates[1]).diff(dayjs(tempDates[0]), 'day')}
        onConfirm={handleConfirm}
        onDateClick={handleDateClick}
        onCityClick={handleCityClick}
      />
      {/*  日期选择 */}
      <DateRangePicker
        visible={showCalendar}
        onClose={() => setShowCalendar(false)}
        // 把字符串转回 Date 对象传给日历做回显
        defaultDate={[new Date(tempDates[0]), new Date(tempDates[1])]}
        onConfirm={handleCalendarConfirm}
      />
    </div>
  );
};

export default List;