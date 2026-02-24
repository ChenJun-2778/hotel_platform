import React from 'react';
import { Descriptions, Tag, Image } from 'antd';
import DetailModal from '../../../../components/common/DetailModal';
import { getRoomStatusInfo } from '../../../../constants/roomStatus';

/**
 * 房间详情组件
 */
const RoomDetail = ({ visible, room, onClose, loading }) => {
  if (!room && !loading) return null;

  const statusInfo = room ? getRoomStatusInfo(room.status) : null;

  return (
    <DetailModal
      visible={visible}
      title={`房型详情 - ${room?.room_type || ''}`}
      statusInfo={statusInfo}
      onClose={onClose}
      footer={null}
      width={800}
      column={2}
      loading={loading}
    >
      {room && (
        <>
          <Descriptions.Item label="房型编号">
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
          <Descriptions.Item label="房间号列表" span={2}>
            {room.room_numbers && Array.isArray(room.room_numbers) && room.room_numbers.length > 0 ? (
              <div>
                {room.room_numbers.map((roomNum, index) => (
                  <Tag key={index} color="blue" style={{ marginBottom: 4, marginRight: 4, fontSize: 14 }}>
                    {roomNum}
                  </Tag>
                ))}
              </div>
            ) : (
              '-'
            )}
          </Descriptions.Item>
          <Descriptions.Item label="房间设施" span={2}>
            {room.facilities && Array.isArray(room.facilities) && room.facilities.length > 0 ? (
              <div>
                {room.facilities.map((facility, index) => (
                  <Tag key={index} color="green" style={{ marginBottom: 4, marginRight: 4 }}>
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
        </>
      )}
    </DetailModal>
  );
};

export default RoomDetail;
