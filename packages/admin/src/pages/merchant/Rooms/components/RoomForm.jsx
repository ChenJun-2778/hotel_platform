import React from 'react';
import { Form, Input, InputNumber, Select, Space, Button } from 'antd';
import ImageUploader from '../../../../components/common/ImageUploader';
import FormSection from '../../../../components/common/FormSection';

const { TextArea } = Input;
const { Option } = Select;

/**
 * 房间表单组件
 */
const RoomForm = ({
  form,
  onFinish,
  onCancel,
  submitting,
  hotels,
  roomImageFileList,
  setRoomImageFileList,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        bed_type: '大床',
        max_occupancy: 2,
      }}
    >
      {/* 基本信息 */}
      <FormSection title="基本信息">
        <Form.Item
          label="所属酒店"
          name="hotel_id"
          rules={[{ required: true, message: '请选择所属酒店' }]}
        >
          <Select placeholder="请选择酒店" options={hotels} />
        </Form.Item>

        <Space style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }} size="large">
          <Form.Item
            label="房型编号"
            name="room_number"
            rules={[{ required: true, message: '请输入房型编号' }]}
            style={{ width: 150 }}
          >
            <Input placeholder="如：RT001" />
          </Form.Item>

          <Form.Item
            label="房型"
            name="room_type"
            rules={[{ required: true, message: '请输入房型' }]}
            style={{ width: 200 }}
          >
            <Input placeholder="如：豪华大床房" />
          </Form.Item>

          <Form.Item
            label="英文房型"
            name="room_type_en"
            style={{ width: 200 }}
          >
            <Input placeholder="Deluxe King Room" />
          </Form.Item>
        </Space>

        <Form.Item
          label="房间号列表"
          name="room_numbers"
          extra="输入房间号后按回车添加，如：102、103、104（后端实现后生效）"
        >
          <Select
            mode="tags"
            placeholder="输入房间号，按回车添加"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
          />
        </Form.Item>

        <Space style={{ width: '100%', display: 'flex', flexWrap: 'wrap' }} size="large">
          <Form.Item
            label="床型"
            name="bed_type"
            rules={[{ required: true, message: '请选择床型' }]}
            style={{ width: 150 }}
          >
            <Select>
              <Option value="大床">大床</Option>
              <Option value="双床">双床</Option>
              <Option value="三床">三床</Option>
              <Option value="榻榻米">榻榻米</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="面积(㎡)"
            name="area"
            style={{ width: 120 }}
          >
            <InputNumber
              placeholder="35"
              min={10}
              max={500}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item
            label="楼层"
            name="floor"
            style={{ width: 150 }}
          >
            <Input placeholder="如：10-15层" />
          </Form.Item>

          <Form.Item
            label="最多入住人数"
            name="max_occupancy"
            rules={[{ required: true, message: '请输入最多入住人数' }]}
            style={{ width: 120 }}
          >
            <InputNumber
              min={1}
              max={10}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Space>
      </FormSection>

      {/* 价格库存 */}
      <FormSection title="价格库存">
        <Form.Item
          label="基础价格(元/晚)"
          name="base_price"
          rules={[{ required: true, message: '请输入基础价格' }]}
          style={{ width: 200 }}
        >
          <InputNumber
            placeholder="588.00"
            min={0}
            precision={2}
            style={{ width: '100%' }}
          />
        </Form.Item>
      </FormSection>

      {/* 房间设施 */}
      <FormSection title="房间设施">
        <Form.Item label="设施" name="facilities">
          <Select
            mode="multiple"
            placeholder="请选择房间设施"
            options={[
              { label: 'WiFi', value: 'WiFi' },
              { label: '空调', value: '空调' },
              { label: '电视', value: '电视' },
              { label: '独立卫浴', value: '独立卫浴' },
              { label: '吹风机', value: '吹风机' },
              { label: '热水壶', value: '热水壶' },
              { label: '冰箱', value: '冰箱' },
              { label: '保险箱', value: '保险箱' },
              { label: '浴缸', value: '浴缸' },
              { label: '阳台', value: '阳台' },
              { label: '书桌', value: '书桌' },
              { label: '沙发', value: '沙发' },
            ]}
          />
        </Form.Item>

        <Form.Item label="房间描述" name="description">
          <TextArea
            rows={3}
            placeholder="请输入房间描述，如房间特色、景观等"
          />
        </Form.Item>
      </FormSection>

      {/* 房间图片 */}
      <FormSection title="房间图片">
        <Form.Item
          label="房间图片"
          extra="最多上传6张，建议尺寸：800x600，支持jpg、png、webp格式，最大5MB"
        >
          <ImageUploader
            fileList={roomImageFileList}
            onChange={({ fileList }) => setRoomImageFileList(fileList)}
            onRemove={(file) => {
              setRoomImageFileList(roomImageFileList.filter(item => item.uid !== file.uid));
            }}
            maxCount={6}
            folder="rooms"
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

export default RoomForm;
