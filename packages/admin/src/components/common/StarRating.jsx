import React from 'react';
import { Space } from 'antd';

/**
 * 星级评分组件
 * @param {number} value - 星级（1-5）
 * @param {number} level - 星级（1-5）- 兼容旧参数名
 * @param {number} total - 总星数，默认5
 */
const StarRating = ({ value, level, total = 5 }) => {
  const rating = value || level;
  
  if (!rating) return '-';
  
  return (
    <Space size={2}>
      {[...Array(total)].map((_, index) => (
        <span 
          key={index} 
          style={{ 
            color: index < rating ? '#faad14' : '#d9d9d9', 
            fontSize: 16 
          }}
        >
          ★
        </span>
      ))}
    </Space>
  );
};

export default StarRating;
