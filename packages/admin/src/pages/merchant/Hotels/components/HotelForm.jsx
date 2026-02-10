import React, { useMemo } from 'react';
import { Form, Input, InputNumber, Select, TimePicker, Space, Button, Cascader, Image } from 'antd';
import dayjs from 'dayjs';
import ImageUploader from '../../../../components/common/ImageUploader';
import FormSection from '../../../../components/common/FormSection';
import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
import areas from 'china-division/dist/areas.json';

const { TextArea } = Input;
const { Option } = Select;

/**
 * 酒店表单组件
 * @param {string} mode - 模式：'view'(查看) | 'edit'(编辑) | 'add'(添加)
 */
const HotelForm = ({ 
  form,
  onFinish,
  onCancel,
  submitting,
  coverFileList,
  setCoverFileList,
  imageFileList,
  setImageFileList,
  mode = 'add', // 默认为添加模式
}) => {
  const isViewMode = mode === 'view';
  const isEditMode = mode === 'edit';
  
  // 转换 china-division 数据为 Cascader 格式
  const areaData = useMemo(() => {
    // 创建城市映射
    const cityMap = {};
    cities.forEach(city => {
      if (!cityMap[city.provinceCode]) {
        cityMap[city.provinceCode] = [];
      }
      cityMap[city.provinceCode].push(city);
    });

    // 创建区县映射
    const areaMap = {};
    areas.forEach(area => {
      if (!areaMap[area.cityCode]) {
        areaMap[area.cityCode] = [];
      }
      areaMap[area.cityCode].push(area);
    });

    // 构建三级联动数据
    return provinces.map(province => ({
      value: province.name,
      label: province.name,
      children: (cityMap[province.code] || []).map(city => ({
        value: city.name,
        label: city.name,
        children: (areaMap[city.code] || []).map(area => ({
          value: area.name,
          label: area.name,
        })),
      })),
    }));
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      onFinishFailed={(errorInfo) => {
        console.log('表单验证失败:', errorInfo);
      }}
      initialValues={{
        star_rating: 3,
        check_in_time: dayjs('14:00', 'HH:mm'),
        check_out_time: dayjs('12:00', 'HH:mm'),
      }}
    >
      {/* 基本信息 */}
      <FormSection title="基本信息">
        <Form.Item
          label="酒店名称"
          name="name"
          rules={[{ required: true, message: '请输入酒店名称' }]}
        >
          <Input placeholder="请输入酒店名称" disabled={isViewMode} />
        </Form.Item>

        <Form.Item label="英文名称" name="english_name">
          <Input placeholder="请输入英文名称（可选）" disabled={isViewMode} />
        </Form.Item>

        <Space style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }} size="large">
          <Form.Item
            label="品牌"
            name="brand"
            style={{ width: 200 }}
          >
            <Input placeholder="如：易宿连锁" disabled={isViewMode} />
          </Form.Item>

          <Form.Item
            label="星级"
            name="star_rating"
            rules={[{ required: true, message: '请选择星级' }]}
            style={{ width: 150 }}
          >
            <Select disabled={isViewMode}>
              <Option value={1}>一星级</Option>
              <Option value={2}>二星级</Option>
              <Option value={3}>三星级</Option>
              <Option value={4}>四星级</Option>
              <Option value={5}>五星级</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="房间数"
            name="room_number"
            rules={[{ required: true, message: '请输入房间数' }]}
            style={{ width: 150 }}
          >
            <InputNumber
              placeholder="50"
              min={1}
              style={{ width: '100%' }}
              disabled={isViewMode}
            />
          </Form.Item>
        </Space>
      </FormSection>

      {/* 位置信息 */}
      <FormSection title="位置信息">
        <Form.Item
          label="省市区"
          name="area"
          rules={[{ required: true, message: '请选择省市区' }]}
        >
          <Cascader
            options={areaData}
            placeholder="请选择省/市/区"
            showSearch
            style={{ width: '100%' }}
            disabled={isViewMode}
          />
        </Form.Item>

        <Form.Item
          label="详细地址"
          name="address"
          rules={[{ required: true, message: '请输入详细地址' }]}
        >
          <Input placeholder="请输入街道、门牌号等详细地址" disabled={isViewMode} />
        </Form.Item>
      </FormSection>

      {/* 联系方式 */}
      <FormSection title="联系方式">
        <Form.Item
          label="酒店电话"
          name="hotel_phone"
          rules={[{ required: true, message: '请输入酒店电话' }]}
        >
          <Input placeholder="021-63229988" disabled={isViewMode} />
        </Form.Item>

        <Space style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }} size="large">
          <Form.Item
            label="联系人"
            name="contact"
            style={{ width: 200 }}
          >
            <Input placeholder="张经理" disabled={isViewMode} />
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="contact_phone"
            style={{ width: 200 }}
          >
            <Input placeholder="13800138000" disabled={isViewMode} />
          </Form.Item>
        </Space>
      </FormSection>

      {/* 酒店设施 */}
      <FormSection title="酒店设施">
        <Form.Item label="设施" name="hotel_facilities">
          <Select
            mode="multiple"
            placeholder="请选择酒店设施"
            disabled={isViewMode}
            options={[
              { label: '免费WiFi', value: '免费WiFi' },
              { label: '停车场', value: '停车场' },
              { label: '餐厅', value: '餐厅' },
              { label: '健身房', value: '健身房' },
              { label: '游泳池', value: '游泳池' },
              { label: '水疗中心', value: '水疗中心' },
              { label: '会议室', value: '会议室' },
              { label: '商务中心', value: '商务中心' },
              { label: '洗衣服务', value: '洗衣服务' },
              { label: '接送服务', value: '接送服务' },
              { label: '礼宾服务', value: '礼宾服务' },
              { label: '行李寄存', value: '行李寄存' },
            ]}
          />
        </Form.Item>
      </FormSection>

      {/* 入住信息 */}
      <FormSection title="入住信息">
        <Space style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }} size="large">
          <Form.Item
            label="入住时间"
            name="check_in_time"
            rules={[{ required: true, message: '请选择入住时间' }]}
          >
            <TimePicker format="HH:mm" style={{ width: 150 }} disabled={isViewMode} />
          </Form.Item>

          <Form.Item
            label="退房时间"
            name="check_out_time"
            rules={[{ required: true, message: '请选择退房时间' }]}
          >
            <TimePicker format="HH:mm" style={{ width: 150 }} disabled={isViewMode} />
          </Form.Item>
        </Space>

        <Form.Item label="酒店描述" name="description">
          <TextArea
            rows={4}
            placeholder="请输入酒店描述，如位置优势、特色服务等"
            disabled={isViewMode}
          />
        </Form.Item>
      </FormSection>

      {/* 酒店图片 */}
      <FormSection title="酒店图片">
        {!isViewMode ? (
          <>
            <Form.Item
              label="封面图片"
              extra="建议尺寸：800x600，支持jpg、png、webp格式，最大5MB"
            >
              <ImageUploader
                fileList={coverFileList}
                onChange={({ fileList }) => setCoverFileList(fileList)}
                onRemove={() => setCoverFileList([])}
                maxCount={1}
                folder="hotels"
                uploadText="上传封面"
              />
            </Form.Item>

            <Form.Item
              label="酒店图片"
              extra="最多上传8张，建议尺寸：800x600，支持jpg、png、webp格式，最大5MB"
            >
              <ImageUploader
                fileList={imageFileList}
                onChange={({ fileList }) => setImageFileList(fileList)}
                onRemove={(file) => {
                  setImageFileList(imageFileList.filter(item => item.uid !== file.uid));
                }}
                maxCount={8}
                folder="hotels"
                uploadText="上传图片"
              />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label="封面图片">
              {coverFileList.length > 0 ? (
                <img 
                  src={coverFileList[0].url} 
                  alt="封面" 
                  style={{ width: 200, borderRadius: 8 }}
                />
              ) : (
                <span style={{ color: '#999' }}>暂无封面图片</span>
              )}
            </Form.Item>

            <Form.Item label="酒店图片">
              {imageFileList.length > 0 ? (
                <Space wrap>
                  {imageFileList.map((file, index) => (
                    <img 
                      key={index}
                      src={file.url} 
                      alt={`图片${index + 1}`} 
                      style={{ width: 150, borderRadius: 8 }}
                    />
                  ))}
                </Space>
              ) : (
                <span style={{ color: '#999' }}>暂无酒店图片</span>
              )}
            </Form.Item>
          </>
        )}
      </FormSection>

      <Form.Item>
        <Space>
          {!isViewMode && (
            <Button type="primary" htmlType="submit" loading={submitting}>
              {isEditMode ? '保存' : '提交'}
            </Button>
          )}
          <Button onClick={onCancel} disabled={submitting}>
            {isViewMode ? '关闭' : '取消'}
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default HotelForm;
