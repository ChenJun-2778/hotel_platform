import React from 'react';
import RoomDoorCard from './RoomDoorCard';

/**
 * 房间网格组件
 */
const RoomGrid = ({ rooms, onView, onEdit, onDelete }) => {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', 
      gap: 16 
    }}>
      {rooms.map((room) => (
        <RoomDoorCard 
          key={room.roomNumber} 
          room={room} 
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default RoomGrid;
