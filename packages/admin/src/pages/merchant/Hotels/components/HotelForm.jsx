import React, { useMemo, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Space, Button, Cascader, Image, Segmented } from 'antd';
import ImageUploader from '../../../../components/common/ImageUploader';
import FormSection from '../../../../components/common/FormSection';
import { HOTEL_TYPE, HOTEL_TYPE_OPTIONS } from '../../../../constants/hotelType';
import provinces from 'china-division/dist/provinces.json';
import cities from 'china-division/dist/cities.json';
import areas from 'china-division/dist/areas.json';

const { TextArea } = Input;
const { Option } = Select;

// 热门海外国家列表
const OVERSEAS_COUNTRIES = [
  { value: '日本', label: '🇯🇵 日本' },
  { value: '韩国', label: '🇰🇷 韩国' },
  { value: '泰国', label: '🇹🇭 泰国' },
  { value: '新加坡', label: '🇸🇬 新加坡' },
  { value: '马来西亚', label: '🇲🇾 马来西亚' },
  { value: '越南', label: '🇻🇳 越南' },
  { value: '印度尼西亚', label: '🇮🇩 印度尼西亚' },
  { value: '菲律宾', label: '🇵🇭 菲律宾' },
  { value: '美国', label: '🇺🇸 美国' },
  { value: '英国', label: '🇬🇧 英国' },
  { value: '法国', label: '🇫🇷 法国' },
  { value: '德国', label: '🇩🇪 德国' },
  { value: '意大利', label: '🇮🇹 意大利' },
  { value: '西班牙', label: '🇪🇸 西班牙' },
  { value: '澳大利亚', label: '🇦🇺 澳大利亚' },
  { value: '新西兰', label: '🇳🇿 新西兰' },
  { value: '加拿大', label: '🇨🇦 加拿大' },
  { value: '瑞士', label: '🇨🇭 瑞士' },
  { value: '荷兰', label: '🇳🇱 荷兰' },
  { value: '阿联酋', label: '🇦🇪 阿联酋' },
];

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
  
  // 监听酒店类型变化
  const hotelType = Form.useWatch('type', form);
  const isOverseas = hotelType === HOTEL_TYPE.OVERSEAS;
  
  // 当酒店类型切换时，清空位置字段
  useEffect(() => {
    if (hotelType !== undefined && !isEditMode) {
      // 只在新增模式下清空，编辑模式不清空
      form.setFieldsValue({
        area: undefined,
        location: undefined,
      });
    }
  }, [hotelType, form, isEditMode]);
  
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
        type: HOTEL_TYPE.DOMESTIC,
        star_rating: 3,
      }}
    >
      {/* 基本信息 */}
      <FormSection title="基本信息">
        <Form.Item
          label="酒店类型"
          name="type"
          rules={[{ required: true, message: '请选择酒店类型' }]}
        >
          <Segmented 
            options={HOTEL_TYPE_OPTIONS} 
            disabled={isViewMode}
            block
            style={{ marginBottom: 8 }}
          />
        </Form.Item>

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
        </Space>
      </FormSection>

      {/* 位置信息 */}
      <FormSection title="位置信息">
        {isOverseas ? (
          // 海外酒店：显示国家下拉选择
          <Form.Item
            label="国家"
            name="location"
            rules={[{ required: true, message: '请选择国家' }]}
          >
            <Select
              placeholder="请选择国家"
              showSearch
              optionFilterProp="label"
              disabled={isViewMode}
              options={OVERSEAS_COUNTRIES}
            />
          </Form.Item>
        ) : (
          // 国内/民宿：显示省市区级联选择
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
        )}

        <Form.Item
          label="详细地址"
          name="address"
          rules={[{ required: true, message: '请输入详细地址' }]}
        >
          <Input 
            placeholder={isOverseas ? "请输入城市、街道等详细地址" : "请输入街道、门牌号等详细地址"} 
            disabled={isViewMode} 
          />
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
              { label: '停车场', value: '停车场' },
              { label: '洗衣房', value: '洗衣房' },
              { label: '健身房', value: '健身房' },
              { label: '游泳池', value: '游泳池' },
              { label: '空调', value: '空调' },
              { label: 'WIFI', value: 'WIFI' },
            ]}
          />
        </Form.Item>

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
