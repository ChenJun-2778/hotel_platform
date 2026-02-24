import React, { useState } from 'react';
import { Button } from 'antd-mobile';
import styles from './index.module.css';

interface FilterPanelProps {
  selectedFacilities: string[];
  onFacilitiesChange: (vals: string[]) => void;
  selectedComment: string;
  onCommentChange: (val: string) => void;
  onReset: () => void;
  onConfirm: () => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedFacilities,
  onFacilitiesChange,
  selectedComment,
  onCommentChange,
  onReset,
  onConfirm
}) => {
  // 左侧选中的 Tab：默认选中 'facility'
  const [activeTab, setActiveTab] = useState<'facility' | 'comment'>('facility');

  // 静态选项数据
  const facilityOptions = ['停车场', '洗衣房', '健身房', '游泳池', '会议室', '充电车位'];
  const commentOptions = ['200条以上', '100条以上', '50条以上'];

  // 处理设施的【多选】逻辑
  const handleFacilityToggle = (val: string) => {
    if (selectedFacilities.includes(val)) {
      onFacilitiesChange(selectedFacilities.filter(item => item !== val));
    } else {
      onFacilitiesChange([...selectedFacilities, val]);
    }
  };

  // 处理评价的【单选/反选】逻辑
  const handleCommentToggle = (val: string) => {
    onCommentChange(selectedComment === val ? '' : val);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.content}>
        {/* 左侧导航 */}
        <div className={styles.sidebar}>
          <div 
            className={`${styles.sidebarItem} ${activeTab === 'facility' ? styles.sidebarItemActive : ''}`}
            onClick={() => setActiveTab('facility')}
          >
            设施
          </div>
          <div 
            className={`${styles.sidebarItem} ${activeTab === 'comment' ? styles.sidebarItemActive : ''}`}
            onClick={() => setActiveTab('comment')}
          >
            评价
          </div>
        </div>

        {/* 右侧面板 */}
        <div className={styles.main}>
          {activeTab === 'facility' && (
            <div>
              <div className={styles.sectionTitle}>公共设施</div>
              <div className={styles.grid}>
                {facilityOptions.map(opt => {
                  const isActive = selectedFacilities.includes(opt);
                  return (
                    <Button
                      key={opt}
                      className={isActive ? styles.btnActive : styles.btnNormal}
                      color={isActive ? 'primary' : 'default'}
                      fill={isActive ? 'solid' : 'outline'}
                      onClick={() => handleFacilityToggle(opt)}
                    >
                      {opt}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'comment' && (
            <div>
              <div className={styles.sectionTitle}>评论数</div>
              <div className={styles.grid}>
                {commentOptions.map(opt => {
                  const isActive = selectedComment === opt;
                  return (
                    <Button
                      key={opt}
                      className={isActive ? styles.btnActive : styles.btnNormal}
                      color={isActive ? 'primary' : 'default'}
                      fill={isActive ? 'solid' : 'outline'}
                      onClick={() => handleCommentToggle(opt)}
                    >
                      {opt}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 底部按钮 */}
      <div className={styles.footer}>
        <Button block size="middle" shape="rounded" onClick={onReset}>重置</Button>
        <Button block size="middle" shape="rounded" color="primary" onClick={onConfirm}>查看</Button>
      </div>
    </div>
  );
};

export default FilterPanel;