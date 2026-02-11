// src/pages/List/components/SearchPanel/index.tsx
import React from 'react';
import { Popup, Button } from 'antd-mobile';
import { RightOutline } from 'antd-mobile-icons';
import dayjs from 'dayjs';
import styles from './index.module.css';

interface Props {
  visible: boolean;
  onClose: () => void;
  city: string;
  beginDate: string;
  endDate: string;
  nightCount: number;
  onConfirm: () => void;
}

const SearchPanel: React.FC<Props> = ({ 
  visible, 
  onClose, 
  city, 
  beginDate, 
  endDate, 
  nightCount,
  onConfirm 
}) => {
  return (
    <Popup
      visible={visible}
      onMaskClick={onClose}
      position='top'
    //   top='50px' // 避开 NavBar
      bodyStyle={{ borderRadius: '0 0 16px 16px', padding: '16px 20px' }}
    >
      <div className={styles.container}>
        {/* 1. 城市行 */}
        <div className={styles.row}>
          <span className={styles.cityText}>{city}</span>
          <RightOutline color='#ccc' />
        </div>

        {/* 2. 日期行 */}
        <div className={styles.row}>
          <div className={styles.dateRow}>
            <div className={styles.dateBlock}>
              <span className={styles.dateLabel}>今天入住</span>
              <span className={styles.dateValue}>{dayjs(beginDate).format('MM月DD日')}</span>
            </div>
            <div className={styles.spacer}></div>
            <div className={styles.dateBlock}>
              <span className={styles.dateLabel}>明天离店</span>
              <span className={styles.dateValue}>{dayjs(endDate).format('MM月DD日')}</span>
            </div>
          </div>
          <div className={styles.nightTag}>
            共 {nightCount} 晚
          </div>
        </div>

        {/* 3. 人数行 */}
        <div className={styles.row} style={{ borderBottom: 'none' }}>
           <span className={styles.guestText}>1间 · 2成人 · 0儿童</span>
           <RightOutline color='#ccc' />
        </div>

        {/* 4. 按钮 */}
        <Button 
          block 
          color='primary' 
          className={styles.confirmBtn}
          onClick={onConfirm}
        >
          完成
        </Button>
      </div>
    </Popup>
  );
};

export default SearchPanel;