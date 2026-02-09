import React from 'react';
import { Card } from 'antd';

/**
 * 表单区块组件
 * @param {string} title - 区块标题
 * @param {ReactNode} children - 子元素
 */
const FormSection = ({ title, children }) => {
  return (
    <Card type="inner" title={title} style={{ marginBottom: 16 }}>
      {children}
    </Card>
  );
};

export default FormSection;
