import React from 'react';
import { Space, Button } from 'antd';
import { EyeOutlined, EditOutlined } from '@ant-design/icons';
import StatusTag from '../../../../components/common/StatusTag';
import StarRating from '../../../../components/common/StarRating';
import { HOTEL_STATUS_MAP } from '../../../../constants/hotelStatus';

/**
 * 获取酒店表格列配置
 * @param {function} onView - 查看回调
 * @param {function} onEdit - 编辑回调
 */
export const getHotelTableColumns = (onView, onEdit) => [
  {
    title: '酒店名称',
    dataIndex: 'name',
    key: 'name',
    width: 220,
    ellipsis: true,
    render: (text, record) => (
      <Space>
        <div style={{ 
          width: 40, 
          height: 40, 
          borderRadius: 8,
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          <img 
            src={record.cover_image} 
            alt={text}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
        <div>
          <div style={{ fontWeight: 500, color: '#262626' }}>{text}</div>
          {record.name_en && (
            <div style={{ fontSize: 12, color: '#8c8c8c' }}>{record.name_en}</div>
          )}
        </div>
      </Space>
    ),
  },
  {
    title: '星级',
    dataIndex: 'star_level',
    key: 'star_level',
    width: 120,
    align: 'center',
    render: (level) => <StarRating level={level} />,
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: 280,
    ellipsis: true,
    render: (text, record) => {
      const fullAddress = `${record.city || ''}${record.district || ''}${text || ''}`;
      return (
        <div style={{ color: '#595959' }}>
          {fullAddress || '-'}
        </div>
      );
    },
  },
  {
    title: '房间数',
    dataIndex: 'total_rooms',
    key: 'total_rooms',
    width: 100,
    align: 'center',
    render: (num) => (
      <div style={{ 
        display: 'inline-block',
        padding: '4px 12px',
        background: '#f0f5ff',
        color: '#1890ff',
        borderRadius: 4,
        fontWeight: 500,
      }}>
        {num || 0}
      </div>
    ),
  },
  {
    title: '联系电话',
    dataIndex: 'phone',
    key: 'phone',
    width: 150,
    render: (text) => (
      <div style={{ color: '#595959' }}>{text || '-'}</div>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    align: 'center',
    render: (status) => <StatusTag status={status} statusMap={HOTEL_STATUS_MAP} />,
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    align: 'center',
    fixed: 'right',
    render: (_, record) => (
      <Space size="small">
        <Button 
          type="link" 
          size="small" 
          icon={<EyeOutlined />} 
          onClick={() => onView(record)}
        >
          查看
        </Button>
        <Button 
          type="link" 
          size="small" 
          icon={<EditOutlined />} 
          onClick={() => onEdit(record)}
        >
          编辑
        </Button>
      </Space>
    ),
  },
];
