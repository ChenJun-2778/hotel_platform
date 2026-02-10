import { useState } from 'react';
import { Modal, Form, message, Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import SearchBar from '../../../components/common/SearchBar';
import HotelTable from './components/HotelTable';
import HotelForm from './components/HotelForm';
import HotelDetail from './components/HotelDetail';
import useHotelList from './hooks/useHotelList';
import { getHotelDetail } from '../../../services/hotelService';
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
  const { hotelList, loading, addHotel, updateHotelData, toggleHotelStatus } = useHotelList();

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
      // 1. 检查封面图片
      if (coverFileList.length === 0) {
        message.error('请上传封面图片');
        return;
      }

      // 2. 上传封面图片到OSS
      let coverImage = '';
      const coverFile = coverFileList[0];
      
      if (coverFile.originFileObj) {
        // 新上传的文件，需要上传到OSS
        message.loading({ content: '正在上传封面图片...', key: 'uploadCover' });
        const { uploadToOss } = await import('../../../utils/oss');
        coverImage = await uploadToOss(coverFile.originFileObj, 'hotels');
        message.success({ content: '封面图片上传成功', key: 'uploadCover' });
      } else if (coverFile.url) {
        // 已有的图片URL（编辑时）
        coverImage = coverFile.url;
      }

      if (!coverImage) {
        message.error('封面图片上传失败');
        return;
      }

      // 3. 上传酒店图片到OSS
      const images = [];
      if (imageFileList.length > 0) {
        message.loading({ content: '正在上传酒店图片...', key: 'uploadImages' });
        
        for (let i = 0; i < imageFileList.length; i++) {
          const file = imageFileList[i];
          if (file.originFileObj) {
            // 新上传的文件
            const { uploadToOss } = await import('../../../utils/oss');
            const url = await uploadToOss(file.originFileObj, 'hotels');
            images.push(url);
          } else if (file.url) {
            // 已有的图片URL
            images.push(file.url);
          }
        }
        
        message.success({ content: '酒店图片上传成功', key: 'uploadImages' });
      }

      // 4. 处理省市区数据
      const [province = '', city = '', district = ''] = values.area || [];
      const location = values.area ? values.area.join('') : '';

      // 5. 构建提交数据
      const submitData = {
        name: values.name,
        english_name: values.english_name,
        brand: values.brand,
        star_rating: Number(values.star_rating) || 3,
        room_number: Number(values.room_number) || 0,
        location: location,
        country: '中国',
        province,
        city,
        district,
        address: values.address,
        hotel_phone: values.hotel_phone,
        contact: values.contact,
        contact_phone: values.contact_phone,
        hotel_facilities: values.hotel_facilities?.join(',') || '',
        check_in_time: values.check_in_time?.format('YYYY-MM-DD HH:mm:ss'),
        check_out_time: values.check_out_time?.format('YYYY-MM-DD HH:mm:ss'),
        description: values.description,
        cover_image: coverImage,
        images: JSON.stringify(images),
        ...(!isEditMode && { status: HOTEL_STATUS.PENDING }),
      };

      // 6. 提交到后端
      let success;
      if (isEditMode && editingHotelId) {
        success = await updateHotelData(editingHotelId, submitData);
      } else {
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

  // 搜索酒店（暂未实现）
  const handleSearch = (keyword) => {
    console.log('搜索关键词:', keyword);
    message.info(`搜索功能开发中，关键词：${keyword}`);
    // TODO: 实现搜索逻辑
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
      
      // 构建省市区数组
      const area = [hotelData.province, hotelData.city, hotelData.district].filter(Boolean);
      console.log('省市区数组:', area);
      
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
        room_number: hotelData.room_number,
        area: area.length > 0 ? area : undefined,
        address: hotelData.address,
        hotel_phone: hotelData.hotel_phone,
        contact: hotelData.contact,
        contact_phone: hotelData.contact_phone,
        hotel_facilities: facilities,
        check_in_time: hotelData.check_in_time ? dayjs(hotelData.check_in_time) : null,
        check_out_time: hotelData.check_out_time ? dayjs(hotelData.check_out_time) : null,
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
