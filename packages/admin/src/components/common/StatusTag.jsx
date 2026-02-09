import React from 'react';
import { Tag } from 'antd';

/**
 * 状态标签组件
 * @param {number} status - 状态值
 * @param {object} statusMap - 状态映射配置
 */
const StatusTag = ({ status, statusMap }) => {
  const statusInfo = statusMap[status] || { color: 'default', text: '未知' };
  return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
};

export default StatusTag;
