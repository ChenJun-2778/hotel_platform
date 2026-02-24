import React from 'react';
import RoomTypeCard from './RoomTypeCard';

/**
 * 房间网格组件 - 按房型分组显示
 */
const RoomGrid = ({ rooms, onView, onEdit, onDelete }) => {
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
      gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
      gap: 24,
      padding: '12px 0',
    }}>
      {rooms.map((roomType) => (
        <RoomTypeCard 
          key={roomType.id} 
          roomType={roomType} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default RoomGrid;
