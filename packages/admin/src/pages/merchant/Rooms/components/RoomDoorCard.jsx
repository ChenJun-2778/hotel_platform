import React from 'react';
import { Tooltip, Tag, Dropdown } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { getRoomStatusInfo } from '../../../../constants/roomStatus';

/**
 * 房间门卡片组件
 */
const RoomDoorCard = ({ room, onView, onEdit, onDelete }) => {
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
            {room.guest && <div><strong>客人：</strong>{room.guest}</div>}
            <div style={{ marginTop: 8, fontSize: 11, color: '#bbb' }}>
              左键查看 | 右键操作
            </div>
          </div>
        }
      >
        <div
          style={{
            width: 100,
            height: 140,
            backgroundColor: config.bgColor,
            border: `3px solid ${config.borderColor}`,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s',
            position: 'relative',
          }}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* 门把手 */}
          <div
            style={{
              position: 'absolute',
              right: 15,
              top: '50%',
              width: 8,
              height: 8,
              backgroundColor: config.color,
              borderRadius: '50%',
            }}
          />
          
          {/* 房间号 */}
          <div style={{ fontSize: 24, fontWeight: 'bold', color: config.color, marginBottom: 8 }}>
            {room.roomNumber}
          </div>
          
          {/* 房型 */}
          <div style={{ fontSize: 12, color: '#666', marginBottom: 4 }}>
            {room.type}
          </div>
          
          {/* 价格 */}
          <div style={{ fontSize: 14, color: config.color, fontWeight: 'bold' }}>
            ¥{room.price}
          </div>
          
          {/* 状态标签 */}
          <Tag color={config.color} style={{ marginTop: 8, fontSize: 10 }}>
            {config.text}
          </Tag>
        </div>
      </Tooltip>
    </Dropdown>
  );
};

export default RoomDoorCard;
