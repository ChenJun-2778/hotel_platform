import React from 'react';
import { Table, Tag, Space, Button, Modal, Input, message } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import StarRating from '../../../../components/common/StarRating';

const { TextArea } = Input;

/**
 * 酒店审核表格组件
 */
const HotelAuditTable = ({ hotels, loading, onViewDetail, onApprove, onReject }) => {
  /**
   * 确认通过
   */
  const confirmApprove = (hotel) => {
    Modal.confirm({
      title: (
        <div style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
          确认通过审核
        </div>
      ),
      icon: <ExclamationCircleOutlined style={{ color: '#52c41a' }} />,
      content: (
        <div style={{ marginTop: 12, fontSize: 14, color: '#595959' }}>
          确定要通过 <span style={{ fontWeight: 500, color: '#262626' }}>"{hotel.name}"</span> 的审核吗？
          <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 13 }}>
            通过后该酒店将可以正常使用
          </div>
        </div>
      ),
      okText: '确认通过',
      cancelText: '取消',
      width: 460,
      centered: true,
      okButtonProps: {
        size: 'large',
        style: { minWidth: 100 }
      },
      cancelButtonProps: {
        size: 'large',
        style: { minWidth: 100 }
      },
      onOk: () => onApprove && onApprove(hotel.key),
    });
  };

  /**
   * 确认拒绝 - 带拒绝原因输入框
   */
  const confirmReject = (hotel) => {
    let rejectReason = '';
    
    Modal.confirm({
      title: (
        <div style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
          拒绝审核
        </div>
      ),
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div style={{ marginTop: 20, marginBottom: 8 }}>
          <div style={{ 
            marginBottom: 12, 
            color: '#595959',
            fontSize: 14,
            lineHeight: 1.6
          }}>
            <div style={{ marginBottom: 8 }}>
              酒店名称：<span style={{ fontWeight: 500 }}>{hotel.name}</span>
            </div>
            <div style={{ color: '#ff4d4f', fontSize: 13 }}>
              请详细说明拒绝原因，以便商户了解并改进
            </div>
          </div>
          <TextArea
            rows={5}
            placeholder="例如：酒店资质不全、图片不清晰、信息填写不完整等"
            onChange={(e) => { rejectReason = e.target.value; }}
            maxLength={200}
            showCount
            style={{
              fontSize: 14,
              resize: 'none'
            }}
          />
        </div>
      ),
      okText: '确认拒绝',
      okType: 'danger',
      cancelText: '取消',
      width: 560,
      centered: true,
      okButtonProps: {
        size: 'large',
        style: { minWidth: 100 }
      },
      cancelButtonProps: {
        size: 'large',
        style: { minWidth: 100 }
      },
      onOk: () => {
        if (!rejectReason || rejectReason.trim() === '') {
          message.error('请输入拒绝原因');
          return Promise.reject();
        }
        return onReject && onReject(hotel.key, rejectReason.trim());
      },
    });
  };

  /**
   * 查看拒绝原因
   */
  const viewRejectReason = (hotel) => {
    Modal.info({
      title: (
        <div style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
          拒绝原因
        </div>
      ),
      content: (
        <div style={{ marginTop: 20 }}>
          <div style={{ 
            marginBottom: 16, 
            paddingBottom: 12,
            borderBottom: '1px solid #f0f0f0'
          }}>
            <div style={{ color: '#8c8c8c', fontSize: 13, marginBottom: 4 }}>
              酒店名称
            </div>
            <div style={{ color: '#262626', fontSize: 15, fontWeight: 500 }}>
              {hotel.name}
            </div>
          </div>
          <div style={{ marginBottom: 8, color: '#8c8c8c', fontSize: 13 }}>
            拒绝原因
          </div>
          <div style={{ 
            padding: 16, 
            background: '#fff1f0', 
            border: '1px solid #ffccc7',
            borderRadius: 6,
            color: '#595959',
            lineHeight: 1.8,
            fontSize: 14,
            minHeight: 80,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}>
            {hotel.reject_reason || '暂无拒绝原因'}
          </div>
        </div>
      ),
      okText: '知道了',
      width: 540,
      centered: true,
      okButtonProps: {
        size: 'large',
        style: { minWidth: 100 }
      },
    });
  };

  const columns = [
    {
      title: '酒店名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      fixed: 'left',
    },
    {
      title: '商户',
      dataIndex: 'merchant',
      key: 'merchant',
      width: 120,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      width: 300,
    },
    {
      title: '星级',
      dataIndex: 'star_rating',
      key: 'star_rating',
      width: 120,
      align: 'center',
      render: (star) => <StarRating value={star || 3} />,
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      width: 180,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status, record) => {
        const statusMap = {
          pending: { color: 'orange', text: '待审核' },
          approved: { color: 'green', text: '已通过' },
          rejected: { color: 'red', text: '已拒绝' },
        };
        const info = statusMap[status] || { color: 'default', text: '未知' };
        
        return (
          <Space>
            <Tag color={info.color}>{info.text}</Tag>
            {status === 'rejected' && record.reject_reason && (
              <Button 
                type="link" 
                size="small"
                onClick={() => viewRejectReason(record)}
                style={{ padding: 0, height: 'auto' }}
              >
                查看原因
              </Button>
            )}
          </Space>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="link" 
            icon={<EyeOutlined />}
            onClick={() => onViewDetail && onViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button 
                type="link" 
                icon={<CheckOutlined />} 
                style={{ color: '#52c41a' }}
                onClick={() => confirmApprove(record)}
              >
                通过
              </Button>
              <Button 
                type="link" 
                danger 
                icon={<CloseOutlined />}
                onClick={() => confirmReject(record)}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={hotels}
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      scroll={{ x: 1400 }}
    />
  );
};

export default HotelAuditTable;
