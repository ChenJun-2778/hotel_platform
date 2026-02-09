import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import HotelTable from './components/HotelTable';
import HotelForm from './components/HotelForm';
import HotelDetail from './components/HotelDetail';
import useHotelList from './hooks/useHotelList';
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
  const { hotelList, loading, addHotel, updateHotelData } = useHotelList();

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
    const coverImage = coverFileList[0]?.response?.url || coverFileList[0]?.url || '';
    const images = imageFileList.map(file => file.response?.url || file.url).filter(Boolean);

    const submitData = {
      ...values,
      cover_image: coverImage,
      images: images,
      check_in_time: values.check_in_time?.format('HH:mm'),
      check_out_time: values.check_out_time?.format('HH:mm'),
    };

    setSubmitting(true);
    try {
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
    } finally {
      setSubmitting(false);
    }
  };

  // 查看详情
  const handleViewDetail = async (record) => {
    setDetailLoading(true);
    setIsDetailModalOpen(true);
    try {
      // TODO: 后续连接真实后端接口
      // const response = await getHotelDetail(record.id);
      // setCurrentHotel(response.data || response);
      
      setCurrentHotel(record);
    } catch (error) {
      console.error('获取酒店详情失败:', error);
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

  // 编辑酒店
  const handleEdit = (record) => {
    setIsEditMode(true);
    setEditingHotelId(record.id);
    setIsModalOpen(true);
    
    // 填充表单数据
    form.setFieldsValue({
      name: record.name,
      name_en: record.name_en,
      brand: record.brand,
      star_level: record.star_level,
      total_rooms: record.total_rooms,
      country: record.country,
      province: record.province,
      city: record.city,
      district: record.district,
      address: record.address,
      phone: record.phone,
      contact_person: record.contact_person,
      contact_phone: record.contact_phone,
      facilities: record.facilities,
      check_in_time: record.check_in_time ? dayjs(record.check_in_time, 'HH:mm') : null,
      check_out_time: record.check_out_time ? dayjs(record.check_out_time, 'HH:mm') : null,
      description: record.description,
    });
    
    // 设置封面图片
    if (record.cover_image) {
      setCoverFileList([{
        uid: '-1',
        name: 'cover.jpg',
        status: 'done',
        url: record.cover_image,
      }]);
    }
    
    // 设置酒店图片
    if (record.images && record.images.length > 0) {
      setImageFileList(record.images.map((url, index) => ({
        uid: `-${index + 2}`,
        name: `image${index + 1}.jpg`,
        status: 'done',
        url: url,
      })));
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: 'calc(100vh - 64px)' }}>
      <Card 
        title={
          <div style={{ fontSize: 18, fontWeight: 600 }}>
            我的酒店
          </div>
        }
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
            size="large"
            style={{
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(24, 144, 255, 0.2)',
            }}
          >
            添加酒店
          </Button>
        }
        bordered={false}
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
        />
      </Card>

      {/* 添加/编辑酒店 Modal */}
      <Modal
        title={isEditMode ? '编辑酒店' : '添加酒店'}
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={null}
        style={{ top: 20 }}
        bodyStyle={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <HotelForm
          form={form}
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
        footer={[
          <Button key="close" onClick={handleDetailModalClose}>
            关闭
          </Button>
        ]}
      >
        <HotelDetail hotel={currentHotel} loading={detailLoading} />
      </Modal>
    </div>
  );
};

export default Hotels;
