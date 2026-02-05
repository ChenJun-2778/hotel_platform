import React from 'react';
import { Button, Calendar, Popup } from 'antd-mobile';
import dayjs from 'dayjs';
import styles from './index.module.css';

interface Props {
  visible: boolean;
  onClose: () => void;
  value: [Date, Date] | null;
  onChange: (val: [Date, Date] | null) => void;
}

const DateRangePicker: React.FC<Props> = ({ visible, onClose, value, onChange }) => {
  // 计算天数差
  // const nightCount = dateRange ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day') : 1;
  // 判断是否选好了两个不同的日期
  const isCompleted = value && value[0] && value[1] && 
                      !dayjs(value[0]).isSame(value[1], 'day');

  return (
    <Popup
        visible={visible}
        onMaskClick={onClose}
        bodyStyle={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px', minHeight: '40vh' }}
      >
        <div className={styles.calendarWrapper}>
          <Calendar
            selectionMode='range'
            value={value}
            onChange={(val: [Date, Date] | null) => {
              onChange(val)
            }}
            min={new Date()}
          />
          {/* 底部确认按钮区域 */}
          <div className={styles.confirmBtnWrapper}>
            <Button
              block
              color='primary'
              disabled={!isCompleted} // 逻辑判定：没选全则禁用
              onClick={onClose} // 点击才关闭
            >
              {isCompleted ? '确认选择' : '请选择入离日期'}
            </Button>
          </div>
        </div> 
      </Popup>
  )
}

export default DateRangePicker