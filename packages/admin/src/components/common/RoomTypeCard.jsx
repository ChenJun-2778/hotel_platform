import React from 'react';
import { Card, Tag, Dropdown, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, DollarOutlined, HomeOutlined } from '@ant-design/icons';

/**
 * 通用房型卡片组件
 * 支持两种模式：
 * 1. 管理模式（mode='manage'）：显示操作菜单，房间号为简单字符串
 * 2. 日历模式（mode='calendar'）：显示预订状态，房间号为对象（包含订单信息）
 */
const RoomTypeCard = ({ 
  roomType, 
  mode = 'manage',
  onView, 
  onEdit, 
  onDelete,
  getRoomConfig,
  renderRoomTooltip,
}) => {
  const { 
    room_type_code, 
    room_type, 
    base_price, 
    room_numbers = [],
  } = roomType;

  const isManageMode = mode === 'manage';
  const isCalendarMode = mode === 'calendar';

  // 管理模式：右键菜单
  const menuItems = isManageMode ? [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看详情',
      onClick: () => onView?.(roomType),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑房型',
      onClick: () => onEdit?.(roomType),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: <span style={{ color: '#ff4d4f' }}>删除房型</span>,
      danger: true,
      onClick: () => onDelete?.(roomType),
    },
  ] : [];

  /**
   * 渲染房间号卡片
   */
  const renderRoomNumber = (item, index) => {
    const roomNumber = typeof item === 'string' ? item : item.roomNumber;
    
    let config = {
      color: '#f5576c',
      bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      bottomColor: 'linear-gradient(135deg, #d16ba5 0%, #c94b4b 100%)',
      text: null,
    };
    
    if (isCalendarMode && getRoomConfig) {
      config = getRoomConfig(item);
    }

    const roomCard = (
      <div
        style={{
          position: 'relative',
          padding: '16px 20px',
          background: config.bgColor,
          borderRadius: '12px 12px 0 0',
          color: '#fff',
          fontSize: 18,
          fontWeight: 700,
          minWidth: 80,
          textAlign: 'center',
          boxShadow: `0 4px 12px ${config.color}40`,
          transition: 'all 0.2s ease',
          cursor: 'default',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = `0 6px 16px ${config.color}60`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 4px 12px ${config.color}40`;
        }}
      >
        <div style={{
          position: 'absolute',
          right: '8px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '8px',
          height: '8px',
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '50%',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '-4px',
          left: '0',
          right: '0',
          height: '4px',
          background: config.bottomColor || config.color,
          borderRadius: '0 0 4px 4px',
          opacity: 0.8,
        }} />
        
        <div style={{ marginBottom: config.text ? 4 : 0, fontSize: 20, fontWeight: 700 }}>
          {roomNumber}
        </div>
        {config.text && (
          <div style={{ 
            fontSize: 12, 
            fontWeight: 600,
            opacity: 0.95,
            marginTop: 4,
          }}>
            {config.text}
          </div>
        )}
      </div>
    );

    if (isCalendarMode && renderRoomTooltip) {
      return (
        <Tooltip key={index} title={renderRoomTooltip(item, base_price)}>
          {roomCard}
        </Tooltip>
      );
    }

    return <div key={index}>{roomCard}</div>;
  };

  const cardContent = (
    <Card
      hoverable
      onClick={isManageMode ? () => onView?.(roomType) : undefined}
      style={{
        borderRadius: 16,
        overflow: 'hidden',
        cursor: isManageMode ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        border: '1px solid #f0f0f0',
      }}
      styles={{
        body: { padding: 0 }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* 顶部渐变背景 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px 20px',
        color: '#fff',
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start',
          marginBottom: 12,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ 
              fontSize: 20, 
              fontWeight: 600, 
              marginBottom: 8,
              textShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
              {room_type}
            </div>
            <Tag 
              color="rgba(255,255,255,0.3)" 
              style={{ 
                border: '1px solid rgba(255,255,255,0.5)',
                color: '#fff',
                fontWeight: 500,
              }}
            >
              {room_type_code}
            </Tag>
          </div>
          
          <div style={{ 
            textAlign: 'right',
            fontSize: 24,
            fontWeight: 700,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            <div style={{ fontSize: 14, fontWeight: 400, opacity: 0.9 }}>
              <DollarOutlined style={{ marginRight: 4 }} />
              起价
            </div>
            ¥{base_price}
            <span style={{ fontSize: 14, fontWeight: 400 }}>/晚</span>
          </div>
        </div>
      </div>

      {/* 房间号列表 */}
      <div style={{ padding: '20px' }}>
        <div>
          <div style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
            color: '#262626',
            fontSize: 15,
            fontWeight: 600,
          }}>
            <HomeOutlined style={{ fontSize: 16 }} />
            <span>{isCalendarMode ? '房间预订状态' : '房间号'}</span>
            <Tag color="blue" style={{ margin: 0, fontSize: 13 }}>
              {room_numbers.length}间
            </Tag>
          </div>
          
          {room_numbers.length > 0 ? (
            <div style={{ 
              display: 'flex',
              flexWrap: 'wrap',
              gap: 12,
            }}>
              {room_numbers.map((item, index) => renderRoomNumber(item, index))}
            </div>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              padding: '20px', 
              color: '#999',
              background: '#fafafa',
              borderRadius: 8,
              fontSize: 14,
            }}>
              暂无房间号
            </div>
          )}
        </div>
      </div>

      {isManageMode && (
        <div style={{
          padding: '10px 20px',
          background: '#fafafa',
          borderTop: '1px solid #f0f0f0',
          fontSize: 12,
          color: '#8c8c8c',
          textAlign: 'center',
        }}>
          左键查看 · 右键操作
        </div>
      )}
    </Card>
  );

  // 管理模式：包裹 Dropdown
  if (isManageMode) {
    return (
      <Dropdown menu={{ items: menuItems }} trigger={['contextMenu']}>
        {cardContent}
      </Dropdown>
    );
  }

  return cardContent;
};

export default RoomTypeCard;
