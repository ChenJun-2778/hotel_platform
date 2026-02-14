import React from 'react';
import { Modal, Descriptions, Tag, Image, Spin } from 'antd';
import { getRoomStatusInfo } from '../../../../constants/roomStatus';

/**
 * 房间详情组件
 */
const RoomDetail = ({ visible, room, onClose, loading }) => {
  if (!room && !loading) return null;

  const statusInfo = room ? getRoomStatusInfo(room.status) : null;

  return (
    <Modal
      title={`房间详情 - ${room?.room_number || room?.roomNumber || ''}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' } }}
    >
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      ) : room ? (
        <Descriptions variant="bordered" column={2}>
          <Descriptions.Item label="房间号">
            {room.room_number}
          </Descriptions.Item>
          <Descriptions.Item label="房型">
            {room.room_type}
          </Descriptions.Item>
          <Descriptions.Item label="英文房型">
            {room.room_type_en || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="床型">
            {room.bed_type}
          </Descriptions.Item>
          <Descriptions.Item label="面积">
            {room.area ? `${room.area}㎡` : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="楼层">
            {room.floor}
          </Descriptions.Item>
          <Descriptions.Item label="最多入住人数">
            {room.max_occupancy}人
          </Descriptions.Item>
          <Descriptions.Item label="基础价格">
            <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 }}>
              ¥{room.base_price}/晚
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="此类型房间总数">
            {room.total_rooms}间
          </Descriptions.Item>
          <Descriptions.Item label="当前可用库存">
            <span style={{ color: '#52c41a', fontWeight: 'bold', fontSize: 16 }}>
              {room.available_rooms}间
            </span>
            <span style={{ color: '#999', marginLeft: 8 }}>
              / {room.total_rooms}间
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="状态">
            <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="预定人">
            {room.booked_by && room.booked_by !== "0" ? room.booked_by : '无'}
          </Descriptions.Item>
          <Descriptions.Item label="房间设施" span={2}>
            {room.facilities && Array.isArray(room.facilities) && room.facilities.length > 0 ? (
              <div>
                {room.facilities.map((facility, index) => (
                  <Tag key={index} color="blue" style={{ marginBottom: 4, marginRight: 4 }}>
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
          {room.images && Array.isArray(room.images) && room.images.length > 0 && (
            <Descriptions.Item label="房间图片" span={2}>
              <Image.PreviewGroup>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {room.images.map((img, index) => (
                    <Image
                      key={index}
                      src={img}
                      alt={`房间图片${index + 1}`}
                      width={120}
                      height={120}
                      style={{ objectFit: 'cover', borderRadius: 8 }}
                    />
                  ))}
                </div>
              </Image.PreviewGroup>
            </Descriptions.Item>
          )}
          <Descriptions.Item label="创建时间" span={2}>
            {room.created_at ? new Date(room.created_at).toLocaleString('zh-CN') : '-'}
          </Descriptions.Item>
        </Descriptions>
      ) : null}
    </Modal>
  );
};

export default RoomDetail;
