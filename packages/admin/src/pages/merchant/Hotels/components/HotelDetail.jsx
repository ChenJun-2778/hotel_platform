import React from 'react';
import { Descriptions, Tag, Space, Image } from 'antd';
import { HOTEL_STATUS_MAP } from '../../../../constants/hotelStatus';
import StatusTag from '../../../../components/common/StatusTag';

/**
 * 酒店详情组件
 */
const HotelDetail = ({ hotel, loading }) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>;
  }

  if (!hotel) {
    return null;
  }

  return (
    <div>
      <Descriptions title="基本信息" bordered column={2}>
        <Descriptions.Item label="酒店名称">{hotel.name}</Descriptions.Item>
        <Descriptions.Item label="英文名称">{hotel.name_en || '-'}</Descriptions.Item>
        <Descriptions.Item label="品牌">{hotel.brand || '-'}</Descriptions.Item>
        <Descriptions.Item label="星级">
          {hotel.star_level ? `${hotel.star_level}星级` : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="房间数">{hotel.total_rooms || '-'}</Descriptions.Item>
        <Descriptions.Item label="状态">
          <StatusTag status={hotel.status} statusMap={HOTEL_STATUS_MAP} />
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="位置信息" bordered column={2} style={{ marginTop: 24 }}>
        <Descriptions.Item label="国家">{hotel.country || '-'}</Descriptions.Item>
        <Descriptions.Item label="省份">{hotel.province || '-'}</Descriptions.Item>
        <Descriptions.Item label="城市">{hotel.city || '-'}</Descriptions.Item>
        <Descriptions.Item label="区县">{hotel.district || '-'}</Descriptions.Item>
        <Descriptions.Item label="详细地址" span={2}>
          {hotel.address || '-'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="联系方式" bordered column={2} style={{ marginTop: 24 }}>
        <Descriptions.Item label="酒店电话">{hotel.phone || '-'}</Descriptions.Item>
        <Descriptions.Item label="联系人">{hotel.contact_person || '-'}</Descriptions.Item>
        <Descriptions.Item label="联系电话" span={2}>
          {hotel.contact_phone || '-'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="酒店设施" bordered column={1} style={{ marginTop: 24 }}>
        <Descriptions.Item label="设施">
          {hotel.facilities && hotel.facilities.length > 0 ? (
            <Space wrap>
              {hotel.facilities.map((facility, index) => (
                <Tag key={index} color="blue">{facility}</Tag>
              ))}
            </Space>
          ) : '-'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="入住信息" bordered column={2} style={{ marginTop: 24 }}>
        <Descriptions.Item label="入住时间">{hotel.check_in_time || '-'}</Descriptions.Item>
        <Descriptions.Item label="退房时间">{hotel.check_out_time || '-'}</Descriptions.Item>
        <Descriptions.Item label="酒店描述" span={2}>
          {hotel.description || '-'}
        </Descriptions.Item>
      </Descriptions>

      <Descriptions title="酒店图片" bordered column={1} style={{ marginTop: 24 }}>
        <Descriptions.Item label="封面图片">
          {hotel.cover_image ? (
            <Image
              width={200}
              src={hotel.cover_image}
              alt="封面图片"
            />
          ) : '-'}
        </Descriptions.Item>
        <Descriptions.Item label="酒店图片">
          {hotel.images && hotel.images.length > 0 ? (
            <Image.PreviewGroup>
              <Space wrap>
                {hotel.images.map((img, index) => (
                  <Image
                    key={index}
                    width={150}
                    src={img}
                    alt={`酒店图片${index + 1}`}
                  />
                ))}
              </Space>
            </Image.PreviewGroup>
          ) : '-'}
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default HotelDetail;
