import React from 'react';
import { Card, Tag, Dropdown } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined, DollarOutlined, HomeOutlined } from '@ant-design/icons';

/**
 * 房型卡片组件
 * 左键点击查看详情，右键显示操作菜单
 */
const RoomTypeCard = ({ roomType, onView, onEdit, onDelete }) => {
  const { 
    room_type_code, 
    room_type, 
    base_price, 
    room_numbers = [],
    bed_type,
    area,
    max_occupancy,
  } = roomType;

  // 右键菜单
  const menuItems = [
    {
      key: 'view',
      icon: <EyeOutlined />,
      label: '查看详情',
      onClick: () => onView(roomType),
    },
    {
      key: 'edit',
      icon: <EditOutlined />,
      label: '编辑房型',
      onClick: () => onEdit(roomType),
    },
    {
      type: 'divider',
    },
    {
      key: 'delete',
      icon: <DeleteOutlined />,
      label: <span style={{ color: '#ff4d4f' }}>删除房型</span>,
      danger: true,
      onClick: () => onDelete(roomType),
    },
  ];

  return (
    <Dropdown
      menu={{ items: menuItems }}
      trigger={['contextMenu']}
    >
      <Card
        hoverable
        onClick={() => onView(roomType)}
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          cursor: 'pointer',
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

        {/* 房型信息 */}
        <div style={{ padding: '20px' }}>
          {/* 房间号列表 */}
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
              <span>房间号</span>
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
                {room_numbers.map((roomNumber, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      padding: '16px 20px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      borderRadius: '12px 12px 0 0',
                      color: '#fff',
                      fontSize: 18,
                      fontWeight: 700,
                      minWidth: 80,
                      textAlign: 'center',
                      boxShadow: '0 4px 12px rgba(245, 87, 108, 0.3)',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 87, 108, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 87, 108, 0.3)';
                    }}
                  >
                    {/* 门把手 */}
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
                    
                    {/* 门框底部 */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '0',
                      right: '0',
                      height: '4px',
                      background: 'linear-gradient(135deg, #d16ba5 0%, #c94b4b 100%)',
                      borderRadius: '0 0 4px 4px',
                    }} />
                    
                    {roomNumber}
                  </div>
                ))}
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

        {/* 底部提示 - 简化 */}
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
      </Card>
    </Dropdown>
  );
};

export default RoomTypeCard;
