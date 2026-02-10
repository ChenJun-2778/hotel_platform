import React from 'react';
import { Space, Button, Popconfirm } from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined, StopOutlined } from '@ant-design/icons';
import StatusTag from '../../../../components/common/StatusTag';
import StarRating from '../../../../components/common/StarRating';
import { HOTEL_STATUS, HOTEL_STATUS_MAP } from '../../../../constants/hotelStatus';

/**
 * 获取酒店表格列配置
 * @param {function} onView - 查看回调
 * @param {function} onEdit - 编辑回调
 * @param {function} onToggleStatus - 切换状态回调
 */
export const getHotelTableColumns = (onView, onEdit, onToggleStatus) => [
  {
    title: '酒店名称',
    dataIndex: 'name',
    key: 'name',
    width: 200,
    ellipsis: true,
    render: (text) => (
      <div style={{ fontWeight: 500, color: '#262626' }}>{text}</div>
    ),
  },
  {
    title: '星级',
    dataIndex: 'star_rating',
    key: 'star_rating',
    width: 100,
    align: 'center',
    render: (level) => <StarRating level={level} />,
  },
  {
    title: '位置',
    dataIndex: 'location',
    key: 'location',
    width: 120,
    render: (text) => (
      <div style={{ color: '#595959' }}>{text || '-'}</div>
    ),
  },
  {
    title: '地址',
    dataIndex: 'address',
    key: 'address',
    width: 250,
    ellipsis: true,
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
    width: 200,
    align: 'center',
    render: (_, record) => {
      const isOnline = record.status === HOTEL_STATUS.ONLINE;
      const isOffline = record.status === HOTEL_STATUS.OFFLINE;
      const canToggle = isOnline || isOffline;

      return (
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
          {canToggle && (
            <Popconfirm
              title={isOnline ? '确定要下架该酒店吗？' : '确定要上架该酒店吗？'}
              onConfirm={() => onToggleStatus(record)}
              okText="确定"
              cancelText="取消"
            >
              <Button 
                type="link" 
                size="small"
                icon={isOnline ? <StopOutlined /> : <CheckCircleOutlined />}
                danger={isOnline}
              >
                {isOnline ? '下架' : '上架'}
              </Button>
            </Popconfirm>
          )}
        </Space>
      );
    },
  },
];
