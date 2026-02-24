import React from 'react';
import { Card, Row, Col, Space, Image, Tag, Divider, Descriptions } from 'antd';
import { EnvironmentOutlined, PhoneOutlined, UserOutlined, ClockCircleOutlined, StarFilled } from '@ant-design/icons';
import { HOTEL_TYPE_TEXT } from '../../../../constants/hotelType';
import dayjs from 'dayjs';

/**
 * 酒店详情组件 - 优化展示样式
 */
const HotelDetail = ({ hotel, loading }) => {
  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px' }}>加载中...</div>;
  }

  if (!hotel) {
    return null;
  }

  // 解析图片列表
  const imageList = typeof hotel.images === 'string' 
    ? JSON.parse(hotel.images || '[]') 
    : hotel.images || [];

  return (
    <div style={{ padding: '8px 0' }}>
      {/* 酒店头部信息 */}
      <Card 
        bordered={false}
        style={{ 
          marginBottom: 16,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff'
        }}
      >
        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
          {hotel.name}
        </div>
        {hotel.english_name && (
          <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 12 }}>
            {hotel.english_name}
          </div>
        )}
        <Space size="large">
          <Space>
            <StarFilled style={{ color: '#ffd700' }} />
            <span>{hotel.star_rating}星级</span>
          </Space>
          {hotel.brand && (
            <Tag color="purple" style={{ margin: 0 }}>{hotel.brand}</Tag>
          )}
          <Tag color="cyan" style={{ margin: 0 }}>
            {HOTEL_TYPE_TEXT[hotel.type !== undefined && hotel.type !== null ? hotel.type : 1]}
          </Tag>
        </Space>
      </Card>

      {/* 位置信息 */}
      <Card 
        title={<><EnvironmentOutlined /> 位置信息</>}
        bordered={false}
        style={{ marginBottom: 16 }}
      >
        <Descriptions column={1}>
          <Descriptions.Item label="所在区域">
            <span style={{ fontSize: 15, color: '#262626' }}>
              {hotel.location || '-'}
            </span>
          </Descriptions.Item>
          <Descriptions.Item label="详细地址">
            <span style={{ fontSize: 15, color: '#262626' }}>
              {hotel.address || '-'}
            </span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 联系方式 */}
      <Card 
        title={<><PhoneOutlined /> 联系方式</>}
        bordered={false}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>酒店电话</div>
            <div style={{ fontSize: 15, color: '#262626', fontWeight: 500 }}>
              {hotel.hotel_phone || '-'}
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>联系人</div>
            <div style={{ fontSize: 15, color: '#262626', fontWeight: 500 }}>
              <UserOutlined style={{ marginRight: 6 }} />
              {hotel.contact || '-'}
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>联系电话</div>
            <div style={{ fontSize: 15, color: '#262626', fontWeight: 500 }}>
              {hotel.contact_phone || '-'}
            </div>
          </Col>
        </Row>
      </Card>

      {/* 酒店设施 */}
      {hotel.hotel_facilities && (
        <Card 
          title="酒店设施"
          bordered={false}
          style={{ marginBottom: 16 }}
        >
          <Space wrap size={[8, 8]}>
            {hotel.hotel_facilities.split(',').filter(Boolean).map((facility, index) => (
              <Tag 
                key={index} 
                color="blue"
                style={{ 
                  padding: '4px 12px',
                  fontSize: 13,
                  borderRadius: 4
                }}
              >
                {facility}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {/* 入住信息 */}
      <Card 
        title={<><ClockCircleOutlined /> 酒店信息</>}
        bordered={false}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>创建时间</div>
            <div style={{ fontSize: 15, color: '#262626', fontWeight: 500 }}>
              {hotel.created_at ? dayjs(hotel.created_at).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>更新时间</div>
            <div style={{ fontSize: 15, color: '#262626', fontWeight: 500 }}>
              {hotel.updated_at ? dayjs(hotel.updated_at).format('YYYY-MM-DD HH:mm:ss') : '-'}
            </div>
          </Col>
        </Row>
        {hotel.description && (
          <>
            <Divider style={{ margin: '16px 0' }} />
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>酒店描述</div>
            <div style={{ 
              fontSize: 14, 
              color: '#595959', 
              lineHeight: 1.8,
              padding: '12px',
              background: '#fafafa',
              borderRadius: 4
            }}>
              {hotel.description}
            </div>
          </>
        )}
      </Card>

      {/* 酒店图片 */}
      <Card 
        title="酒店图片"
        bordered={false}
      >
        {hotel.cover_image && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>封面图片</div>
            <Image
              width="100%"
              height={300}
              src={hotel.cover_image}
              alt="封面图片"
              style={{ 
                objectFit: 'cover',
                borderRadius: 8
              }}
            />
          </div>
        )}
        
        {imageList.length > 0 && (
          <div>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>酒店图片</div>
            <Image.PreviewGroup>
              <Row gutter={[8, 8]}>
                {imageList.map((img, index) => (
                  <Col span={6} key={index}>
                    <Image
                      width="100%"
                      height={120}
                      src={img}
                      alt={`酒店图片${index + 1}`}
                      style={{ 
                        objectFit: 'cover',
                        borderRadius: 8
                      }}
                    />
                  </Col>
                ))}
              </Row>
            </Image.PreviewGroup>
          </div>
        )}
        
        {!hotel.cover_image && imageList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            暂无图片
          </div>
        )}
      </Card>
    </div>
  );
};

export default HotelDetail;
