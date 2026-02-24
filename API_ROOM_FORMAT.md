# 房型管理 API 数据格式文档

## 概述
房间管理已重构为房型管理，一个房型包含多个房间号。

---

## 1. 获取房型列表

### 请求
```
GET /api/room/list?hotel_id=15
```

### 响应格式
```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "rooms": [
      {
        "id": 18,
        "hotel_id": 15,
        "room_number": "RT001",
        "room_type": "豪华大床房",
        "room_type_en": "Deluxe King Room",
        "bed_type": "大床",
        "area": "35.00",
        "floor": "10-15层",
        "max_occupancy": 2,
        "base_price": "888.00",
        "total_rooms": 5,
        "room_numbers": "[\"1001\", \"1002\", \"1003\", \"1004\", \"1005\"]",
        "facilities": "[\"WiFi\", \"空调\", \"电视\", \"独立卫浴\", \"吹风机\"]",
        "description": "豪华大床房，配备高级床品和现代化设施",
        "images": "[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1771915505363-ltcay4.png\"]",
        "status": 1,
        "booked_by": "0",
        "created_at": "2026-02-24T06:45:06.000Z",
        "updated_at": "2026-02-24T06:45:06.000Z",
        "is_deleted": 0
      },
      {
        "id": 19,
        "hotel_id": 15,
        "room_number": "RT002",
        "room_type": "标准双床房",
        "room_type_en": "Standard Twin Room",
        "bed_type": "双床",
        "area": "28.00",
        "floor": "5-10层",
        "max_occupancy": 2,
        "base_price": "588.00",
        "total_rooms": 8,
        "room_numbers": "[\"501\", \"502\", \"503\", \"601\", \"602\", \"603\", \"701\", \"702\"]",
        "facilities": "[\"WiFi\", \"空调\", \"电视\", \"独立卫浴\"]",
        "description": "标准双床房，适合商务出行",
        "images": "[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/example.png\"]",
        "status": 1,
        "booked_by": "0",
        "created_at": "2026-02-24T07:00:00.000Z",
        "updated_at": "2026-02-24T07:00:00.000Z",
        "is_deleted": 0
      }
    ],
    "total": 2
  }
}
```

### 字段说明
| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | Number | 房型ID | 18 |
| `hotel_id` | Number | 酒店ID | 15 |
| `room_number` | String | **房型编号**（原房间号字段） | "RT001" |
| `room_type` | String | 房型名称 | "豪华大床房" |
| `room_type_en` | String | 英文房型名称 | "Deluxe King Room" |
| `bed_type` | String | 床型 | "大床" / "双床" / "三床" |
| `area` | String | 面积（㎡） | "35.00" |
| `floor` | String | 楼层范围 | "10-15层" |
| `max_occupancy` | Number | 最多入住人数 | 2 |
| `base_price` | String | 基础价格（元/晚） | "888.00" |
| `total_rooms` | Number | 此房型房间总数 | 5 |
| `room_numbers` | String | **房间号列表（JSON字符串）** | `"[\"1001\", \"1002\"]"` |
| `facilities` | String | 设施列表（JSON字符串） | `"[\"WiFi\", \"空调\"]"` |
| `description` | String | 房间描述 | "豪华大床房..." |
| `images` | String | 图片列表（JSON字符串） | `"[\"https://...\"]"` |
| `status` | Number | 房型状态：1=可用, 0=停用 | 1 |
| `booked_by` | String | 预定人（保留字段，可忽略） | "0" |
| `created_at` | String | 创建时间 | "2026-02-24T06:45:06.000Z" |
| `updated_at` | String | 更新时间 | "2026-02-24T06:45:06.000Z" |
| `is_deleted` | Number | 是否删除：0=否, 1=是 | 0 |

### 重要变更
- ⚠️ `room_number` 字段现在存储的是**房型编号**（如 RT001），不再是具体房间号
- ✅ 新增 `room_numbers` 字段，存储该房型的所有房间号（JSON 数组字符串）
- ✅ `total_rooms` 应该等于 `room_numbers` 数组的长度

---

## 2. 获取房型详情

### 请求
```
GET /api/room/detail?id=18
```

