import React from 'react';
import { Modal, Button } from 'antd';

/**
 * 拒绝原因查看弹窗 - 可复用组件
 * @param {boolean} visible - 是否显示
 * @param {string} title - 标题（如：酒店名称）
 * @param {string} reason - 拒绝原因
 * @param {function} onClose - 关闭回调
 */
const RejectReasonModal = ({ visible, title, reason, onClose }) => {
  return (
    <Modal
      title={
        <div style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
          拒绝原因
        </div>
      }
      open={visible}
      onCancel={onClose}
      centered
      width={540}
      footer={
        <Button 
          type="primary" 
          size="large" 
          onClick={onClose}
          style={{ minWidth: 100 }}
        >
          知道了
        </Button>
      }
    >
      <div style={{ marginTop: 20 }}>
        {title && (
          <div style={{ 
            marginBottom: 16, 
            paddingBottom: 12,
            borderBottom: '1px solid #f0f0f0'
          }}>
            <div style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 4 }}>
              酒店名称
            </div>
            <div style={{ color: '#262626', fontSize: 15, fontWeight: 500 }}>
              {title}
            </div>
          </div>
        )}
        <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>
          拒绝原因
        </div>
        <div style={{ 
          padding: 16, 
          background: '#fff1f0', 
          border: '1px solid #ffccc7',
          borderRadius: 6,
          color: '#595959',
          lineHeight: 1.8,
          fontSize: 14,
          minHeight: 80,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {reason || '暂无拒绝原因'}
        </div>
      </div>
    </Modal>
  );
};

export default RejectReasonModal;
