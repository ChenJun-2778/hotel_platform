import React from 'react';
import { Form, Input, InputNumber, Select, TimePicker, Space, Button } from 'antd';
import dayjs from 'dayjs';
import ImageUploader from '../../../../components/common/ImageUploader';
import FormSection from '../../../../components/common/FormSection';

const { TextArea } = Input;
const { Option } = Select;

/**
 * 酒店表单组件
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
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        country: '中国',
        star_level: 3,
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
          <Input placeholder="请输入酒店名称" />
        </Form.Item>

        <Form.Item label="英文名称" name="name_en">
          <Input placeholder="请输入英文名称（可选）" />
        </Form.Item>

        <Space style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }} size="large">
          <Form.Item
            label="品牌"
            name="brand"
            style={{ width: 200 }}
          >
            <Input placeholder="如：易宿连锁" />
          </Form.Item>

          <Form.Item
            label="星级"
            name="star_level"
            rules={[{ required: true, message: '请选择星级' }]}
            style={{ width: 150 }}
          >
            <Select>
              <Option value={1}>一星级</Option>
              <Option value={2}>二星级</Option>
              <Option value={3}>三星级</Option>
              <Option value={4}>四星级</Option>
              <Option value={5}>五星级</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="房间数"
            name="total_rooms"
            rules={[{ required: true, message: '请输入房间数' }]}
            style={{ width: 150 }}
          >
            <InputNumber
              placeholder="50"
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Space>
      </FormSection>

      {/* 位置信息 */}
      <FormSection title="位置信息">
        <Space style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }} size="large">
          <Form.Item
            label="国家"
            name="country"
            rules={[{ required: true, message: '请输入国家' }]}
            style={{ width: 150 }}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="省份"
            name="province"
            rules={[{ required: true, message: '请输入省份' }]}
            style={{ width: 150 }}
          >
            <Input placeholder="如：浙江省" />
          </Form.Item>

          <Form.Item
            label="城市"
            name="city"
            rules={[{ required: true, message: '请输入城市' }]}
            style={{ width: 150 }}
          >
            <Input placeholder="如：杭州市" />
          </Form.Item>

          <Form.Item
            label="区县"
            name="district"
            style={{ width: 150 }}
          >
            <Input placeholder="如：西湖区" />
          </Form.Item>
        </Space>

        <Form.Item
          label="详细地址"
          name="address"
          rules={[{ required: true, message: '请输入详细地址' }]}
        >
          <Input placeholder="请输入详细地址" />
        </Form.Item>
      </FormSection>

      {/* 联系方式 */}
      <FormSection title="联系方式">
        <Space style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }} size="large">
          <Form.Item
            label="酒店电话"
            name="phone"
            rules={[{ required: true, message: '请输入酒店电话' }]}
            style={{ width: 200 }}
          >
            <Input placeholder="0571-12345678" />
          </Form.Item>

          <Form.Item
            label="联系人"
            name="contact_person"
            style={{ width: 150 }}
          >
            <Input placeholder="张经理" />
          </Form.Item>

          <Form.Item
            label="联系电话"
            name="contact_phone"
            style={{ width: 200 }}
          >
            <Input placeholder="+86-13800138000" />
          </Form.Item>
        </Space>
      </FormSection>

      {/* 酒店设施 */}
      <FormSection title="酒店设施">
        <Form.Item label="设施" name="facilities">
          <Select
            mode="multiple"
            placeholder="请选择酒店设施"
            options={[
              { label: 'WiFi', value: 'WiFi' },
              { label: '停车场', value: '停车场' },
              { label: '餐厅', value: '餐厅' },
              { label: '健身房', value: '健身房' },
              { label: '游泳池', value: '游泳池' },
              { label: '会议室', value: '会议室' },
              { label: '商务中心', value: '商务中心' },
              { label: '洗衣服务', value: '洗衣服务' },
              { label: '接送服务', value: '接送服务' },
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
            <TimePicker format="HH:mm" style={{ width: 150 }} />
          </Form.Item>

          <Form.Item
            label="退房时间"
            name="check_out_time"
            rules={[{ required: true, message: '请选择退房时间' }]}
          >
            <TimePicker format="HH:mm" style={{ width: 150 }} />
          </Form.Item>
        </Space>

        <Form.Item label="酒店描述" name="description">
          <TextArea
            rows={4}
            placeholder="请输入酒店描述，如位置优势、特色服务等"
          />
        </Form.Item>
      </FormSection>

      {/* 酒店图片 */}
      <FormSection title="酒店图片">
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
      </FormSection>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={submitting}>
            提交
          </Button>
          <Button onClick={onCancel} disabled={submitting}>
            取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default HotelForm;