### 响应格式
```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "id": 18,
    "hotel_id": 15,
    "room_number": "RT001",
    "room_type": "豪华大床房",
    "room_type_en": "Deluxe King Room",
    "bed_type": "大床",
    "area": "35.00",
    "floor": "10-15层",
    "max_occupancy": 2,
    "base_price": "888.00",
    "total_rooms": 5,
    "room_numbers": "[\"1001\", \"1002\", \"1003\", \"1004\", \"1005\"]",
    "facilities": "[\"WiFi\", \"空调\", \"电视\", \"独立卫浴\", \"吹风机\", \"热水壶\", \"冰箱\"]",
    "description": "豪华大床房，配备高级床品和现代化设施，房间宽敞明亮，视野开阔",
    "images": "[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1771915505363-ltcay4.png\", \"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/example2.png\"]",
    "status": 1,
    "booked_by": "0",
    "created_at": "2026-02-24T06:45:06.000Z",
    "updated_at": "2026-02-24T06:45:06.000Z",
    "is_deleted": 0
  }
}
```

### 字段说明
与列表接口相同，但返回单个房型的完整信息。

### 前端处理
前端会自动解析以下 JSON 字符串字段：
- `room_numbers` → `["1001", "1002", "1003", "1004", "1005"]`
- `facilities` → `["WiFi", "空调", "电视", ...]`
- `images` → `["https://...", "https://..."]`

---

## 3. 创建房型

### 请求
```
POST /api/room/create
Content-Type: application/json
```

### 请求体
```json
{
  "hotel_id": 15,
  "room_number": "RT001",
  "room_type": "豪华大床房",
  "room_type_en": "Deluxe King Room",
  "bed_type": "大床",
  "area": 35,
  "floor": "10-15层",
  "max_occupancy": 2,
  "base_price": 888,
  "total_rooms": 5,
  "room_numbers": "[\"1001\", \"1002\", \"1003\", \"1004\", \"1005\"]",
  "facilities": "[\"WiFi\", \"空调\", \"电视\", \"独立卫浴\", \"吹风机\"]",
  "description": "豪华大床房，配备高级床品和现代化设施",
  "images": "[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1771915505363-ltcay4.png\"]",
  "status": 1,
  "booked_by": "0"
}
```

### 字段说明
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `hotel_id` | Number | ✅ | 酒店ID |
| `room_number` | String | ✅ | 房型编号（如 RT001） |
| `room_type` | String | ✅ | 房型名称 |
| `room_type_en` | String | ❌ | 英文房型名称 |
| `bed_type` | String | ✅ | 床型 |
| `area` | Number | ❌ | 面积 |
| `floor` | String | ❌ | 楼层 |
| `max_occupancy` | Number | ✅ | 最多入住人数 |
| `base_price` | Number | ✅ | 基础价格 |
| `total_rooms` | Number | ✅ | 房间总数 |
| `room_numbers` | String | ✅ | **房间号列表（JSON字符串）** |
| `facilities` | String | ❌ | 设施列表（JSON字符串） |
| `description` | String | ❌ | 房间描述 |
| `images` | String | ❌ | 图片列表（JSON字符串） |
| `status` | Number | ❌ | 状态，默认1 |
| `booked_by` | String | ❌ | 默认"0" |

### 响应格式
```json
{
  "success": true,
  "message": "房间创建成功",
  "data": {
    "id": 20,
    "hotel_id": 15,
    "room_number": "RT001",
    ...
  }
}
```

---

## 4. 更新房型

### 请求
```
PUT /api/room/update
Content-Type: application/json
```

### 请求体
```json
{
  "id": 18,
  "hotel_id": 15,
  "room_number": "RT001",
  "room_type": "豪华大床房",
  "room_type_en": "Deluxe King Room",
  "bed_type": "大床",
  "area": 35,
  "floor": "10-15层",
  "max_occupancy": 2,
  "base_price": 888,
  "total_rooms": 6,
  "room_numbers": "[\"1001\", \"1002\", \"1003\", \"1004\", \"1005\", \"1006\"]",
  "facilities": "[\"WiFi\", \"空调\", \"电视\", \"独立卫浴\", \"吹风机\", \"保险箱\"]",
  "description": "豪华大床房，配备高级床品和现代化设施",
  "images": "[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1771915505363-ltcay4.png\"]",
  "status": 1,
  "booked_by": "0"
}
```

### 字段说明
与创建接口相同，但必须包含 `id` 字段。

### 响应格式
```json
{
  "success": true,
  "message": "房间更新成功",
  "data": {
    "id": 18,
    "hotel_id": 15,
    "room_number": "RT001",
    ...
  }
}
```

---

## 5. 删除房型

### 请求
```
DELETE /api/room/delete?id=18
```

### 响应格式
```json
{
  "success": true,
  "message": "房间删除成功"
}
```

---

## 数据库字段变更建议

### 方案 A：最小改动（推荐）
只需要在现有 `rooms` 表添加一个字段：

```sql
ALTER TABLE rooms ADD COLUMN room_numbers JSON COMMENT '房间号列表';
```

