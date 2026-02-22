import React from 'react';
import { Tooltip, Tag, Dropdown } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRoomStatusInfo } from '../../../../constants/roomStatus';

/**
 * 房间门卡片组件
 */
const RoomDoorCard = ({ room, onView, onEdit, onDelete, onAdjustStock }) => {
  const config = getRoomStatusInfo(room.status);

  // 右键菜单项
  const menuItems = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看详情',
      onClick: () => onView && onView(room),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑房间',
      onClick: () => onEdit && onEdit(room),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: '删除房间',
      danger: true,
      onClick: () => onDelete && onDelete(room),
    },
  ];

  // 左键点击查看详情
  const handleClick = (e) => {
    e.preventDefault();
    onView && onView(room);
  };

  // 右键显示菜单
  const handleContextMenu = (e) => {
    e.preventDefault();
  };
  
  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['contextMenu']}
    >
      <Tooltip
        title={
          <div>
            <div><strong>房间号：</strong>{room.roomNumber}</div>
            <div><strong>房型：</strong>{room.type}</div>
            <div><strong>价格：</strong>¥{room.price}/晚</div>
            <div><strong>状态：</strong>{config.text}</div>
            {room.booked_by && room.booked_by !== "0" && (
              <div><strong>预定人ID：</strong>{room.booked_by}</div>
            )}
            <div style={{ marginTop: 8, fontSize: 11, color: '#bbb' }}>
              左键查看 | 右键操作
            </div>
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
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '16px 12px',
          }}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
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
          
          {/* 价格 */}
          <div style={{ 
            fontSize: 18, 
            color: config.color, 
            fontWeight: 600,
            marginBottom: 10,
            fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          }}>
            ¥{room.price}
          </div>
          
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
    </Dropdown>
  );
};

export default RoomDoorCard;
