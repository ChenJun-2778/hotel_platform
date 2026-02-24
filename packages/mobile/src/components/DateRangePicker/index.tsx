import React, { useState, useEffect } from 'react';
import { Popup, Calendar, Button } from 'antd-mobile';
import dayjs from 'dayjs';
import styles from './index.module.css';

interface Props {
  visible: boolean;
  onClose: () => void;
  // 1. 改名：不再是受控组件，而是传入初始值
  defaultDate?: [Date, Date]; 
  // 2. 改名：点击确认时，一次性把开始和结束日期传出去
  onConfirm: (start: Date, end: Date) => void;
}

const DateRangePicker: React.FC<Props> = ({ visible, onClose, defaultDate, onConfirm }) => {
  const [selection, setSelection] = useState<[Date, Date] | null>(null);

  // 新增：计算最大可选日期（今天起往后 180 天）
  const maxDate = dayjs().add(180, 'day').toDate();
  // 打开时，把父组件传进来的日期设为选中状态
  useEffect(() => {
    if (visible && defaultDate) {
      setSelection(defaultDate);
    }
  }, [visible, defaultDate]);

  const isCompleted = selection && selection[0] && selection[1];

  const handleConfirm = () => {
    if (isCompleted && selection) {
      // 3. 传出数据
      onConfirm(selection[0], selection[1]);
      onClose(); // 关闭日历
    }
  };

  // ... renderLabel 和 nightCount 逻辑保持你原来的不变 ...
  const nightCount = isCompleted && selection ? dayjs(selection[1]).diff(dayjs(selection[0]), 'day') : 0;
  
  const renderLabel = (date: Date) => {
    // ... 保持你原来的逻辑 ...
    if (!selection) return null;
    const [start, end] = selection;
    if (start && dayjs(date).isSame(start, 'day')) return <div className={styles.topLabel}>入住</div>;
    if (end && dayjs(date).isSame(end, 'day')) return <div className={styles.topLabel}>离店</div>;
    return null;
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      // 4. 这里的 bodyStyle 保持你原来的或者去掉高度限制，不动 CSS
      bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', minHeight: '60vh' }}
    >
      <div className={styles.container}>
        {/* Header 保持不变 */}
        <div className={styles.header}>
          <div className={styles.title}>选择日期</div>
          <div className={styles.closeIcon} onClick={onClose}>×</div>
        </div>

        {/* Body 保持不变 */}
        <div className={styles.body}>
          <Calendar
            selectionMode='range'
            value={selection}
            onChange={(val) => setSelection(val)}
            // 最大和最小日期传给日历组件
            min={new Date()} 
            max={maxDate}
            renderLabel={renderLabel}
            style={{ '--cell-height': '60px' } as React.CSSProperties}
          />
        </div>

        {/* Footer 保持不变 */}
        <div className={styles.footer}>
          <Button
            block
            color='primary'
            size='large'
            disabled={!isCompleted}
            onClick={handleConfirm}
          >
             {isCompleted ? `确认选择 (${nightCount}晚)` : '请选择入住和离店日期'}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default DateRangePicker;