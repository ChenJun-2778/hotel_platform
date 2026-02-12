import React, { useState, useEffect } from 'react';
import { Button } from 'antd-mobile';
import styles from './index.module.css'; // 注意这里的引入路径，通常是同级
import dayjs from 'dayjs';
// 导入日历组件
import DateRangePicker from '@/components/DateRangePicker'; // 确保路径正确
import { useGoCities, useGoList } from '@/utils/routerUtils';

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
  // 1. 控制日历弹窗显隐
  const [visible, setVisible] = useState(false);
  
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
  // 优先从缓存拿上次选的城市
  const [city, setCity] = useState(() => {
    return localStorage.getItem('HOME_CITY') || '上海';
  });
  const { goCities } = useGoCities();
  
  const handleCityClick = () => {
    goCities(currentTypeId, city);
  }

  // 监听城市回传 (Local Storage 方案)
  useEffect(() => {
    const checkSelectedCity = () => {
      const selected = localStorage.getItem('selectedCity');
      if (selected) {
        setCity(selected);
        localStorage.setItem('HOME_CITY', selected);
        localStorage.removeItem('selectedCity');
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSelectedCity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    checkSelectedCity();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // 4. 跳转List
  const { goList } = useGoList();
  
  const handelSearch = () => {
    const params = {
      city: city, 
      beginDate: dayjs(dateRange[0]).format('YYYY-MM-DD'),
      endDate: dayjs(dateRange[1]).format('YYYY-MM-DD'),
    }
    goList(params, currentTypeId);
  }

  return (
    <div className={styles.searchCard}>
      {/* 目的地 */}
      <div className={styles.inputItem} onClick={handleCityClick}>
        <div className={styles.label}>{type === 'overseas' ? '目的地 (英文/拼音)' : '目的地'}</div>
        <div className={styles.value}>{city}</div>
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
      />
    </div>
  );
};

export default SearchBase;