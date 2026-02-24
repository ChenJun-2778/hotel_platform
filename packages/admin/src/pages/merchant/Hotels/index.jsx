import { useState } from 'react';
import { Modal, Form, message, Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import SearchBar from '../../../components/common/SearchBar';
import HotelTable from './components/HotelTable';
import HotelForm from './components/HotelForm';
import HotelDetail from './components/HotelDetail';
import useHotelList from './hooks/useHotelList';
import { getHotelDetail } from '../../../services/hotelService';
import { getRoomList } from '../../../services/roomService';
import { uploadToOss } from '../../../utils/oss';
import { HOTEL_STATUS } from '../../../constants/hotelStatus';
import './Hotels.css';

const Hotels = () => {
  // 状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // 表单和文件
  const [form] = Form.useForm();
  const [coverFileList, setCoverFileList] = useState([]);
  const [imageFileList, setImageFileList] = useState([]);
  
  // 使用自定义 Hook
  const { 
    hotelList, 
    loading, 
    pagination,
    searchHotels,
    handlePageChange,
    addHotel, 
    updateHotelData, 
    toggleHotelStatus 
  } = useHotelList();

  // 打开添加弹窗
  const showModal = () => {
    setIsEditMode(false);
    setEditingHotelId(null);
    setIsModalOpen(true);
  };

  // 关闭表单弹窗
  const handleCancel = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setEditingHotelId(null);
    form.resetFields();
    setCoverFileList([]);
    setImageFileList([]);
  };

  // 提交表单
  const handleSubmit = async (values) => {
    setSubmitting(true);
    
    try {
      // 1. 先验证表单字段（Form 组件已经自动验证了必填项）
      // 这里只需要额外验证图片
      if (coverFileList.length === 0) {
        message.error('请上传封面图片');
        setSubmitting(false);
        return;
      }

      // 2. 上传封面图片到OSS
      let coverImage = '';
      const coverFile = coverFileList[0];
      
      if (coverFile.originFileObj) {
        // 新上传的文件，需要上传到OSS
        console.log('📤 上传新封面图片');
        message.loading({ content: '正在上传封面图片...', key: 'uploadCover' });
        coverImage = await uploadToOss(coverFile.originFileObj, 'hotels');
        message.success({ content: '封面图片上传成功', key: 'uploadCover' });
      } else if (coverFile.url) {
        // 已有的图片URL（编辑时），直接使用，不重新上传
        console.log('✅ 复用已有封面图片:', coverFile.url);
        coverImage = coverFile.url;
      }

      if (!coverImage) {
        message.error('封面图片上传失败');
        setSubmitting(false);
        return;
      }

      // 3. 上传酒店图片到OSS
      const images = [];
      if (imageFileList.length > 0) {
        // 统计需要上传的新文件数量
        const newFilesCount = imageFileList.filter(file => file.originFileObj).length;
        const existingFilesCount = imageFileList.filter(file => file.url && !file.originFileObj).length;
        
        console.log(`📤 酒店图片统计: 新文件=${newFilesCount}, 已有文件=${existingFilesCount}`);
        
        if (newFilesCount > 0) {
          message.loading({ content: `正在上传 ${newFilesCount} 张新图片...`, key: 'uploadImages' });
        }
        
        for (let i = 0; i < imageFileList.length; i++) {
          const file = imageFileList[i];
          if (file.originFileObj) {
            // 新上传的文件
            console.log(`📤 上传新文件: ${file.name}`);
            const url = await uploadToOss(file.originFileObj, 'hotels');
            images.push(url);
          } else if (file.url) {
            // 已有的图片URL，直接使用，不重新上传
            console.log(`✅ 复用已有图片: ${file.url}`);
            images.push(file.url);
          }
        }
        
        if (newFilesCount > 0) {
          message.success({ content: `${newFilesCount} 张新图片上传成功`, key: 'uploadImages' });
        }
        
        console.log(`✅ 酒店图片处理完成: 共 ${images.length} 张图片`);
      }

      // 4. 处理省市区数据
      const location = values.area ? values.area.join('') : '';
      
      console.log('📍 省市区数据:', values.area);
      console.log('📍 location:', location);

      // 5. 获取实际房间数（编辑模式下从房间列表实时计算所有房间的 total_rooms 总和）
      let actualRoomCount = 0;
      if (isEditMode && editingHotelId) {
        try {
          const roomResponse = await getRoomList({ hotel_id: editingHotelId });
          const roomList = roomResponse.data?.rooms || roomResponse.rooms || [];
          // 计算所有房间的 total_rooms 总和
          actualRoomCount = roomList.reduce((sum, room) => sum + (Number(room.total_rooms) || 0), 0);
          console.log(`✅ 提交时实时计算房间数: ${roomList.length}条记录, 总房间数=${actualRoomCount}`);
        } catch {
          console.log('⚠️ 获取房间数失败，使用1');
          actualRoomCount = 1;
        }
      }

      // 6. 构建提交数据（只提交后端需要的字段）
      const submitData = {
        name: values.name || '',
        english_name: values.english_name || '',
        brand: values.brand || '',
        star_rating: Number(values.star_rating) || 3,
        room_number: isEditMode ? (actualRoomCount || 1) : 1,
        location: location || '',
        address: values.address || '',
        hotel_phone: values.hotel_phone || '',
        contact: values.contact || '',
        contact_phone: values.contact_phone || '',
        hotel_facilities: (values.hotel_facilities && Array.isArray(values.hotel_facilities)) 
          ? values.hotel_facilities.join(',') 
          : '',
        description: values.description || '',
        cover_image: coverImage || '',
        images: images.length > 0 ? JSON.stringify(images) : '[]',
      };
      
      // 严格检查并清理所有 undefined、null 值
      Object.keys(submitData).forEach(key => {
        if (submitData[key] === undefined || submitData[key] === null) {
          console.warn(`⚠️ 字段 ${key} 的值为 ${submitData[key]}，已设置为空字符串`);
          submitData[key] = '';
        }
      });
      
      console.log('📝 提交数据:', JSON.stringify(submitData, null, 2));
      console.log('📝 数据类型检查:', Object.keys(submitData).map(key => 
        `${key}: ${typeof submitData[key]} = ${submitData[key]}`
      ).join('\n'));

      // 7. 提交到后端
      let success;
      if (isEditMode && editingHotelId) {
        console.log('更新酒店 - ID:', editingHotelId);
        console.log('更新酒店 - 数据:', submitData);
        success = await updateHotelData(editingHotelId, submitData);
      } else {
        console.log('创建酒店 - 数据:', submitData);
        success = await addHotel(submitData);
      }

      if (success) {
        setIsModalOpen(false);
        setIsEditMode(false);
        setEditingHotelId(null);
        form.resetFields();
        setCoverFileList([]);
        setImageFileList([]);
      }
    } catch (error) {
      console.error('提交失败:', error);
      message.error('操作失败，请重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 查看详情
  const handleViewDetail = async (record) => {
    setDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      const response = await getHotelDetail(record.id);
      const hotelData = response.data || response;
      
      // 获取该酒店的实际房间数（计算所有房间的 total_rooms 总和）
      try {
        const roomResponse = await getRoomList({ hotel_id: record.id });
        const roomList = roomResponse.data?.rooms || roomResponse.rooms || [];
        // 计算所有房间的 total_rooms 总和
        const totalRoomCount = roomList.reduce((sum, room) => sum + (Number(room.total_rooms) || 0), 0);
        hotelData.room_number = totalRoomCount;
        console.log(`✅ 酒店详情 - 实时计算房间数: ${roomList.length}条记录, 总房间数=${totalRoomCount}`);
      } catch (error) {
        console.log('⚠️ 获取房间数失败，显示为0:', error.message);
        hotelData.room_number = 0;
      }
      
      setCurrentHotel(hotelData);
    } catch (error) {
      console.error('获取酒店详情失败:', error);
      message.error('获取酒店详情失败，请重试');
      setIsDetailModalOpen(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // 关闭详情弹窗
  const handleDetailModalClose = () => {
    setIsDetailModalOpen(false);
    setCurrentHotel(null);
  };

  // 切换酒店状态（上架/下架）
  const handleToggleStatus = async (record) => {
    await toggleHotelStatus(record.id, record.status);
  };

  // 搜索酒店
  const handleSearch = (keyword) => {
    console.log('🔍 搜索关键词:', keyword);
    searchHotels(keyword);
  };

  // 编辑酒店
  const handleEdit = async (record) => {
    setIsEditMode(true);
    setEditingHotelId(record.id);
    setIsModalOpen(true);
    
    try {
      // 从后端获取完整的酒店数据
      const response = await getHotelDetail(record.id);
      const hotelData = response.data || response;
      
      console.log('编辑酒店 - 完整数据:', hotelData);
      
      // 获取该酒店的房间列表，计算实际房间数（所有房间的 total_rooms 总和）
      let actualRoomCount = 0;
      try {
        const roomResponse = await getRoomList({ hotel_id: record.id });
        const roomList = roomResponse.data?.rooms || roomResponse.rooms || [];
        // 计算所有房间的 total_rooms 总和
        actualRoomCount = roomList.reduce((sum, room) => sum + (Number(room.total_rooms) || 0), 0);
        console.log(`✅ 编辑时实时计算房间数: ${roomList.length}条记录, 总房间数=${actualRoomCount}`);
      } catch {
        console.log('⚠️ 获取房间数失败，使用数据库中的值:', hotelData.room_number);
        actualRoomCount = hotelData.room_number || 0;
      }
      
      // 解析 location 字段（格式可能是：浙江省杭州市西湖区 或 上海）
      let area = undefined;
      if (hotelData.location) {
        const locationStr = hotelData.location;
        // 尝试解析省市区
        const provinceMatch = locationStr.match(/^(.+?省)/);
        const cityMatch = locationStr.match(/省?(.+?市)/);
        const districtMatch = locationStr.match(/市(.+?区|县)/);
        
        const parts = [];
        if (provinceMatch) parts.push(provinceMatch[1]);
        if (cityMatch) parts.push(cityMatch[1]);
        if (districtMatch) parts.push(districtMatch[1]);
        
        // 如果没有匹配到省市区格式，可能是直辖市（如：上海、北京）
        if (parts.length === 0 && locationStr) {
          // 检查是否是直辖市
          const municipalities = ['北京', '上海', '天津', '重庆'];
          const isMunicipality = municipalities.some(m => locationStr.includes(m));
          if (isMunicipality) {
            const city = municipalities.find(m => locationStr.includes(m));
            parts.push(city + '市', city + '市');
          }
        }
        
        area = parts.length > 0 ? parts : undefined;
      }
      console.log('解析的省市区数组:', area);
      
      // 解析设施
      const facilities = hotelData.hotel_facilities 
        ? (typeof hotelData.hotel_facilities === 'string' 
            ? hotelData.hotel_facilities.split(',').filter(Boolean)
            : hotelData.hotel_facilities)
        : [];
      console.log('设施列表:', facilities);
      
      // 填充表单数据
      const formData = {
        name: hotelData.name,
        english_name: hotelData.english_name,
        brand: hotelData.brand,
        star_rating: hotelData.star_rating,
        room_number: actualRoomCount, // 使用实际房间数
        area: area,
        location: hotelData.location, // 保留原始 location 用于显示
        address: hotelData.address,
        hotel_phone: hotelData.hotel_phone,
        contact: hotelData.contact,
        contact_phone: hotelData.contact_phone,
        hotel_facilities: facilities,
        description: hotelData.description,
      };
      
      console.log('表单数据:', formData);
      form.setFieldsValue(formData);
      
      // 设置封面图片
      if (hotelData.cover_image) {
        const coverFile = {
          uid: '-1',
          name: 'cover.jpg',
          status: 'done',
          url: hotelData.cover_image,
        };
        console.log('封面图片:', coverFile);
        setCoverFileList([coverFile]);
      } else {
        setCoverFileList([]);
      }
      
      // 设置酒店图片
      const imageList = typeof hotelData.images === 'string' 
        ? JSON.parse(hotelData.images || '[]') 
        : hotelData.images || [];
      
      console.log('图片列表:', imageList);
      
      if (imageList.length > 0) {
        const imageFiles = imageList.map((url, index) => ({
          uid: `-${index + 2}`,
          name: `image${index + 1}.jpg`,
          status: 'done',
          url: url,
        }));
        console.log('图片文件列表:', imageFiles);
        setImageFileList(imageFiles);
      } else {
        setImageFileList([]);
      }
    } catch (error) {
      console.error('获取酒店数据失败:', error);
      message.error('获取酒店数据失败，请重试');
      setIsModalOpen(false);
      setIsEditMode(false);
      setEditingHotelId(null);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
      <Card 
        title={<div style={{ fontSize: 18, fontWeight: 600 }}>我的酒店</div>}
        extra={
          <SearchBar
            placeholder="搜索酒店名称、地址"
            onSearch={handleSearch}
            loading={loading}
          />
        }
        style={{
          borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
        }}
      >
        <HotelTable
          dataSource={hotelList}
          loading={loading}
          pagination={pagination}
          onPageChange={handlePageChange}
          onView={handleViewDetail}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      </Card>

      {/* 悬浮添加按钮 */}
      <Button
        type="primary"
        shape="circle"
        icon={<PlusOutlined style={{ fontSize: 24 }} />}
        size="large"
        onClick={showModal}
        style={{
          position: 'fixed',
          right: 48,
          bottom: 48,
          width: 64,
          height: 64,
          fontSize: 24,
          boxShadow: '0 4px 12px rgba(24, 144, 255, 0.4)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      />
      

      {/* 添加/编辑酒店 Modal */}
      <Modal
        title={isEditMode ? '编辑酒店' : '添加酒店'}
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={null}
        style={{ top: 20 }}
        styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' } }}
      >
        <HotelForm
          form={form}
          mode={isEditMode ? 'edit' : 'add'}
          onFinish={handleSubmit}
          onCancel={handleCancel}
          submitting={submitting}
          coverFileList={coverFileList}
          setCoverFileList={setCoverFileList}
          imageFileList={imageFileList}
          setImageFileList={setImageFileList}
        />
      </Modal>

      {/* 查看酒店详情 Modal */}
      <Modal
        title="酒店详情"
        open={isDetailModalOpen}
        onCancel={handleDetailModalClose}
        width={900}
        footer={null}
        style={{ top: 20 }}
        styles={{ body: { maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' } }}
      >
        <HotelDetail hotel={currentHotel} loading={detailLoading} />
      </Modal>
    </div>
  );
};

export default Hotels;
