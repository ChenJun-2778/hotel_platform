import React from 'react';
import { Space } from 'antd';

/**
 * 星级评分组件
 * @param {number} level - 星级（1-5）
 * @param {number} total - 总星数，默认5
 */
const StarRating = ({ level, total = 5 }) => {
  if (!level) return '-';
  
  return (
    <Space size={2}>
      {[...Array(total)].map((_, index) => (
        <span 
          key={index} 
          style={{ 
            color: index < level ? '#faad14' : '#d9d9d9', 
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
