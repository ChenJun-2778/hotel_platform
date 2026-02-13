import React from 'react';
import { Tooltip, Tag } from 'antd';
import { getRoomStatusInfo } from '../../../../constants/roomStatus';

/**
 * 房间预订卡片组件（日历视图专用）
 * 复用房间管理的卡片样式，但只显示预订信息，不提供操作功能
 */
const RoomBookingCard = ({ room }) => {
  const config = getRoomStatusInfo(room.status);

  return (
    <Tooltip
      title={
        <div>
          <div><strong>房间号：</strong>{room.roomNumber}</div>
          <div><strong>房型：</strong>{room.type}</div>
          <div><strong>价格：</strong>¥{room.price}/晚</div>
          <div><strong>状态：</strong>{config.text}</div>
          {room.order && (
            <>
              <div style={{ marginTop: 8, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: 8 }}>
                <div><strong>入住人：</strong>{room.order.customer}</div>
                <div><strong>联系电话：</strong>{room.order.phone || '-'}</div>
                <div><strong>入住日期：</strong>{room.order.checkIn}</div>
                <div><strong>退房日期：</strong>{room.order.checkOut}</div>
                <div><strong>订单号：</strong>{room.order.orderNo}</div>
                <div><strong>订单金额：</strong>¥{room.order.amount}</div>
              </div>
            </>
          )}
        </div>
      }
    >
      <div
        style={{
          width: 140,
          height: 180,
          backgroundColor: config.bgColor,
          border: `2px solid ${config.borderColor}`,
          borderRadius: 16,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'default',
          transition: 'all 0.3s ease',
          position: 'relative',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          padding: '16px 12px',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        }}
      >
        {/* 门把手 */}
        <div
          style={{
            position: 'absolute',
            right: 16,
            top: '42%',
            width: 12,
            height: 12,
            backgroundColor: config.color,
            borderRadius: '50%',
            boxShadow: `0 0 10px ${config.color}`,
          }}
        />
        
        {/* 房间号 */}
        <div style={{ 
          fontSize: 42, 
          fontWeight: 700, 
          color: config.color, 
          marginBottom: 12,
          fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          letterSpacing: '2px',
          lineHeight: 1,
        }}>
          {room.roomNumber}
        </div>
        
        {/* 房型 */}
        <div style={{ 
          fontSize: 14, 
          color: '#555', 
          marginBottom: 8,
          textAlign: 'center',
          padding: '0 8px',
          fontWeight: 500,
          lineHeight: 1.4,
          maxWidth: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {room.type}
        </div>
        
        {/* 入住人信息（如果有订单） */}
        {room.order ? (
          <div style={{ 
            fontSize: 13, 
            color: '#666', 
            marginBottom: 10,
            textAlign: 'center',
            fontWeight: 500,
          }}>
            {room.order.customer}
          </div>
        ) : (
          <div style={{ 
            fontSize: 18, 
            color: config.color, 
            fontWeight: 600,
            marginBottom: 10,
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            ¥{room.price}
          </div>
        )}
        
        {/* 状态标签 */}
        <Tag 
          color={config.color} 
          style={{ 
            fontSize: 12,
            fontWeight: 500,
            padding: '3px 12px',
            borderRadius: 14,
            border: 'none',
          }}
        >
          {config.text}
        </Tag>
      </div>
    </Tooltip>
  );
};

export default RoomBookingCard;
