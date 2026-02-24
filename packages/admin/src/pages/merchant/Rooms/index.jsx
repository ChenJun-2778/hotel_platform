import { useState, useEffect } from 'react';
import { Select, Modal, Form, message } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import PageContainer from '../../../components/common/PageContainer';
import useRoomList from './hooks/useRoomList';
import RoomStatsPanel from './components/RoomStatsPanel';
import RoomGrid from './components/RoomGrid';
import RoomForm from './components/RoomForm';
import RoomDetail from './components/RoomDetail';
import { uploadImagesToOss, convertUrlsToFileList } from '../../../utils/imageUploadHelper';
import { getRoomDetail } from '../../../services/roomService';
import './Rooms.css';

/**
 * 房间管理主页面
 */
const Rooms = () => {
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [form] = Form.useForm();
  const [roomImageFileList, setRoomImageFileList] = useState([]);

  const { hotels, getRoomsByHotel, calculateStats, addRoom, updateRoom, deleteRoom, loading, loadRoomsByHotel } = useRoomList();

  // 当酒店列表加载完成且还没有选中酒店时，自动选中第一个
  useEffect(() => {
    if (!selectedHotel && hotels.length > 0) {
      setSelectedHotel(hotels[0].value);
    }
  }, [hotels, selectedHotel]);

  // 当选中的酒店变化时，加载该酒店的房间列表
  useEffect(() => {
    if (selectedHotel) {
      loadRoomsByHotel(selectedHotel);
    }
  }, [selectedHotel, loadRoomsByHotel]);

  // 获取当前酒店的房间列表
  const currentRooms = getRoomsByHotel(selectedHotel);
  const stats = calculateStats(currentRooms);

  /**
   * 搜索房间
   */
  const handleSearch = (keyword) => {
    console.log('搜索房间:', keyword);
    // TODO: 实现搜索逻辑
  };

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
    try {
      // 1. 上传房间图片到OSS
      const images = await uploadImagesToOss(roomImageFileList, 'rooms');

      // 2. 构建提交数据
      const submitData = { ...values, images };

      // 3. 提交到后端
      const success = await addRoom(submitData);
      if (success) {
        handleAddCancel();
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败，请重试');
    }
  };

  /**
   * 查看房间详情
   */
  const handleView = async (room) => {
    setDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      console.log(`🔍 请求房间详情: ID=${room.id}`);
      const response = await getRoomDetail(room.id);
      console.log('📦 后端返回的原始数据:', JSON.stringify(response, null, 2));
      
      const roomData = response.data || response;
      console.log('📦 解析后的房间数据:', JSON.stringify(roomData, null, 2));
      
      // 确保 status 是有效的数字
      // 如果后端没有返回 status，使用列表中的 status（从 room 参数获取）
      let status = roomData.status !== undefined ? Number(roomData.status) : Number(room.status);
      console.log(`🔍 状态字段检查: 后端值="${roomData.status}" (${typeof roomData.status}), 列表值="${room.status}" (${typeof room.status}), 最终值=${status} (${typeof status})`);
      
      if (isNaN(status) || status < 1 || status > 4) {
        console.warn(`⚠️ 房间 ${roomData.room_number} 状态值无效，默认设为1（可预订）`);
        status = 1;
      }
      
      // 解析 JSON 字段
      const detailData = {
        ...roomData,
        status: status, // 确保是数字类型
        facilities: roomData.facilities ? JSON.parse(roomData.facilities) : [],
        images: roomData.images ? JSON.parse(roomData.images) : [],
      };
      
      console.log(`✅ 最终房间详情数据:`, {
        ID: room.id,
        房间号: roomData.room_number,
        状态值: status,
        状态类型: typeof status,
        总房间数: roomData.total_rooms,
        所有字段: Object.keys(detailData)
      });
      
      setCurrentRoom(detailData);
    } catch (error) {
      console.error('❌ 获取房间详情失败:', error.message);
      message.error('获取房间详情失败，请重试');
      setIsDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
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
  const handleEdit = async (room) => {
    setIsEditModalOpen(true);
    setCurrentRoom(room);
    
    try {
      // 从后端获取完整的房间数据
      const response = await getRoomDetail(room.id);
      const roomData = response.data || response;
      
      // 解析 JSON 字段
      const facilities = roomData.facilities ? JSON.parse(roomData.facilities) : [];
      const images = roomData.images ? JSON.parse(roomData.images) : [];
      
      console.log(`✅ 编辑房间: ID=${room.id}, 房间号=${roomData.room_number}`);
      
      // 填充表单数据
      form.setFieldsValue({
        hotel_id: roomData.hotel_id,
        room_number: roomData.room_number,
        room_type: roomData.room_type,
        room_type_en: roomData.room_type_en || '',
        bed_type: roomData.bed_type || '大床',
        area: roomData.area,
        floor: roomData.floor,
        max_occupancy: roomData.max_occupancy || 2,
        base_price: roomData.base_price,
        total_rooms: roomData.total_rooms || 1,
        available_rooms: roomData.available_rooms || 1,
        facilities: facilities,
        description: roomData.description || '',
        status: roomData.status,
      });

      // 填充图片列表
      if (images.length > 0) {
        const imageList = convertUrlsToFileList(images);
        setRoomImageFileList(imageList);
      } else {
        setRoomImageFileList([]);
      }
      
      // 更新 currentRoom 为完整数据
      setCurrentRoom({
        ...roomData,
        facilities,
        images,
      });
    } catch (error) {
      console.error('❌ 获取房间数据失败:', error.message);
      message.error('获取房间数据失败，请重试');
      setIsEditModalOpen(false);
      setCurrentRoom(null);
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
    try {
      // 1. 上传房间图片到OSS
      const images = await uploadImagesToOss(roomImageFileList, 'rooms');

      // 2. 构建提交数据（保留原有的 booked_by）
      const submitData = { 
        ...values, 
        images,
        booked_by: currentRoom.booked_by, // 保留原有预定人信息
      };

      // 3. 提交到后端
      const success = await updateRoom(currentRoom.id, submitData);
      if (success) {
        handleEditCancel();
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败，请重试');
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
        await deleteRoom(room.id, selectedHotel);
      },
    });
  };

  return (
    <PageContainer
      title="房间管理"
      titleExtra={
        <Select
          value={selectedHotel}
          onChange={setSelectedHotel}
          style={{ width: 200 }}
          options={hotels}
        />
      }
      showSearch={true}
      searchPlaceholder="搜索房间号、类型"
      onSearch={handleSearch}
      searchLoading={loading}
      showAddButton={true}
      onAdd={showAddModal}
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

      {/* 添加房间弹窗 */}
      <Modal
        title="添加房间"
        open={isAddModalOpen}
        onCancel={handleAddCancel}
        width={700}
        footer={null}
        style={{ top: 20 }}
        styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
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
        styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
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
        loading={detailLoading}
      />
    </PageContainer>
  );
};

export default Rooms;
