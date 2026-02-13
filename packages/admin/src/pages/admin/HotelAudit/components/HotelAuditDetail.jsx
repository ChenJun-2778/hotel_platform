import React from 'react';
import { Modal, Descriptions, Tag, Image, Space, Button, Row, Col, Card, Divider } from 'antd';
import { CheckOutlined, CloseOutlined, EnvironmentOutlined, PhoneOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import StarRating from '../../../../components/common/StarRating';

/**
 * 酒店审核详情组件
 * 复用商户端的字段显示
 */
const HotelAuditDetail = ({ visible, hotel, onClose, onApprove, onReject }) => {
  if (!hotel) return null;

  const statusMap = {
    pending: { color: 'orange', text: '待审核' },
    approved: { color: 'green', text: '已通过' },
    rejected: { color: 'red', text: '已拒绝' },
  };
  const statusInfo = statusMap[hotel.status] || { color: 'default', text: '未知' };

  // 解析图片列表
  const imageList = Array.isArray(hotel.images) ? hotel.images : [];

  /**
   * 处理审核通过
   */
  const handleApprove = () => {
    onApprove && onApprove(hotel.key);
    onClose && onClose();
  };

  /**
   * 处理审核拒绝
   */
  const handleReject = () => {
    onReject && onReject(hotel.key);
    onClose && onClose();
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>酒店审核详情 - {hotel.name}</span>
          <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={
        hotel.status === 'pending' ? (
          <Space>
            <Button onClick={onClose}>取消</Button>
            <Button danger icon={<CloseOutlined />} onClick={handleReject}>
              拒绝
            </Button>
            <Button type="primary" icon={<CheckOutlined />} onClick={handleApprove}>
              通过
            </Button>
          </Space>
        ) : (
          <Button onClick={onClose}>关闭</Button>
        )
      }
      styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' } }}
    >
      {/* 基本信息卡片 */}
      <Card 
        size="small"
        title={<><UserOutlined /> 基本信息</>}
        style={{ marginBottom: 16 }}
      >
        <Descriptions column={2} size="small">
          <Descriptions.Item label="酒店名称" span={2}>
            <span style={{ fontSize: 15, fontWeight: 500 }}>{hotel.name}</span>
          </Descriptions.Item>
          <Descriptions.Item label="商户名称">
            {hotel.merchant}
          </Descriptions.Item>
          <Descriptions.Item label="联系电话">
            <PhoneOutlined style={{ marginRight: 6 }} />
            {hotel.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="星级">
            <StarRating value={hotel.star} />
          </Descriptions.Item>
          <Descriptions.Item label="房间数">
            {hotel.roomCount}间
          </Descriptions.Item>
          <Descriptions.Item label="提交时间" span={2}>
            {hotel.submitTime}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 位置信息卡片 */}
      <Card 
        size="small"
        title={<><EnvironmentOutlined /> 位置信息</>}
        style={{ marginBottom: 16 }}
      >
        <Descriptions column={1} size="small">
          <Descriptions.Item label="详细地址">
            <span style={{ fontSize: 14 }}>{hotel.address}</span>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 入住信息卡片 */}
      <Card 
        size="small"
        title={<><ClockCircleOutlined /> 入住信息</>}
        style={{ marginBottom: 16 }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>入住时间</div>
            <div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
              {hotel.check_in_time || '-'}
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>退房时间</div>
            <div style={{ fontSize: 14, color: '#262626', fontWeight: 500 }}>
              {hotel.check_out_time || '-'}
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

      {/* 酒店设施 */}
      {hotel.facilities && hotel.facilities.length > 0 && (
        <Card 
          size="small"
          title="酒店设施"
          style={{ marginBottom: 16 }}
        >
          <Space wrap size={[8, 8]}>
            {hotel.facilities.map((facility, index) => (
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

      {/* 酒店政策 */}
      {hotel.policies && (
        <Card 
          size="small"
          title="酒店政策"
          style={{ marginBottom: 16 }}
        >
          <div style={{ fontSize: 14, color: '#595959', lineHeight: 1.8 }}>
            {hotel.policies}
          </div>
        </Card>
      )}

      {/* 酒店图片 */}
      {imageList.length > 0 && (
        <Card 
          size="small"
          title="酒店图片"
        >
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
        </Card>
      )}
    </Modal>
  );
};

export default HotelAuditDetail;
