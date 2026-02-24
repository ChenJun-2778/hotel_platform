import React, { useState, useEffect } from 'react';
import { Descriptions, Button, Select, Space, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import DetailModal from '../../../../components/common/DetailModal';
import { getOrderStatusInfo, ORDER_STATUS } from '../utils/orderStatus';
import { useRoomStore } from '../../../../stores/roomStore';

/**
 * 订单详情组件
 */
const OrderDetail = ({ visible, order, onClose, onConfirm, availableRooms = [], loadingRooms = false }) => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [confirming, setConfirming] = useState(false);
  const getAssignedRoom = useRoomStore(state => state.getAssignedRoom);

  // 获取前端分配的房间号或后端返回的房间号
  const frontendAssignedRoom = order ? getAssignedRoom(order.orderNo) : null;
  const displayRoom = frontendAssignedRoom || (order ? order.assignedRoom : null);
  
  // 当订单变化时，重置选择的房间
  useEffect(() => {
    if (visible && order) {
      // 如果已经有分配的房间，设置为默认值
      if (displayRoom) {
        setSelectedRoom(displayRoom);
      } else {
        setSelectedRoom(null);
      }
    }
  }, [visible, order, displayRoom]);

  if (!order) return null;

  const statusInfo = getOrderStatusInfo(order.status);
  const isPendingConfirm = order.status === ORDER_STATUS.PENDING_CONFIRM; // 待确定状态

  // 天数从后端返回
  const days = order.nights || 0;

  /**
   * 确认订单并分配房间
   */
  const handleConfirm = async () => {
    if (!selectedRoom) {
      message.error('请选择要分配的房间号');
      return;
    }

    try {
      setConfirming(true);
      
      console.log('🔍 确认订单 - 订单号:', order.orderNo, '房间号:', selectedRoom);
      
      if (onConfirm) {
        await onConfirm(order.orderNo, selectedRoom);
      }
      
      // 成功后重置选择的房间
      setSelectedRoom(null);
    } catch (error) {
      console.error('❌ 确认订单失败:', error);
      // 错误消息已在父组件处理
    } finally {
      setConfirming(false);
    }
  };

  /**
   * 关闭弹窗时重置状态
   */
  const handleClose = () => {
    setSelectedRoom(null);
    onClose();
  };

  // 自定义底部按钮
  const footer = (
    <div style={{ textAlign: 'right' }}>
      {isPendingConfirm ? (
        <Space>
          <Button onClick={handleClose}>取消</Button>
          <Button 
            type="primary" 
            icon={<CheckCircleOutlined />}
            onClick={handleConfirm}
            loading={confirming}
            disabled={!selectedRoom}
          >
            确认订单
          </Button>
        </Space>
      ) : (
        <Button type="primary" onClick={handleClose}>
          关闭
        </Button>
      )}
    </div>
  );

  return (
    <DetailModal
      visible={visible}
      title="订单详情"
      statusInfo={statusInfo}
      onClose={handleClose}
      footer={footer}
      width={750}
      column={2}
    >
      <Descriptions.Item label="订单编号" span={2}>
        <span style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 500 }}>
          {order.orderNo}
        </span>
      </Descriptions.Item>
      
      <Descriptions.Item label="酒店名称" span={2}>
        {order.hotelName}
      </Descriptions.Item>
      
      <Descriptions.Item label="房型">
        {order.roomType}
      </Descriptions.Item>
      
      {/* 待确定状态：显示房间选择器 */}
      {isPendingConfirm ? (
        <Descriptions.Item label="分配房间号" span={2}>
          <div>
            <Select
              value={selectedRoom}
              onChange={setSelectedRoom}
              placeholder={loadingRooms ? "加载房间列表中..." : "请选择房间号"}
              style={{ width: '100%', marginBottom: 8 }}
              loading={loadingRooms}
              disabled={loadingRooms}
              options={availableRooms.map(room => ({
                value: room.roomNumber,
                label: `${room.roomNumber} - ${room.type}`,
              }))}
              notFoundContent={loadingRooms ? "加载中..." : "暂无可用房间"}
            />
            <div style={{ 
              fontSize: 12, 
              color: '#8c8c8c',
              padding: '6px 10px',
              background: '#f0f5ff',
              borderRadius: 4,
              border: '1px solid #d6e4ff'
            }}>
              💡 确认订单后将自动分配选中的房间号
              {displayRoom && (
                <div style={{ marginTop: 4, color: '#1890ff' }}>
                  当前已选: {displayRoom}
                </div>
              )}
            </div>
          </div>
        </Descriptions.Item>
      ) : (
        /* 已确认状态：显示已分配的房间号 */
        <Descriptions.Item label="房间号">
          <span style={{ 
            fontSize: 16, 
            fontWeight: 600, 
            color: '#1890ff',
            fontFamily: 'monospace'
          }}>
            {displayRoom || '-'}
          </span>
          {frontendAssignedRoom && (
            <span style={{ 
              fontSize: 12, 
              color: '#52c41a',
              marginLeft: 8
            }}>
              (前端已分配)
            </span>
          )}
        </Descriptions.Item>
      )}
      
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
        <span style={{ fontWeight: 500 }}>{days} 晚</span>
      </Descriptions.Item>
      <Descriptions.Item label="订单金额">
        <span style={{ 
          color: '#ff4d4f', 
          fontWeight: 600, 
          fontSize: 18,
          fontFamily: 'monospace'
        }}>
          ¥{order.amount}
        </span>
      </Descriptions.Item>
      
      <Descriptions.Item label="创建时间" span={order.confirmedAt ? 1 : 2}>
        {order.createdAt || '-'}
      </Descriptions.Item>
      
      {order.confirmedAt && (
        <Descriptions.Item label="确认时间">
          {order.confirmedAt}
        </Descriptions.Item>
      )}
      
      {order.remark && (
        <Descriptions.Item label="备注" span={2}>
          <div style={{ 
            padding: '8px 12px',
            background: '#fafafa',
            borderRadius: 4,
            color: '#595959'
          }}>
            {order.remark}
          </div>
        </Descriptions.Item>
      )}
    </DetailModal>
  );
};

export default OrderDetail;
