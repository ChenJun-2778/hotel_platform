import React, { useState, useEffect, useRef } from 'react';
import { NavBar, CapsuleTabs, DotLoading, Dropdown, Radio, Space, Toast } from 'antd-mobile';
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
// 引入api
import { apiGetHotelList } from '@/api/hotel/index';

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
  // const dropdownRef = useRef<any>(null);
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
  // 请求酒店列表
  useEffect(() => {
    const getHotelList = async () => {
      setLoading(true);
      try {
        // ✅ 修改 1：参数映射翻译。把前端的变量塞给后端指定的 key
        const params: any = {
          destination: city,             // 前端的 city -> 后端的 destination
          check_in_date: safeBeginDate,  // 前端的 safeBeginDate -> 后端的 check_in_date
          check_out_date: safeEndDate,   // 前端的 safeEndDate -> 后端的 check_out_date
          // 如果你的后端还支持 type, sort, keyword 搜索，把下面的注释打开
          // type: Number(type) || 1,
          // sortType: sortType,
          // keyword: keyword
        };

        const res: any = await apiGetHotelList(params);
        
        // ✅ 修改 2：适配新的返回数据结构
        // 以前是 res.code === 200，现在后端给的是 res.success === true
        if (res && res.success) {
          // 以前数据直接在 res.data，现在真实数据嵌套在 res.data.list 里面！
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
  }, [city, type, safeBeginDate, safeEndDate, sortType, keyword]); // 依赖项保持前端变量名不变

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
        <div className={styles.sortContainer}>
          {[
            { key: 'def', label: '推荐' },
            { key: 'price_asc', label: '低价优先' },
            { key: 'score_desc', label: '高分优先' },
            { key: 'star_desc', label: '高星优先' }
          ].map(item => (
            <div
              key={item.key}
              onClick={() => setSortType(item.key)}
              // 动态组合 class：如果选中，就多加一个 active 的 class
              className={`${styles.sortItem} ${sortType === item.key ? styles.sortItemActive : ''}`}
            >
              {item.label}
              {/* 只有选中时才渲染底部蓝条 */}
              {sortType === item.key && <div className={styles.activeBar} />}
            </div>
          ))}
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