### 字段说明
- `room_number`：改为存储房型编号（如 RT001）
- `room_numbers`：新增，存储房间号数组（如 ["1001", "1002", "1003"]）
- `total_rooms`：保持不变，表示该房型的房间总数

### 数据示例
```sql
INSERT INTO rooms (
  hotel_id, 
  room_number, 
  room_type, 
  room_numbers, 
  total_rooms, 
  base_price
) VALUES (
  15, 
  'RT001', 
  '豪华大床房', 
  '["1001", "1002", "1003", "1004", "1005"]', 
  5, 
  888.00
);
```

---

## 前端数据处理逻辑

### 1. 列表页面
```javascript
// 前端接收到数据后的处理
const rooms = response.data.rooms.map(room => ({
  ...room,
  // 不需要解析 room_numbers，列表页不显示
}));
```

### 2. 详情页面
```javascript
// 前端接收到数据后的处理
const roomData = response.data;
const detailData = {
  ...roomData,
  room_numbers: JSON.parse(roomData.room_numbers), // 解析为数组
  facilities: JSON.parse(roomData.facilities),
  images: JSON.parse(roomData.images),
};
```

### 3. 编辑页面
```javascript
// 前端提交数据前的处理
const submitData = {
  ...formValues,
  room_numbers: JSON.stringify(formValues.room_numbers), // 数组转字符串
  facilities: JSON.stringify(formValues.facilities),
  images: JSON.stringify(formValues.images),
};
```

---

## 常见问题

### Q1: room_number 字段为什么不改名？
A: 为了减少后端改动，保持字段名不变，只改变存储的内容（从具体房间号改为房型编号）。

### Q2: room_numbers 为什么用 JSON 字符串而不是关联表？
A: 简化实现，快速上线。如果后续需要更复杂的房间管理（如单独管理每个房间的状态），可以重构为关联表。

### Q3: total_rooms 和 room_numbers.length 的关系？
A: 理论上应该相等。建议后端在保存时自动计算：
```javascript
total_rooms = JSON.parse(room_numbers).length;
```

### Q4: 如何处理旧数据？
A: 需要数据迁移脚本，将相同 room_type 的房间合并：
```sql
-- 示例：将相同房型的房间合并
-- 1. 找出所有相同房型的房间
-- 2. 将 room_number 收集到 room_numbers 数组
-- 3. 保留一条记录，删除其他记录
```

---

## 测试数据示例

### 示例 1：豪华大床房
```json
{
  "id": 18,
  "hotel_id": 15,
  "room_number": "RT001",
  "room_type": "豪华大床房",
  "room_type_en": "Deluxe King Room",
  "bed_type": "大床",
  "area": "35.00",
  "floor": "10-15层",
  "max_occupancy": 2,
  "base_price": "888.00",
  "total_rooms": 5,
  "room_numbers": "[\"1001\", \"1002\", \"1003\", \"1004\", \"1005\"]",
  "facilities": "[\"WiFi\", \"空调\", \"电视\", \"独立卫浴\", \"吹风机\", \"热水壶\", \"冰箱\"]",
  "description": "豪华大床房，配备高级床品和现代化设施",
  "images": "[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/example1.png\"]",
  "status": 1
}
```

### 示例 2：标准双床房
```json
{
  "id": 19,
  "hotel_id": 15,
  "room_number": "RT002",
  "room_type": "标准双床房",
  "room_type_en": "Standard Twin Room",
  "bed_type": "双床",
  "area": "28.00",
  "floor": "5-10层",
  "max_occupancy": 2,
  "base_price": "588.00",
  "total_rooms": 8,
  "room_numbers": "[\"501\", \"502\", \"503\", \"601\", \"602\", \"603\", \"701\", \"702\"]",
  "facilities": "[\"WiFi\", \"空调\", \"电视\", \"独立卫浴\"]",
  "description": "标准双床房，适合商务出行",
  "images": "[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/example2.png\"]",
  "status": 1
}
```

---

## 总结

### 核心变更
1. ✅ `room_number` 字段：从"房间号"改为"房型编号"
2. ✅ 新增 `room_numbers` 字段：存储该房型的所有房间号（JSON 数组）
3. ✅ 前端自动解析 JSON 字符串字段

### 后端需要做的
1. 数据库添加 `room_numbers` 字段（JSON 类型）
2. 接口支持接收和返回 `room_numbers` 字段
3. 数据迁移（可选）：合并相同房型的房间

### 前端已完成
1. ✅ 表单支持输入多个房间号
2. ✅ 详情页显示房间号列表
3. ✅ 自动处理 JSON 字符串的序列化和反序列化
