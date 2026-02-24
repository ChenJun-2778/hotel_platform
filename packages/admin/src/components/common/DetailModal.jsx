import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';

/**
 * 通用详情弹窗组件
 * @param {boolean} visible - 是否显示
 * @param {string} title - 标题
 * @param {object} statusInfo - 状态信息 { color, text }
 * @param {ReactNode} children - Descriptions.Item 内容
 * @param {ReactNode} footer - 自定义底部按钮
 * @param {function} onClose - 关闭回调
 * @param {number} width - 弹窗宽度
 * @param {number} column - 列数
 */
const DetailModal = ({ 
  visible, 
  title, 
  statusInfo,
  children, 
  footer,
  onClose, 
  width = 750,
  column = 2,
  loading = false
}) => {
  return (
    <Modal
      title={
        statusInfo ? (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            paddingRight: 24
          }}>
            <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>
            <Tag color={statusInfo.color} style={{ margin: 0, fontSize: 13 }}>
              {statusInfo.text}
            </Tag>
          </div>
        ) : (
          <span style={{ fontSize: 16, fontWeight: 500 }}>{title}</span>
        )
      }
      open={visible}
      onCancel={onClose}
      width={width}
      footer={footer}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>加载中...</div>
      ) : (
        <Descriptions 
          bordered 
          column={column}
          size="middle"
          styles={{
            label: { 
              width: '120px',
              fontWeight: 500,
              backgroundColor: '#fafafa'
            },
            content: {
              backgroundColor: '#fff'
            }
          }}
        >
          {children}
        </Descriptions>
      )}
    </Modal>
  );
};

export default DetailModal;
