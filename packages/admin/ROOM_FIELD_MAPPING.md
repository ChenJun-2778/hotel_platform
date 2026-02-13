# 房间管理字段映射文档

## 概述
本文档记录前端和后端房间相关字段的映射关系，确保数据传输的一致性。

## 字段映射对照表

### 基础信息

| 前端字段名 | 后端字段名 | 类型 | 说明 | 示例 |
|-----------|-----------|------|------|------|
| hotel_id | hotel_id | number | 所属酒店ID | 4 |
| room_number | room_number | string | 房间号 | "2808" |
| room_type | room_type | string | 房间类型（中文） | "行政豪华大床房" |
| room_type_en | room_type_en | string | 房间类型（英文） | "Executive Deluxe King Room" |
| bed_type | bed_type | string | 床型 | "大床" / "双床" |
| area | area | number | 房间面积（平方米） | 45.5 |
| floor | floor | string | 楼层 | "28层" |
| max_occupancy | max_occupancy | number | 最大入住人数 | 2 |

### 价格信息

| 前端字段名 | 后端字段名 | 类型 | 说明 | 示例 |
|-----------|-----------|------|------|------|
| base_price | base_price | number | 基础价格（元/晚） | 888.00 |

### 库存信息

| 前端字段名 | 后端字段名 | 类型 | 说明 | 示例 |
|-----------|-----------|------|------|------|
| total_rooms | total_rooms | number | 该类型房间总数 | 15 |
| available_rooms | available_rooms | number | 可用房间数 | 12 |

### 设施信息

| 前端字段名 | 后端字段名 | 类型 | 说明 | 示例 |
|-----------|-----------|------|------|------|
| facilities | facilities | string | 房间设施（JSON数组字符串） | '["WiFi","空调","电视"]' |

### 描述信息

| 前端字段名 | 后端字段名 | 类型 | 说明 | 示例 |
|-----------|-----------|------|------|------|
| description | description | string | 房间描述 | "位于酒店高层的行政豪华大床房..." |

### 图片信息

| 前端字段名 | 后端字段名 | 类型 | 说明 | 示例 |
|-----------|-----------|------|------|------|
| images | images | string | 房间图片URL数组（JSON字符串） | '["url1","url2"]' |

### 状态信息

| 前端字段名 | 后端字段名 | 类型 | 说明 | 示例 |
|-----------|-----------|------|------|------|
| status | status | number | 房间状态 | 1 / 2 / 3 / 4 |
| booked_by | booked_by | string | 预定人ID | "1" / "0"（0表示无人预定） |

### 创建时间

| 前端字段名 | 后端字段名 | 类型 | 说明 | 示例 |
|-----------|-----------|------|------|------|
| created_at | created_at | string | 创建时间 | "2026-02-09T21:56:33.000Z" |
| updated_at | updated_at | string | 更新时间 | "2026-02-09T21:56:33.000Z" |

## 房间状态说明

| 状态值 | 中文名称 | 颜色 | 说明 |
|--------|---------|------|------|
| 1 | 可预订 | 绿色 | 房间可以预订 |
| 2 | 已入住 | 红色 | 房间已被占用 |
| 3 | 已预订 | 黄色 | 房间已被预订但未入住 |
| 4 | 清洁中 | 蓝色 | 房间正在清洁 |

## 床型选项

- 大床（King Bed）
- 双床（Twin Beds）
- 单床（Single Bed）
- 三床（Triple Beds）

## 常见设施选项

- 免费WiFi
- 空调
- 电视
- 迷你吧
- 保险箱
- 吹风机
- 浴缸
- 淋浴
- 拖鞋
- 浴袍
- 书桌
- 沙发
- 阳台
- 景观

## API 接口

### 创建房间
- **接口**: POST /api/rooms/create
- **请求体**: application/json
- **必填字段**: hotel_id, room_number, room_type, bed_type, area, floor, max_occupancy, base_price, total_rooms, available_rooms

### 获取房间列表
- **接口**: GET /api/rooms/list
- **查询参数**: hotel_id（可选，按酒店筛选）

### 获取房间详情
- **接口**: GET /api/rooms/:id
- **路径参数**: id（房间ID）

### 更新房间信息
- **接口**: PUT /api/rooms/:id
- **路径参数**: id（房间ID）
- **请求体**: application/json

### 删除房间
- **接口**: DELETE /api/rooms/:id
- **路径参数**: id（房间ID）

## 数据示例

### 创建房间请求示例
```json
{
  "hotel_id": 4,
  "room_number": "2808",
  "room_type": "行政豪华大床房",
  "room_type_en": "Executive Deluxe King Room",
  "bed_type": "大床",
  "area": 45.5,
  "floor": "28层",
  "max_occupancy": 2,
  "base_price": 888.00,
  "total_rooms": 15,
  "available_rooms": 12,
  "facilities": "[\"WiFi\",\"空调\",\"电视\",\"独立卫浴\",\"吹风机\",\"热水壶\",\"冰箱\",\"保险箱\",\"浴缸\",\"阳台\",\"书桌\",\"沙发\"]",
  "description": "位于酒店高层的行政豪华大床房，配备落地窗，可俯瞰城市全景。房间宽敞明亮，配有独立办公区域和舒适的休息空间，是商务出行的理想选择。",
  "images": "[\"https://example.com/images/room1.jpg\",\"https://example.com/images/room2.jpg\",\"https://example.com/images/room3.jpg\"]",
  "status": 1,
  "booked_by": "0"
}
```

## 注意事项

1. **图片字段**: images 字段在后端存储为 JSON 字符串，前端需要进行序列化/反序列化处理
2. **设施字段**: facilities 字段在后端存储为 JSON 数组字符串（如 `["WiFi","空调"]`），前端表单使用数组，提交时需要 `JSON.stringify()`
3. **楼层字段**: floor 字段是字符串类型，包含"层"字（如 "28层"）
4. **房间状态**: status 是数字类型（1=可预订, 2=已入住, 3=维护中, 4=清洁中）
5. **预定人**: booked_by 字段，"0" 表示无人预定，其他值为预定人ID
6. **价格单位**: base_price 单位为人民币元
7. **面积单位**: area 单位为平方米，支持小数

## 更新日志

### 2024-02-10
- 创建房间字段映射文档
- 定义所有房间相关字段
- 添加API接口说明
