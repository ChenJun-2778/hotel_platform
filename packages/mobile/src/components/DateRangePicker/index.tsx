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
  // 3. 新增：酒店类型（用于判断是否是钟点房）
  hotelType?: 'domestic' | 'overseas' | 'hourly' | 'inn';
}

const DateRangePicker: React.FC<Props> = ({ visible, onClose, defaultDate, onConfirm, hotelType }) => {
  const [selection, setSelection] = useState<[Date, Date] | null>(null);

  // 判断是否是钟点房
  const isHourly = hotelType === 'hourly';

  // 新增：计算最大可选日期（今天起往后 180 天）
  const maxDate = dayjs().add(180, 'day').toDate();
  
  // 打开时，把父组件传进来的日期设为选中状态
  useEffect(() => {
    if (visible && defaultDate) {
      setSelection(defaultDate);
    }
  }, [visible, defaultDate]);

  // 自定义日期选择逻辑
  const handleDateChange = (val: [Date, Date] | null) => {
    if (!val) {
      setSelection(null);
      return;
    }

    if (isHourly) {
      // 钟点房：单选模式，选中的日期作为入住和离店日期（同一天）
      const selectedDate = Array.isArray(val) ? val[0] : val;
      if (selectedDate) {
        const sameDay = dayjs(selectedDate).startOf('day').toDate();
        setSelection([sameDay, sameDay]);
      }
    } else {
      // 非钟点房：范围选择模式
      const [start, end] = val;
      
      // 如果两个日期都选了
      if (start && end) {
        const nights = dayjs(end).diff(dayjs(start), 'day');
        
        // 如果选择了同一天（0晚），不允许
        if (nights === 0) {
          // 只保留开始日期，等待用户选择结束日期
          setSelection([start, null as any]);
        } else {
          // 正常情况，至少1晚
          setSelection(val);
        }
      } else {
        // 只选了一个日期，正常设置
        setSelection(val);
      }
    }
  };

  // 钟点房：选中一个日期就算完成
  // 非钟点房：必须选中两个不同的日期
  const isCompleted = isHourly 
    ? selection && selection[0]
    : selection && selection[0] && selection[1] && dayjs(selection[1]).diff(dayjs(selection[0]), 'day') > 0;

  const handleConfirm = () => {
    if (isCompleted && selection) {
      // 3. 传出数据
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
      // 钟点房：只显示"使用日期"
      if (start && dayjs(date).isSame(start, 'day')) {
        return <div className={styles.topLabel}>使用日期</div>;
      }
    } else {
      // 非钟点房：显示"入住"和"离店"
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
            selectionMode={isHourly ? 'single' : 'range'}
            value={selection}
            onChange={handleDateChange}
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