import React, { useState } from 'react';
import { Card, Select, Space, Button, Modal, Form } from 'antd';
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import useRoomList from './hooks/useRoomList';
import RoomStatsPanel from './components/RoomStatsPanel';
import RoomGrid from './components/RoomGrid';
import RoomForm from './components/RoomForm';
import RoomDetail from './components/RoomDetail';
import './Rooms.css';

/**
 * 房间管理主页面
 */
const Rooms = () => {
  const [selectedHotel, setSelectedHotel] = useState('hotel1');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [form] = Form.useForm();
  const [roomImageFileList, setRoomImageFileList] = useState([]);

  const { hotels, getRoomsByHotel, calculateStats, addRoom, updateRoom, deleteRoom } = useRoomList();

  // 获取当前酒店的房间列表
  const currentRooms = getRoomsByHotel(selectedHotel);
  const stats = calculateStats(currentRooms);

  /**
   * 打开添加房间弹窗
   */
  const showAddModal = () => {
    setIsAddModalOpen(true);
    form.setFieldsValue({
      hotel_id: selectedHotel,
      bed_type: '大床',
      max_occupancy: 2,
      status: 'available',
    });
  };

  /**
   * 关闭添加弹窗并重置表单
   */
  const handleAddCancel = () => {
    setIsAddModalOpen(false);
    form.resetFields();
    setRoomImageFileList([]);
  };

  /**
   * 提交添加房间表单
   */
  const handleAddSubmit = async (values) => {
    const images = roomImageFileList.map(file => file.response?.url).filter(Boolean);
    const submitData = { ...values, images };

    const success = await addRoom(submitData);
    if (success) {
      handleAddCancel();
    }
  };

  /**
   * 查看房间详情
   */
  const handleView = (room) => {
    setCurrentRoom(room);
    setIsDetailModalOpen(true);
  };

  /**
   * 关闭详情弹窗
   */
  const handleDetailClose = () => {
    setIsDetailModalOpen(false);
    setCurrentRoom(null);
  };

  /**
   * 编辑房间
   */
  const handleEdit = (room) => {
    setCurrentRoom(room);
    setIsEditModalOpen(true);
    
    // 填充表单数据
    form.setFieldsValue({
      hotel_id: selectedHotel,
      room_number: room.roomNumber,
      room_type: room.type,
      room_type_en: room.type_en || '',
      bed_type: room.bed_type || '大床',
      area: room.area,
      floor: room.floor,
      max_occupancy: room.max_occupancy || 2,
      base_price: room.price,
      total_rooms: room.total_rooms || 1,
      available_rooms: room.available_rooms || 1,
      facilities: room.facilities || [],
      description: room.description || '',
      status: room.status,
    });

    // 填充图片列表
    if (room.images && room.images.length > 0) {
      const imageList = room.images.map((url, index) => ({
        uid: `-${index}`,
        name: `image-${index}.jpg`,
        status: 'done',
        url: url,
        response: { url: url },
      }));
      setRoomImageFileList(imageList);
    }
  };

  /**
   * 关闭编辑弹窗
   */
  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setCurrentRoom(null);
    form.resetFields();
    setRoomImageFileList([]);
  };

  /**
   * 提交编辑房间表单
   */
  const handleEditSubmit = async (values) => {
    const images = roomImageFileList.map(file => file.response?.url).filter(Boolean);
    const submitData = { ...values, images };

    const success = await updateRoom(currentRoom.roomNumber, submitData);
    if (success) {
      handleEditCancel();
    }
  };

  /**
   * 删除房间
   */
  const handleDelete = (room) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除房间 ${room.roomNumber} 吗？此操作不可恢复。`,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await deleteRoom(room.roomNumber);
      },
    });
  };

  return (
    <div className="rooms-page">
      <Card
        title={
          <Space>
            <span>房间管理</span>
            <Select
              value={selectedHotel}
              onChange={setSelectedHotel}
              style={{ width: 200 }}
              options={hotels}
            />
          </Space>
        }
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            添加房间
          </Button>
        }
      >
        {/* 统计面板 */}
        <RoomStatsPanel stats={stats} />

        {/* 房间网格 */}
        <RoomGrid 
          rooms={currentRooms} 
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* 添加房间弹窗 */}
      <Modal
        title="添加房间"
        open={isAddModalOpen}
        onCancel={handleAddCancel}
        width={700}
        footer={null}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <RoomForm
          form={form}
          hotels={hotels}
          roomImageFileList={roomImageFileList}
          setRoomImageFileList={setRoomImageFileList}
          onFinish={handleAddSubmit}
          onCancel={handleAddCancel}
        />
      </Modal>

      {/* 编辑房间弹窗 */}
      <Modal
        title="编辑房间"
        open={isEditModalOpen}
        onCancel={handleEditCancel}
        width={700}
        footer={null}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <RoomForm
          form={form}
          hotels={hotels}
          roomImageFileList={roomImageFileList}
          setRoomImageFileList={setRoomImageFileList}
          onFinish={handleEditSubmit}
          onCancel={handleEditCancel}
          isEdit={true}
        />
      </Modal>

      {/* 查看房间详情弹窗 */}
      <RoomDetail
        visible={isDetailModalOpen}
        room={currentRoom}
        onClose={handleDetailClose}
      />
    </div>
  );
};

export default Rooms;
