import React, { useState, useEffect } from 'react';
import { Popup, Calendar, Button } from 'antd-mobile';
import dayjs from 'dayjs';
import styles from './index.module.css';

interface Props {
  visible: boolean;
  onClose: () => void;
  defaultDate?: [Date, Date]; 
  onConfirm: (start: Date, end: Date) => void;
  hotelType?: 'domestic' | 'overseas' | 'hourly' | 'inn';
}

const DateRangePicker: React.FC<Props> = ({ visible, onClose, defaultDate, onConfirm, hotelType }) => {
  const [selection, setSelection] = useState<[Date, Date] | null>(null);

  // 判断是否是钟点房
  const isHourly = hotelType === 'hourly';

  // 计算最大可选日期（今天起往后 180 天）
  const maxDate = dayjs().add(180, 'day').toDate();
  
  // 打开时，把父组件传进来的日期设为选中状态
  useEffect(() => {
    if (visible && defaultDate) {
      setSelection(defaultDate);
    }
  }, [visible, defaultDate]);

  // 钟点房：选中一个日期就算完成
  // 非钟点房：必须选中两个不同的日期
  const isCompleted = isHourly 
    ? selection && selection[0]
    : selection && selection[0] && selection[1] && dayjs(selection[1]).diff(dayjs(selection[0]), 'day') > 0;

  const handleConfirm = () => {
    if (isCompleted && selection) {
      onConfirm(selection[0], selection[1]);
      onClose(); // 关闭日历
    }
  };

  // 计算晚数（只在非钟点房时显示）
  const nightCount = !isHourly && isCompleted && selection 
    ? dayjs(selection[1]).diff(dayjs(selection[0]), 'day') 
    : 0;
  
  const renderLabel = (date: Date) => {
    if (!selection) return null;
    const [start, end] = selection;
    
    if (isHourly) {
      if (start && dayjs(date).isSame(start, 'day')) {
        return <div className={styles.topLabel}>使用日期</div>;
      }
    } else {
      if (start && dayjs(date).isSame(start, 'day')) {
        return <div className={styles.topLabel}>入住</div>;
      }
      if (end && dayjs(date).isSame(end, 'day')) {
        return <div className={styles.topLabel}>离店</div>;
      }
    }
    return null;
  };

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='bottom'
      bodyStyle={{ borderTopLeftRadius: '16px', borderTopRightRadius: '16px', minHeight: '60vh' }}
    >
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.title}>选择日期</div>
          <div className={styles.closeIcon} onClick={onClose}>×</div>
        </div>

        {/* Body: ✅ 核心修复区 - 拆分单选和多选渲染，彻底解决 TS 报错 */}
        <div className={styles.body}>
          {isHourly ? (
            <Calendar
              selectionMode='single'
              // 单选模式 value 只需要 Date | null
              value={selection ? selection[0] : null} 
              onChange={(val: Date | null) => {
                if (!val) {
                  setSelection(null);
                } else {
                  // 钟点房将选中日期同时作为 start 和 end
                  const sameDay = dayjs(val).startOf('day').toDate();
                  setSelection([sameDay, sameDay]);
                }
              }}
              min={new Date()} 
              max={maxDate}
              renderLabel={renderLabel}
              style={{ '--cell-height': '60px' } as React.CSSProperties}
            />
          ) : (
            <Calendar
              selectionMode='range'
              // 多选模式 value 需要 [Date, Date] | null
              value={selection} 
              onChange={(val: [Date, Date] | null) => {
                if (!val) {
                  setSelection(null);
                  return;
                }
                const [start, end] = val;
                if (start && end) {
                  const nights = dayjs(end).diff(dayjs(start), 'day');
                  if (nights === 0) {
                    // 同一天不允许，只保留开始日期
                    setSelection([start, null as any]);
                  } else {
                    setSelection(val);
                  }
                } else {
                  setSelection(val);
                }
              }}
              min={new Date()} 
              max={maxDate}
              renderLabel={renderLabel}
              style={{ '--cell-height': '60px' } as React.CSSProperties}
            />
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            block
            color='primary'
            size='large'
            disabled={!isCompleted}
            onClick={handleConfirm}
          >
             {isHourly 
               ? (isCompleted ? '确认选择' : '请选择使用日期')
               : (isCompleted ? `确认选择 (${nightCount}晚)` : '请选择入住和离店日期')
             }
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default DateRangePicker;