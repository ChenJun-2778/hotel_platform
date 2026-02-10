import React from 'react';
import { Table } from 'antd';
import { getHotelTableColumns } from './HotelTableColumns';

/**
 * 酒店表格组件
 */
const HotelTable = ({ 
  dataSource, 
  loading, 
  onView, 
  onEdit,
  onToggleStatus,
}) => {
  const columns = getHotelTableColumns(onView, onEdit, onToggleStatus);

  return (
    <Table 
      columns={columns} 
      dataSource={dataSource}
      loading={loading}
      rowKey="id"
      scroll={{ x: 'max-content' }}
      pagination={{
        pageSize: 10,
        showTotal: (total) => `共 ${total} 条`,
        showSizeChanger: true,
        showQuickJumper: true,
      }}
      locale={{
        emptyText: '暂无酒店数据，点击上方"添加酒店"按钮创建第一个酒店',
      }}
      rowClassName={() => 'hotel-table-row'}
    />
  );
};

export default HotelTable;
