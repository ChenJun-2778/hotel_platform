import React from 'react';
import { Button } from 'antd-mobile';

interface ScoreStarPanelProps {
  filterScore: string;
  onScoreChange: (val: string) => void;
  filterStar: string;
  onStarChange: (val: string) => void;
  onReset: () => void;
  onConfirm: () => void;
}

const ScoreStarPanel: React.FC<ScoreStarPanelProps> = ({
  filterScore,
  onScoreChange,
  filterStar,
  onStarChange,
  onReset,
  onConfirm
}) => {
  // 按照你发的 UI 图定义的静态数据
  const scoreOptions = [
    { label: '4.5分以上', value: '4.5' },
    { label: '4.0分以上', value: '4.0' },
    { label: '3.5分以上', value: '3.5' }
  ];

  const starOptions = [
    { label: '五星/豪华', value: '5' },
    { label: '四星/高档', value: '4' },
    { label: '三星/舒适', value: '3' }
  ];

  return (
    <div style={{ padding: '16px' }}>
      
      {/* 评分区块 */}
      <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>评分</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        {scoreOptions.map((opt) => (
          <Button
            key={opt.value}
            size="small"
            color={filterScore === opt.value ? 'primary' : 'default'}
            fill={filterScore === opt.value ? 'solid' : 'outline'}
            style={{ borderRadius: '16px' }}
            onClick={() => {
              // ✅ 核心修复：如果当前已经选中了这个值，再次点击就传空字符串（取消选中）
              onScoreChange(filterScore === opt.value ? '' : opt.value);
            }}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* 星级区块 */}
      <div style={{ fontWeight: 'bold', marginBottom: '12px' }}>星级</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
        {starOptions.map((opt) => (
          <Button
            key={opt.value}
            size="small"
            color={filterStar === opt.value ? 'primary' : 'default'}
            fill={filterStar === opt.value ? 'solid' : 'outline'}
            style={{ borderRadius: '16px' }}
            onClick={() => {
              // ✅ 核心修复：同理，点击已激活的选项即取消
              onStarChange(filterStar === opt.value ? '' : opt.value);
            }}
          >
            {opt.label}
          </Button>
        ))}
      </div>

      {/* 底部按钮 */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
        <Button block size="middle" onClick={onReset}>重置</Button>
        <Button block size="middle" color="primary" onClick={onConfirm}>确定</Button>
      </div>
    </div>
  );
};

export default ScoreStarPanel;