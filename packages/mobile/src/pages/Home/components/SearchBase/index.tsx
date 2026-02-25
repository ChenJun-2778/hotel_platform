import React, { useState, useEffect } from 'react';
import { Button, Toast, DotLoading } from 'antd-mobile';
import { EnvironmentOutline, CloseCircleOutline } from 'antd-mobile-icons';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
import dayjs from 'dayjs';
// 导入日历组件
import DateRangePicker from '@/components/DateRangePicker';
import { useGoCities, useGoList } from '@/utils/routerUtils';
// 引入定位hook函数
import { useLocation } from '@/utils/useLocation';
interface SearchBaseProps {
  type: 'domestic' | 'overseas' | 'hourly' | 'inn';
  showNightCount?: boolean;
  // 接收父组件的日期和修改方法
  dateRange: [Date, Date];
  onDateChange: (range: [Date, Date]) => void;
}

// 类型映射字典
const TYPE_MAP: Record<string, number> = {
  'domestic': 1,
  'overseas': 2,
  'hourly': 3,
  'inn': 4
};

const SearchBase: React.FC<SearchBaseProps> = ({ type, showNightCount = true, dateRange, onDateChange }) => {
  const navigate = useNavigate();
  
  // 1. 控制日历弹窗显隐
  const [visible, setVisible] = useState(false);

  // 关键词状态 - 初始化时从 localStorage 读取
  const [keyword, setKeyword] = useState(() => {
    return localStorage.getItem('SEARCH_KEYWORD_DRAFT') || '';
  });

  // 2. 存储选中的日期范围
  // const [dateRange, setDateRange] = useState<[Date, Date]>([
  //   new Date(),
  //   dayjs().add(1, 'day').toDate()
  // ]);

  // 计算晚数
  const nightCount = dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day');

  // 计算当前卡片的typeId
  const currentTypeId = TYPE_MAP[type] || 1;

  // 3. 城市相关
  // 根据类型设置不同的默认城市
  const getDefaultCity = () => {
    if (type === 'overseas') {
      return localStorage.getItem('HOME_CITY_OVERSEAS') || '东京';
    }
    return localStorage.getItem('HOME_CITY') || '上海';
  };

  const [city, setCity] = useState(getDefaultCity);
  const { goCities } = useGoCities();

  const handleCityClick = () => {
    goCities(currentTypeId, city);
  }

  // 增加一个状态，控制定位时的 Loading 效果
  const { locating, getCurrentCity } = useLocation();

  // 一键定位功能
  // 3. 现在的点击定位函数，清爽到只有这几行！
  const handleLocate = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // 一句话调用，等待返回城市名！
      const resultCity = await getCurrentCity();

      // 拿到城市名后，更新 UI 和本地存储
      setCity(resultCity);
      // 根据类型保存到不同的 key
      if (type === 'overseas') {
        localStorage.setItem('HOME_CITY_OVERSEAS', resultCity);
      } else {
        localStorage.setItem('HOME_CITY', resultCity);
      }
      Toast.show({ icon: 'success', content: '定位成功' });

    } catch (error) {
      // 错误已经在 Hook 里被 Toast 提示过了，这里只需要静默处理即可
      console.log('定位流程中断');
    }
  };

  // 监听城市回传和关键词草稿
  useEffect(() => {
    const checkSelectedCity = () => {
      const selected = localStorage.getItem('selectedCity');
      if (selected) {
        setCity(selected);
        // 根据类型保存到不同的 key
        if (type === 'overseas') {
          localStorage.setItem('HOME_CITY_OVERSEAS', selected);
        } else {
          localStorage.setItem('HOME_CITY', selected);
        }
        localStorage.removeItem('selectedCity');
      }
    };

    const checkKeywordDraft = () => {
      const keywordDraft = localStorage.getItem('SEARCH_KEYWORD_DRAFT');
      // console.log(' 关键词:', keywordDraft);
      if (keywordDraft) {
        setKeyword(keywordDraft);
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // console.log(' 页面可见，检查数据...');
        checkSelectedCity();
        checkKeywordDraft();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // 初始化时也检查一次
    checkSelectedCity();
    checkKeywordDraft();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [type]);

  // 4. 跳转List
  const { goList } = useGoList();

  const handelSearch = () => {
    let beginDate = dayjs(dateRange[0]).format('YYYY-MM-DD');
    let endDate = dayjs(dateRange[1]).format('YYYY-MM-DD');
    
    // 钟点房特殊处理：如果入住和离店是同一天，后端需要传第二天
    if (type === 'hourly' && beginDate === endDate) {
      endDate = dayjs(dateRange[0]).add(1, 'day').format('YYYY-MM-DD');
    }
    
    const params: any = {
      city: city,
      beginDate: beginDate,
      endDate: endDate,
    };
    
    // 只有关键词不为空时才添加
    if (keyword.trim()) {
      params.keyword = keyword.trim();
    }
    
    // console.log('酒店参数:', params);
    
    goList(params, currentTypeId);
    
    // 清除关键词草稿
    localStorage.removeItem('SEARCH_KEYWORD_DRAFT');
    setKeyword('');
  }

  // 5. 跳转到搜索页
  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // 带上城市、日期、类型参数跳转到搜索页
    const searchUrl = `/search?` +
      `city=${city}&` +
      `beginDate=${dayjs(dateRange[0]).format('YYYY-MM-DD')}&` +
      `endDate=${dayjs(dateRange[1]).format('YYYY-MM-DD')}&` +
      `type=${currentTypeId}`;
    navigate(searchUrl);
  }

  // 6. 清除关键词
  const handleClearKeyword = (e: React.MouseEvent) => {
    e.stopPropagation();
    setKeyword('');
    localStorage.removeItem('SEARCH_KEYWORD_DRAFT');
  }

  return (
    <div className={styles.searchCard}>
      {/* 目的地、搜索、定位 (三栏布局) */}
      <div className={`${styles.inputItem} ${styles.inputItemRow}`}>

        {/* 1. 左栏：城市名字 */}
        <div className={styles.citySection} onClick={handleCityClick}>
          <div className={styles.label}>{type === 'overseas' ? '目的地 (英文/拼音)' : '目的地'}</div>
          <div className={styles.value}>{city}</div>
        </div>

        {/* 2. 中栏：搜索伪装框 */}
        <div className={styles.searchMockCenter} onClick={handleSearchClick}>
          {keyword ? (
            <div className={styles.keywordWrapper}>
              <span className={styles.keywordText}>{keyword}</span>
              <CloseCircleOutline 
                className={styles.clearIcon}
                onClick={handleClearKeyword}
              />
            </div>
          ) : (
            <span className={styles.placeholderText}>位置/品牌/酒店</span>
          )}
        </div>

        {/* 3. 右栏：一键定位按钮 (完全保留了你原有的逻辑和上下结构) */}
        <div className={styles.locateBtnCenter} onClick={handleLocate}>
          {locating ? <DotLoading color="primary" /> : <EnvironmentOutline fontSize={20} />}
          <span 
            className={styles.locateText} 
            style={{ color: locating ? '#999' : '#1677ff' }} 
          >
            {locating ? '定位中' : '我的位置'}
          </span>
        </div>

      </div>

      {/* 日期选择 */}
      <div className={styles.inputItem} onClick={() => setVisible(true)}>
        <div className={styles.dateRow}>
          <div className={styles.dateBlock}>
            <div className={styles.label}>入住</div>
            <div className={styles.dateValue}>
              {dayjs(dateRange[0]).format('MM月DD日')}
            </div>
          </div>

          {showNightCount && <div className={styles.nightCount}>{nightCount}晚</div>}

          {showNightCount && <div className={`${styles.dateBlock} ${styles.textRight}`}>
            <div className={styles.label}>离店</div>
            <div className={styles.dateValue}>
              {dayjs(dateRange[1]).format('MM月DD日')}
            </div>
          </div>}
        </div>
      </div>

      {/* 查询酒店 */}
      <div className={styles.btnWrapper}>
        <Button block color='primary' size='large' onClick={handelSearch} className={styles.searchBtn}>
          查询酒店
        </Button>
      </div>

      {/* ✅ 关键修改：适配新版日历组件的 Props */}
      <DateRangePicker
        visible={visible}
        onClose={() => setVisible(false)}
        // 旧：value={dateRange} -> 新：defaultDate
        defaultDate={dateRange}
        // 旧：onChange={setDateRange} -> 新：onConfirm
        onConfirm={(start, end) => {
          onDateChange([start, end]);
          // setVisible(false) 在组件内部已经调用
        }}
        // 传递酒店类型
        hotelType={type}
      />
    </div>
  );
};

export default SearchBase;