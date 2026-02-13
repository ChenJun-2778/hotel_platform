import React, { useState, useEffect } from 'react';
import { Modal, Form, InputNumber, Space, Button, Alert, Statistic, Row, Col } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';

/**
 * 库存调整弹窗组件
 */
const StockAdjustModal = ({ visible, room, onClose, onSubmit }) => {
  const [form] = Form.useForm();
  const [adjustValue, setAdjustValue] = useState(0);

  useEffect(() => {
    if (visible && room) {
      form.setFieldsValue({
        available_rooms: room.available_rooms || 0,
      });
      setAdjustValue(0);
    }
  }, [visible, room, form]);

  const handleFinish = (values) => {
    onSubmit && onSubmit(room.id, values.available_rooms);
  };

  const handleQuickAdjust = (delta) => {
    const currentValue = form.getFieldValue('available_rooms') || 0;
    const newValue = Math.max(0, Math.min(room.total_rooms, currentValue + delta));
    form.setFieldsValue({ available_rooms: newValue });
    setAdjustValue(newValue - (room.available_rooms || 0));
  };

  const currentAvailable = form.getFieldValue('available_rooms') || 0;
  const originalAvailable = room?.available_rooms || 0;
  const difference = currentAvailable - originalAvailable;

  return (
    <Modal
      title={`调整库存 - ${room?.roomNumber || ''} ${room?.type || ''}`}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      {room && (
        <>
          {/* 当前库存信息 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Statistic
                title="总房间数"
                value={room.total_rooms}
                suffix="间"
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="当前可用"
                value={originalAvailable}
                suffix="间"
                valueStyle={{ color: '#52c41a' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="使用率"
                value={((room.total_rooms - originalAvailable) / room.total_rooms * 100).toFixed(1)}
                suffix="%"
                valueStyle={{ color: '#faad14' }}
              />
            </Col>
          </Row>

          {/* 调整说明 */}
          <Alert
            message="库存调整说明"
            description="调整可用房间数用于临时维护、清洁等情况。减少库存会使该房型暂时不可预订。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
          >
            {/* 快速调整按钮 */}
            <Form.Item label="快速调整">
              <Space size="middle">
                <Button
                  icon={<MinusOutlined />}
                  onClick={() => handleQuickAdjust(-5)}
                  disabled={currentAvailable <= 0}
                >
                  -5
                </Button>
                <Button
                  icon={<MinusOutlined />}
                  onClick={() => handleQuickAdjust(-1)}
                  disabled={currentAvailable <= 0}
                >
                  -1
                </Button>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => handleQuickAdjust(1)}
                  disabled={currentAvailable >= room.total_rooms}
                >
                  +1
                </Button>
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => handleQuickAdjust(5)}
                  disabled={currentAvailable >= room.total_rooms}
                >
                  +5
                </Button>
              </Space>
            </Form.Item>

            {/* 精确调整 */}
            <Form.Item
              label="可用房间数"
              name="available_rooms"
              rules={[
                { required: true, message: '请输入可用房间数' },
                {
                  type: 'number',
                  min: 0,
                  max: room.total_rooms,
                  message: `可用房间数必须在 0 到 ${room.total_rooms} 之间`,
                },
              ]}
            >
              <InputNumber
                min={0}
                max={room.total_rooms}
                style={{ width: '100%' }}
                placeholder="请输入可用房间数"
                onChange={(value) => {
                  setAdjustValue((value || 0) - originalAvailable);
                }}
              />
            </Form.Item>

            {/* 变化提示 */}
            {difference !== 0 && (
              <Alert
                message={
                  difference > 0
                    ? `将增加 ${difference} 间可用房间`
                    : `将减少 ${Math.abs(difference)} 间可用房间`
                }
                type={difference > 0 ? 'success' : 'warning'}
                showIcon
                style={{ marginBottom: 16 }}
              />
            )}

            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit">
                  确认调整
                </Button>
                <Button onClick={onClose}>
                  取消
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default StockAdjustModal;
