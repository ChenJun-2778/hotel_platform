import React, { useState } from 'react';
import { Button, Calendar, Popup } from 'antd-mobile';
import styles from '../SearchBase/index.module.css'
import dayjs from 'dayjs';
// import { data } from 'react-router-dom';

interface SearchBaseProps {
  type: 'domestic' | 'overseas' | 'hourly' | 'inn';
  onSearch: () => void;
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
  // 计算天数差
  // const nightCount = dateRange ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day') : 1;
  // 判断是否选好了两个不同的日期
  const isCompleted = dateRange && dateRange[0] && dateRange[1] && 
                      !dayjs(dateRange[0]).isSame(dateRange[1], 'day');
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

          <div className={`${styles.dateBlock} ${styles.textRight}`}>
            <div className={styles.label}>离店</div>
            <div className={styles.dateValue}>
              {dayjs(dateRange?.[1]).format('MM月DD日')}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <Button block color='primary' size='large' onClick={onSearch} className={styles.searchBtn}>
          查询酒店
        </Button>
      </div>
      {/* 日历组件 */}
      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        bodyStyle={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px', minHeight: '40vh' }}
      >
        <div className={styles.calendarWrapper}>
          <Calendar
            selectionMode='range'
            value={dateRange}
            onChange={(val: [Date, Date] | null) => {
              setDateRange(val)
              // 只有当用户选好了两个日期（入离店）时，才自动关闭弹窗
              // if (val && val[0] && val[1]) {
              //   setVisible(false);
              // }
            }}
            // onClose={() => setVisible(false)}
            min={new Date()}
          />
          {/* 底部确认按钮区域 */}
          <div className={styles.confirmBtnWrapper}>
            <Button
              block
              color='primary'
              disabled={!isCompleted} // 逻辑判定：没选全则禁用
              onClick={() => setVisible(false)} // 点击才关闭
            >
              {isCompleted ? '确认选择' : '请选择入离日期'}
            </Button>
          </div>
        </div> 
      </Popup>
    </div>
  );
};

export default SearchBase;