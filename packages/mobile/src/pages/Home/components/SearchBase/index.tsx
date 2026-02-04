import React from 'react';
import { Button } from 'antd-mobile';
import styles from './index.module.css'

interface SearchBaseProps {
  type: 'domestic' | 'overseas' | 'hourly' | 'inn';
  onSearch: () => void;
  showNightCount?: boolean; // 是否显示“几晚”
}

const SearchBase: React.FC<SearchBaseProps> = ({ type, onSearch, showNightCount = true }) => {
  return (
    <div className={styles.searchCard}>
      <div className={styles.inputItem}>
        <div className={styles.label}>{type === 'overseas' ? '目的地 (英文/拼音)' : '目的地'}</div>
        <div className={styles.value}>{type === 'overseas' ? 'Singapore' : '上海'}</div>
      </div>

      <div className={styles.inputItem}>
        <div className={styles.dateRow}>
          <div className={styles.dateBlock}>
            <div className={styles.label}>入住</div>
            <div className={styles.dateValue}>02月04日</div>
          </div>
          
          {showNightCount && <div className={styles.nightCount}>1晚</div>}
          
          <div className={`${styles.dateBlock} ${styles.textRight}`}>
            <div className={styles.label}>离店</div>
            <div className={styles.dateValue}>02月05日</div>
          </div>
        </div>
      </div>

      <div className={styles.btnWrapper}>
        <Button block color='primary' size='large' onClick={onSearch} className={styles.searchBtn}>
          查询酒店
        </Button>
      </div>
    </div>
  );
};

export default SearchBase;