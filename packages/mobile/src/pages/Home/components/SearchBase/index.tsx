import React, { useState } from 'react';
import { Button } from 'antd-mobile';
import styles from '../SearchBase/index.module.css'
import dayjs from 'dayjs';
// import { data } from 'react-router-dom';
// 导入日历组件
import DateRangePicker from '../DateRangePicker/index'

interface SearchBaseProps {
  type: 'domestic' | 'overseas' | 'hourly' | 'inn';
  onSearch: (params?: any) => void;
  showNightCount?: boolean; // 是否显示“几晚”
}

const SearchBase: React.FC<SearchBaseProps> = ({ type, onSearch, showNightCount = true }) => {
  // 1. 控制日历弹窗显隐的状态
  const [visible, setVisible] = useState(false)
  // 2. 存储选中的日期范围，默认为“今天”和“明天”
  const [dateRange, setDateRange] = useState<[Date, Date] | null>([
    new Date(),
    dayjs().add(1, 'day').toDate()
  ]);

  // 跳转List
  const goList = () => {
    // 设置打包的静态数据
    const params = {
      type,
      city: '上海', // 后续如果你接入了城市选择，这里就是动态的
      // 关键：将 Date 对象转为字符串，否则 URL 识别不了对象
      beginDate: dayjs(dateRange?.[0]).format('YYYY-MM-DD'),
      endDate: dayjs(dateRange?.[1]).format('YYYY-MM-DD'),
    }
    onSearch(params)
  }
  return (
    <div className={styles.searchCard}>
      {/* 目的地 */}
      <div className={styles.inputItem}>
        <div className={styles.label}>{type === 'overseas' ? '目的地 (英文/拼音)' : '目的地'}</div>
        <div className={styles.value}>{type === 'overseas' ? 'Singapore' : '上海'}</div>
      </div>

      {/* 日期选择 */}
      <div className={styles.inputItem} onClick={() => setVisible(true)}>
        <div className={styles.dateRow}>
          <div className={styles.dateBlock}>
            <div className={styles.label}>入住</div>
            <div className={styles.dateValue}>
              {dayjs(dateRange?.[0]).format('MM月DD日')}
            </div>
          </div>

          {showNightCount && <div className={styles.nightCount}>1晚</div>}

          {showNightCount && <div className={`${styles.dateBlock} ${styles.textRight}`}>
            <div className={styles.label}>离店</div>
            <div className={styles.dateValue}>
              {dayjs(dateRange?.[1]).format('MM月DD日')}
            </div>
          </div>}
        </div>
      </div>

      {/* 查询酒店 */}
      <div className={styles.btnWrapper}>
        <Button block color='primary' size='large' onClick={goList} className={styles.searchBtn}>
          查询酒店
        </Button>
      </div>
      {/* 日历组件 */}
      <DateRangePicker
        visible={visible}
        onClose={() => setVisible(false)}
        value={dateRange}
        onChange={setDateRange}
      />
    </div>
  );
};

export default SearchBase;