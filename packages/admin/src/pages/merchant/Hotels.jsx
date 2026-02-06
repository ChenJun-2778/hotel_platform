import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Modal, Form, Input, InputNumber, Select, Upload, TimePicker, message } from 'antd';
import { EditOutlined, EyeOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;

const Hotels = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleSubmit = async (values) => {
    console.log('表单数据:', values);
    message.success('酒店添加成功！');
    setIsModalOpen(false);
    form.resetFields();
    // TODO: 调用后端接口
  };
  const columns = [
    {
      title: '酒店名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '房间数',
      dataIndex: 'rooms',
      key: 'rooms',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          online: { color: 'green', text: '营业中' },
          offline: { color: 'default', text: '已下线' },
          pending: { color: 'orange', text: '审核中' },
        };
        return <Tag color={statusMap[status].color}>{statusMap[status].text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />}>查看</Button>
          <Button type="link" icon={<EditOutlined />}>编辑</Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: '1',
      name: '我的豪华酒店',
      address: '北京市朝阳区',
      rooms: 50,
      status: 'online',
    },
    {
      key: '2',
      name: '舒适商务酒店',
      address: '北京市海淀区',
      rooms: 30,
      status: 'online',
    },
    {
      key: '3',
      name: '新开业酒店',
      address: '北京市东城区',
      rooms: 20,
      status: 'pending',
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card 
        title="我的酒店" 
        extra={<Button type="primary" icon={<PlusOutlined />} onClick={showModal}>添加酒店</Button>}
      >
        <Table columns={columns} dataSource={data} />
      </Card>

      <Modal
        title="添加酒店"
        open={isModalOpen}
        onCancel={handleCancel}
        width={800}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            country: '中国',
            star_level: 3,
            check_in_time: dayjs('14:00', 'HH:mm'),
            check_out_time: dayjs('12:00', 'HH:mm'),
          }}
        >
          {/* 基本信息 */}
          <Card type="inner" title="基本信息" style={{ marginBottom: 16 }}>
            <Form.Item
              label="酒店名称"
              name="name"
              rules={[{ required: true, message: '请输入酒店名称' }]}
            >
              <Input placeholder="请输入酒店名称" />
            </Form.Item>

            <Form.Item
              label="英文名称"
              name="name_en"
            >
              <Input placeholder="请输入英文名称（可选）" />
            </Form.Item>

            <Space style={{ width: '100%' }} size="large">
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
          </Card>

          {/* 位置信息 */}
          <Card type="inner" title="位置信息" style={{ marginBottom: 16 }}>
            <Space style={{ width: '100%' }} size="large">
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
          </Card>

          {/* 联系方式 */}
          <Card type="inner" title="联系方式" style={{ marginBottom: 16 }}>
            <Space style={{ width: '100%' }} size="large">
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
          </Card>

          {/* 酒店设施 */}
          <Card type="inner" title="酒店设施" style={{ marginBottom: 16 }}>
            <Form.Item
              label="设施"
              name="facilities"
            >
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
          </Card>

          {/* 入住信息 */}
          <Card type="inner" title="入住信息" style={{ marginBottom: 16 }}>
            <Space style={{ width: '100%' }} size="large">
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

            <Form.Item
              label="酒店描述"
              name="description"
            >
              <TextArea
                rows={4}
                placeholder="请输入酒店描述，如位置优势、特色服务等"
              />
            </Form.Item>
          </Card>

          {/* 酒店图片 */}
          <Card type="inner" title="酒店图片" style={{ marginBottom: 16 }}>
            <Form.Item
              label="封面图片"
              name="cover_image"
              extra="建议尺寸：800x600，支持jpg、png格式"
            >
              <Upload
                listType="picture-card"
                maxCount={1}
                beforeUpload={() => false}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传封面</div>
                </div>
              </Upload>
            </Form.Item>

            <Form.Item
              label="酒店图片"
              name="images"
              extra="最多上传8张，建议尺寸：800x600"
            >
              <Upload
                listType="picture-card"
                maxCount={8}
                multiple
                beforeUpload={() => false}
              >
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>上传图片</div>
                </div>
              </Upload>
            </Form.Item>
          </Card>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
              <Button onClick={handleCancel}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Hotels;
