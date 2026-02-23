import React from 'react';
import { CheckOutline } from 'antd-mobile-icons';

export interface SortOption {
  label: string;
  value: string;
  desc?: string;
}

interface SmartSortPanelProps {
  options: SortOption[];
  currentSort: string;
  onSortChange: (value: string) => void;
  onClose: () => void;
}

const SmartSortPanel: React.FC<SmartSortPanelProps> = ({
  options,
  currentSort,
  onSortChange,
  onClose
}) => {
  return (
    <div style={{ padding: '0 16px' }}>
      {options.map(option => (
        <div
          key={option.value}
          style={{
            padding: '16px 0',
            borderBottom: '1px solid #f5f5f5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: currentSort === option.value ? '#1677ff' : '#333',
            fontWeight: currentSort === option.value ? 'bold' : 'normal'
          }}
          onClick={() => {
            onSortChange(option.value); // 更新排序状态
            onClose();                  // 关闭下拉面板
          }}
        >
          <div>
            <div style={{ fontSize: 15 }}>{option.label}</div>
            {option.desc && (
              <div style={{ fontSize: 12, color: '#999', marginTop: 4, fontWeight: 'normal' }}>
                {option.desc}
              </div>
            )}
          </div>
          {/* 选中状态展示蓝色小勾 */}
          {currentSort === option.value && <CheckOutline fontSize={20} />}
        </div>
      ))}
    </div>
  );
};

export default SmartSortPanel;