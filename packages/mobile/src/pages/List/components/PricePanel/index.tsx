import React from 'react';
import { Button, Slider } from 'antd-mobile';
import styles from './index.module.css';

interface PricePanelProps {
  // [最小值, 最大值]
  priceRange: [number, number]; 
  onChange: (val: [number, number]) => void;
  onReset: () => void;
  onConfirm: () => void;
}

const PricePanel: React.FC<PricePanelProps> = ({
  priceRange,
  onChange,
  onReset,
  onConfirm
}) => {
  // 预设的价格区间快捷选项
  // 巧妙设计：用 1000 (或者9999) 代表 500+（无上限）
  const priceOptions = [
    { label: '¥0-100', value: [0, 100] },
    { label: '¥100-150', value: [100, 150] },
    { label: '¥150-200', value: [150, 200] },
    { label: '¥200-250', value: [200, 250] },
    { label: '¥250-300', value: [250, 300] },
    { label: '¥300-400', value: [300, 400] },
    { label: '¥400-500', value: [400, 500] },
    { label: '¥500+', value: [500, 1000] }, 
  ];

  // 动态计算头部显示的文本
  const displayMax = priceRange[1] >= 500 ? '500以上' : priceRange[1];
  const titleText = `¥${priceRange[0]}-${displayMax}`;

  // 处理滑块拖动
  const handleSliderChange = (val: number | [number, number]) => {
    if (Array.isArray(val)) {
      // 当右侧滑块拉到 500 时，代码层面将其理解为“无上限(1000)”
      const newMax = val[1] === 500 ? 1000 : val[1];
      onChange([val[0], newMax]);
    }
  };

  return (
    <div className={styles.panel}>
      {/* 1. 标题与选中数值展示 */}
      <div className={styles.header}>
        <span className={styles.title}>价格</span>
        <span className={styles.priceText}>{titleText}</span>
      </div>

      {/* 2. 双滑块区域 */}
      <div className={styles.sliderContainer}>
        <div className={styles.sliderLabels}>
          <span>¥0</span>
          <span>¥500以上</span>
        </div>
        <Slider
          range
          min={0}
          max={500}
          step={10} // 每拖动一格是 10 块钱
          // 如果超过500，视觉上滑块依然停留在500的最右侧
          value={[priceRange[0], priceRange[1] >= 500 ? 500 : priceRange[1]]}
          onChange={handleSliderChange}
        />
      </div>

      {/* 3. 快捷选项网格 */}
      <div className={styles.grid}>
        {priceOptions.map((opt, index) => {
          // 判断当前区间是否被选中
          const isActive = priceRange[0] === opt.value[0] && priceRange[1] === opt.value[1];
          return (
            <Button
              key={index}
              className={isActive ? styles.btnActive : styles.btnNormal}
              color={isActive ? 'primary' : 'default'}
              fill={isActive ? 'solid' : 'outline'}
              onClick={() => {
                // 加入反选逻辑
                if (isActive) {
                  // 如果已经激活，再次点击则“失活”，即重置为全局默认区间 [0, 1000]
                  onChange([0, 1000]);
                } else {
                  // 如果未激活，则应用当前按钮的区间
                  onChange(opt.value as [number, number]);
                }
              }}
            >
              {opt.label}
            </Button>
          );
        })}
      </div>

      {/* 4. 底部动作条 */}
      <div className={styles.footer}>
        <Button block size="middle" shape="rounded" onClick={onReset}>重置</Button>
        <Button block size="middle" shape="rounded" color="primary" onClick={onConfirm}>查看</Button>
      </div>
    </div>
  );
};

export default PricePanel;