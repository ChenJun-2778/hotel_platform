import React, { useState, useEffect } from 'react';
import { Popup, Calendar, Button } from 'antd-mobile';
import dayjs from 'dayjs';
import styles from './index.module.css';

interface Props {
  visible: boolean;
  onClose: () => void;
  value: [Date, Date] | null;
  onChange: (val: [Date, Date] | null) => void;
}

const DateRangePicker: React.FC<Props> = ({ visible, onClose, value, onChange }) => {
  // 1. 定义中间状态 (Buffer State)，相当于“草稿纸”
  const [selection, setSelection] = useState<[Date, Date] | null>(null);

  // 2. 每次弹窗打开时，把父组件的“正式数据”复制到“草稿纸”上
  useEffect(() => {
    if (visible) {
      setSelection(value);
    }
  }, [visible, value]);

  // 3. 校验逻辑：必须选了两个日期，且不为空
  // 注意：这里判断的是 selection (草稿)，而不是 value (正式数据)
  const isCompleted = selection && selection[0] && selection[1];

  // 4. 提交逻辑：点击确认按钮
  const handleConfirm = () => {
    if (isCompleted) {
      onChange(selection); // 把草稿提交给父组件
      onClose(); // 关闭窗口
    }
  };

  // 计算几晚 (用于按钮显示优化)
  const nightCount = isCompleted ? dayjs(selection[1]).diff(dayjs(selection[0]), 'day') : 0;

  return (
    <Popup
      visible={visible}
      onMaskClick={onClose} // 点击遮罩层直接关闭，相当于“取消”
      bodyStyle={{ borderTopLeftRadius: '12px', borderTopRightRadius: '12px', height: '80vh' }}
    >
      <div className={styles.container}>
        {/* 标题栏 */}
        <div className={styles.header}>
          <div className={styles.title}>选择日期</div>
          <div className={styles.closeIcon} onClick={onClose}>×</div>
        </div>

        {/* 日历主体 (可滚动) */}
        <div className={styles.body}>
          <Calendar
            selectionMode='range'
            value={selection} // 绑定草稿
            onChange={(val) => setSelection(val)} // 只更新草稿
            min={new Date()} // 禁止选过去的时间
            weekStartsOn='Monday'
          />
        </div>

        {/* 底部按钮 (固定底部) */}
        <div className={styles.footer}>
          <Button
            block
            color='primary'
            size='large'
            disabled={!isCompleted} // 没选完禁用
            onClick={handleConfirm} // 点击才提交
          >
            {isCompleted ? `确认选择 (${nightCount}晚)` : '请选择入住和离店日期'}
          </Button>
        </div>
      </div>
    </Popup>
  );
};

export default DateRangePicker;