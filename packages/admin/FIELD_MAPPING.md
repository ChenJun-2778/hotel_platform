# 前后端字段映射对照表

## 酒店数据字段（后端标准）

| 功能 | 前端字段名 | 后端字段名 | 数据类型 | 说明 |
|------|-----------|-----------|---------|------|
| 酒店名称 | `name` | `name` | string | 中文名称 |
| 英文名称 | `english_name` | `english_name` | string | 英文名称 |
| 品牌 | `brand` | `brand` | string | 酒店品牌 |
| 星级 | `star_rating` | `star_rating` | number | 1-5星 |
| 房间数 | `room_number` | `room_number` | number | 总房间数 |
| 位置 | `location` | `location` | string | 城市名称 |
| 国家 | `country` | `country` | string | 默认"中国" |
| 省份 | `province` | `province` | string | 省级行政区 |
| 城市 | `city` | `city` | string | 地级市 |
| 区县 | `district` | `district` | string | 区县 |
| 详细地址 | `address` | `address` | string | 街道门牌号 |
| 酒店电话 | `hotel_phone` | `hotel_phone` | string | 座机号码 |
| 联系人 | `contact` | `contact` | string | 负责人姓名 |
| 联系电话 | `contact_phone` | `contact_phone` | string | 手机号码 |
| 设施列表 | `hotel_facilities` | `hotel_facilities` | string | 逗号分隔的设施字符串 |
| 入住时间 | `check_in_time` | `check_in_time` | string | YYYY-MM-DD HH:mm:ss |
| 退房时间 | `check_out_time` | `check_out_time` | string | YYYY-MM-DD HH:mm:ss |
| 酒店描述 | `description` | `description` | string | 文本描述 |
| 封面图片 | `cover_image` | `cover_image` | string | 图片URL |
| 酒店图片 | `images` | `images` | string | JSON字符串数组 |
| 状态 | `status` | `status` | number | 1-营业中, 0-已下架, 2-待审批, 3-审批拒绝 |

---

## 特殊处理字段

### 1. 省市区字段（area）
前端使用Cascader组件，数据格式为数组：
```javascript
// 前端表单
area: ['浙江省', '杭州市', '西湖区']

// 提交时拆分为后端字段
const [province, city, district] = values.area || [];

// location字段：完整的省市区
const location = values.area ? values.area.join('') : '';
// 结果：'浙江省杭州市西湖区'
```

### 2. 设施字段（hotel_facilities）
```javascript
// 前端表单（数组）
hotel_facilities: ['免费WiFi', '停车场', '餐厅']

// 提交时转换为逗号分隔字符串
hotel_facilities: values.hotel_facilities?.join(',') || ''

// 显示时转换回数组
hotel.hotel_facilities.split(',').filter(Boolean)
```

### 3. 时间字段
```javascript
// 提交时转换为完整日期时间
check_in_time: values.check_in_time?.format('YYYY-MM-DD HH:mm:ss')
check_out_time: values.check_out_time?.format('YYYY-MM-DD HH:mm:ss')

// 编辑时转换为dayjs对象
check_in_time: record.check_in_time ? dayjs(record.check_in_time) : null
```

### 4. 图片字段（images）
```javascript
// 提交时转换为JSON字符串
images: JSON.stringify(images)

// 显示时解析JSON
const imageList = typeof hotel.images === 'string' 
  ? JSON.parse(hotel.images || '[]') 
  : hotel.images || [];
```

---

## 功能实现状态

### ✅ 已完成
1. **添加酒店** - 使用真实API，字段完全映射
2. **酒店列表** - 使用真实API，分页查询
3. **查看详情** - 使用真实API (`GET /hotels/:id`)，字段完全兼容
4. **编辑酒店** - 表单回填支持后端字段
5. **字段映射** - 所有字段统一使用后端字段名

### 📝 文件清单
- `Hotels/index.jsx` - 主页面，包含添加/编辑/查看逻辑
- `Hotels/components/HotelForm.jsx` - 表单组件，使用后端字段名
- `Hotels/components/HotelDetail.jsx` - 详情组件，支持后端字段
- `Hotels/components/HotelTable.jsx` - 表格组件
- `Hotels/components/HotelTableColumns.jsx` - 表格列配置
- `Hotels/hooks/useHotelList.js` - 数据管理Hook
- `services/hotelService.js` - API服务

---

## 更新日期
2026-02-10

