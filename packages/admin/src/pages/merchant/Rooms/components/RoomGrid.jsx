import React from 'react';
import RoomDoorCard from './RoomDoorCard';

/**
 * 房间网格组件
 */
const RoomGrid = ({ rooms, onView, onEdit, onDelete, onAdjustStock }) => {
  if (!rooms || rooms.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px 0', 
        color: '#999' 
      }}>
        暂无房间数据
      </div>
    );
  }
  
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
      gap: 24,
      padding: '12px 0',
    }}>
      {rooms.map((room) => (
        <RoomDoorCard 
          key={room.id || room.roomNumber} 
          room={room} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          onAdjustStock={onAdjustStock}
        />
      ))}
    </div>
  );
};

export default RoomGrid;
