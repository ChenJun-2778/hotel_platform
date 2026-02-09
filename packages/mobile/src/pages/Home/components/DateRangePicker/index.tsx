import React, { useState, useEffect } from 'react';
import { Popup, Calendar, Button } from 'antd-mobile';
import dayjs from 'dayjs';
import styles from './index.module.css';

// 校验类型
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
      // 这是父组件传的onChange，和下面的onChange作用域不同
      onChange(selection); // 把草稿提交给父组件
      onClose(); // 关闭窗口
    }
  };

  // 计算几晚 (用于按钮显示优化)
  const nightCount = isCompleted ? dayjs(selection[1]).diff(dayjs(selection[0]), 'day') : 0;
  // ✅ 核心逻辑：渲染“入住”和“离店”标签
  const renderLabel = (date: Date) => {
    if (!selection) return null;
    const [start, end] = selection;

    // 只有在开始日期和结束日期，才渲染这个 div
    if (start && dayjs(date).isSame(start, 'day')) {
      return <div className={styles.topLabel}>入住</div>;
    }
    if (end && dayjs(date).isSame(end, 'day')) {
      return <div className={styles.topLabel}>离店</div>;
    }
    return null;
  };
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose} // 点击遮罩层直接关闭，相当于“取消”
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
            // 这里是Calendar内置的事件，通过绑定一个响应值使得页面变化
            onChange={(val) => setSelection(val)} // 只更新草稿
            min={new Date()} // 禁止选过去的时间
            weekStartsOn='Monday'
            // ✅ 新增：绑定渲染函数
            renderLabel={renderLabel}
            // ✅ 优化：强制让整个日历撑满宽度，防止某些情况下样式不对齐
            style={{ '--cell-height': '60px' } as React.CSSProperties}
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