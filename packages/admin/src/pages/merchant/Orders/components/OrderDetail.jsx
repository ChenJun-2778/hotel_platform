import React from 'react';
import { Modal, Descriptions, Tag } from 'antd';
import { getOrderStatusInfo } from '../utils/orderStatus';

/**
 * 订单详情组件
 */
const OrderDetail = ({ visible, order, onClose }) => {
  if (!order) return null;

  const statusInfo = getOrderStatusInfo(order.status);

  // 计算天数
  const checkIn = new Date(order.checkIn);
  const checkOut = new Date(order.checkOut);
  const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

  return (
    <Modal
      title={`订单详情 - ${order.orderNo}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={700}
    >
      <Descriptions variant="bordered" column={2}>
        <Descriptions.Item label="订单号" span={2}>
          {order.orderNo}
        </Descriptions.Item>
        <Descriptions.Item label="酒店">
          {order.hotel}
        </Descriptions.Item>
        <Descriptions.Item label="房间号">
          {order.room}
        </Descriptions.Item>
        <Descriptions.Item label="客户姓名">
          {order.customer}
        </Descriptions.Item>
        <Descriptions.Item label="联系电话">
          {order.phone || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="入住日期">
          {order.checkIn}
        </Descriptions.Item>
        <Descriptions.Item label="退房日期">
          {order.checkOut}
        </Descriptions.Item>
        <Descriptions.Item label="入住天数">
          {days}晚
        </Descriptions.Item>
        <Descriptions.Item label="订单金额">
          <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 }}>
            ¥{order.amount}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="订单状态">
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {order.createdAt || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="备注" span={2}>
          {order.remark || '无'}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default OrderDetail;
