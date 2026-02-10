import React from 'react';
import { Modal, Descriptions, Tag, Image } from 'antd';
import { getRoomStatusInfo } from '../../../../constants/roomStatus';

/**
 * 房间详情组件
 */
const RoomDetail = ({ visible, room, onClose }) => {
  if (!room) return null;

  const statusInfo = getRoomStatusInfo(room.status);

  return (
    <Modal
      title={`房间详情 - ${room.room_number || room.roomNumber}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Descriptions variant="bordered" column={2}>
        <Descriptions.Item label="房间号">
          {room.room_number || room.roomNumber}
        </Descriptions.Item>
        <Descriptions.Item label="房型">
          {room.room_type || room.type}
        </Descriptions.Item>
        <Descriptions.Item label="英文房型">
          {room.room_type_en || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="床型">
          {room.bed_type || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="面积">
          {room.area ? `${room.area}㎡` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="楼层">
          {room.floor || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="最多入住人数">
          {room.max_occupancy || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="基础价格">
          <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 }}>
            ¥{room.base_price || room.price}/晚
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="此类型房间总数">
          {room.total_rooms || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="可用房间数">
          {room.available_rooms || '-'}
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        </Descriptions.Item>
        {room.guest && (
          <Descriptions.Item label="当前客人">
            {room.guest}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="房间设施" span={2}>
          {room.facilities && room.facilities.length > 0 ? (
            <div>
              {room.facilities.map((facility, index) => (
                <Tag key={index} color="blue" style={{ marginBottom: 4 }}>
                  {facility}
                </Tag>
              ))}
            </div>
          ) : (
            '-'
          )}
        </Descriptions.Item>
        <Descriptions.Item label="房间描述" span={2}>
          {room.description || '-'}
        </Descriptions.Item>
        {room.images && room.images.length > 0 && (
          <Descriptions.Item label="房间图片" span={2}>
            <Image.PreviewGroup>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {room.images.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={`房间图片${index + 1}`}
                    width={100}
                    height={100}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                  />
                ))}
              </div>
            </Image.PreviewGroup>
          </Descriptions.Item>
        )}
      </Descriptions>
    </Modal>
  );
};

export default RoomDetail;
