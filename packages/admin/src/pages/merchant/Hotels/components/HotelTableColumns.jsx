import { Space, Button, Modal, Dropdown, Tag } from 'antd';
import { EyeOutlined, EditOutlined, CheckCircleOutlined, StopOutlined, ExclamationCircleOutlined, MoreOutlined } from '@ant-design/icons';
import StatusTag from '../../../../components/common/StatusTag';
import StarRating from '../../../../components/common/StarRating';
import { HOTEL_STATUS, HOTEL_STATUS_MAP } from '../../../../constants/hotelStatus';
import { HOTEL_TYPE_TEXT } from '../../../../constants/hotelType';

/**
 * 查看拒绝原因（直接从列表数据获取）
 */
const viewRejectReason = (hotel) => {
  // 后端返回字段为 rejection_reason
  const rejectReason = hotel.rejection_reason || hotel.reject_reason || '';
  
  console.log('🔍 查看拒绝原因 - 酒店数据:', hotel);
  console.log('🔍 拒绝原因内容:', rejectReason);
  
  Modal.info({
    title: (
      <div style={{ fontSize: 16, fontWeight: 600, color: '#262626' }}>
        审核拒绝原因
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
          {rejectReason || '暂无拒绝原因'}
        </div>
        <div style={{ 
          marginTop: 16, 
          padding: 12, 
          background: '#e6f7ff',
          border: '1px solid #91d5ff',
          borderRadius: 6,
          fontSize: 13,
          color: '#0050b3'
        }}>
          <ExclamationCircleOutlined style={{ marginRight: 6 }} />
          请根据拒绝原因修改酒店信息后重新提交审核
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
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 80,
    align: 'center',
    render: (type) => {
      // 如果后端没有返回type字段，默认显示"国内"
      const actualType = type !== undefined && type !== null ? type : 1;
      const typeText = HOTEL_TYPE_TEXT[actualType];
      const colorMap = {
        1: 'blue',    // 国内
        2: 'green',   // 海外
        3: 'orange',  // 民宿
      };
      return (
        <Tag color={colorMap[actualType]} style={{ margin: 0 }}>
          {typeText}
        </Tag>
      );
    },
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
    title: '房间数',
    dataIndex: 'room_number',
    key: 'room_number',
    width: 100,
    align: 'center',
    render: (count) => (
      <div style={{ fontWeight: 500, color: '#1890ff' }}>{count || 0}</div>
    ),
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 150,
    align: 'center',
    render: (status, record) => {
      const isRejected = status === HOTEL_STATUS.REJECTED;
      
      return (
        <Space direction="vertical" size={4} style={{ width: '100%' }}>
          <StatusTag status={status} statusMap={HOTEL_STATUS_MAP} />
          {isRejected && (
            <Button 
              type="link" 
              size="small"
              onClick={() => {
                console.log('🔍 点击查看原因 - 完整记录:', record);
                console.log('🔍 rejection_reason:', record.rejection_reason);
                console.log('🔍 reject_reason:', record.reject_reason);
                viewRejectReason(record);
              }}
              style={{ padding: 0, height: 'auto', fontSize: 12 }}
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
    width: 150,
    align: 'center',
    render: (_, record) => {
      const isOnline = record.status === HOTEL_STATUS.ONLINE;
      const isOffline = record.status === HOTEL_STATUS.OFFLINE;
      const isRejected = record.status === HOTEL_STATUS.REJECTED;
      // 营业中、已下线、已拒绝状态都可以切换发布/下线
      const canToggle = isOnline || isOffline || isRejected;

      // 构建下拉菜单项
      const menuItems = [
        {
          key: 'view',
          icon: <EyeOutlined />,
          label: '查看详情',
          onClick: () => onView(record),
        },
        {
          key: 'edit',
          icon: <EditOutlined />,
          label: '编辑酒店',
          onClick: () => onEdit(record),
        },
      ];

      // 添加发布/下线操作
      if (canToggle) {
        menuItems.push({
          key: 'toggle',
          icon: isOnline ? <StopOutlined /> : <CheckCircleOutlined />,
          label: isOnline ? (
            <span style={{ color: '#ff4d4f' }}>下线酒店</span>
          ) : (
            <span style={{ color: '#52c41a' }}>发布酒店</span>
          ),
          onClick: () => {
            Modal.confirm({
              title: isOnline ? '确定要下线该酒店吗？' : '确定要发布该酒店吗？',
              icon: <ExclamationCircleOutlined />,
              content: isOnline 
                ? '下线后该酒店将不再对外展示' 
                : isRejected
                  ? '发布后该酒店将重新提交审核'
                  : '发布后该酒店将对外展示',
              okText: '确定',
              cancelText: '取消',
              onOk: () => onToggleStatus(record),
            });
          },
        });
      }

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
          <Dropdown
            menu={{ items: menuItems.slice(1) }}
            placement="bottomRight"
            trigger={['click']}
          >
            <Button 
              type="link"
              size="small"
              icon={<MoreOutlined />}
              style={{ padding: '4px 8px' }}
            />
          </Dropdown>
        </Space>
      );
    },
  },
];
