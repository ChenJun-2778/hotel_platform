# Server API 文档

## 基础信息

- **Base URL**: `http://localhost:3000` (开发环境)
- **Content-Type**: `application/json`
- **认证方式**: JWT Token (部分接口需要)

## 目录

- [通用说明](#通用说明)
- [移动端接口](#移动端接口)
- [PC端商家接口](#pc端商家接口)
- [平台管理接口](#平台管理接口)

---

## 通用说明

### 响应格式

成功响应：
```json
{
  "success": true,
  "message": "操作成功",
  "data": {}
}
```

失败响应：
```json
{
  "success": false,
  "message": "错误信息"
}
```

### 订单状态说明
- `1` - 待付款
- `2` - 待确定（已支付，等待商家确认）
- `3` - 待入住（商家已确认）
- `4` - 已完成

### 酒店状态说明
- `0` - 已下架
- `1` - 营业中
- `2` - 待审批
- `3` - 审批拒绝

### 酒店类型说明
- `1` - 国内酒店
- `2` - 海外酒店
- `3` - 民宿酒店

---

## 移动端接口

### 1. 用户注册

**接口**: `POST /api/loginMobile/register`

**请求参数**:
```json
{
  "username": "user123",
  "password": "password123",
  "phone": "13800138000"
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "id": 1,
    "username": "user123",
    "phone": "13800138000",
    "role": 1
  }
}
```

---

### 2. 用户登录

**接口**: `POST /api/loginMobile/login`

**请求参数**:
```json
{
  "username": "user123",
  "password": "password123"
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "user123",
      "phone": "13800138000",
      "role": 1
    }
  }
}
```

---

### 3. 搜索酒店列表

**接口**: `GET /api/hotelsMobile/search`

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| destination | string | 否 | 目的地（城市名或国家名） | 重庆 |
| check_in_date | string | 否 | 入住日期 YYYY-MM-DD | 2026-02-26 |
| check_out_date | string | 否 | 离店日期 YYYY-MM-DD | 2026-02-27 |
| hotel_type | number | 否 | 酒店类型：1-国内，2-海外，3-民宿 | 1 |
| type | number | 否 | 前端类型：1-国内，2-海外，3-钟点房，4-民宿 | 1 |
| sortType | string | 否 | 排序方式：price_asc, price_desc, star_desc, score_desc | price_asc |
| keyword | string | 否 | 关键词搜索 | 豪华 |
| price_min | number | 否 | 最低价格 | 100 |
| price_max | number | 否 | 最高价格 | 500 |
| score_min | number | 否 | 最低评分 | 4.0 |
| star_min | number | 否 | 最低星级 | 3 |
| facilities | string | 否 | 设施筛选（逗号分隔） | WiFi,停车场 |
| page | number | 否 | 页码（默认1） | 1 |
| pageSize | number | 否 | 每页数量（默认10） | 10 |

**成功响应**:
```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "list": [
      {
        "id": 1,
        "name": "芒果酒店",
        "star_rating": 4,
        "location": "重庆",
        "address": "重庆南山201",
        "cover_image": "https://example.com/hotel.jpg",
        "min_price": "128.00",
        "score": 4.4,
        "review_count": 2276,
        "favorite_count": 174
      }
    ],
    "search_params": {
      "destination": "重庆",
      "check_in_date": "2026-02-26",
      "check_out_date": "2026-02-27",
      "nights": 1
    },
    "total": 10,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1
  }
}
```

---

### 4. 获取酒店详情

**接口**: `GET /api/hotelsMobile/:id`

**路径参数**:
- `id`: 酒店ID

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| check_in_date | string | 否 | 入住日期 YYYY-MM-DD | 2026-02-26 |
| check_out_date | string | 否 | 离店日期 YYYY-MM-DD | 2026-02-27 |

**说明**:
- 如果提供日期参数，返回该日期范围内的实时可用房间数
- 如果不提供日期，`available_rooms` 等于 `total_rooms`

**成功响应**:
```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "id": 1,
    "name": "芒果酒店",
    "star_rating": 4,
    "description": "位于市中心的豪华酒店",
    "hotel_facilities": "[\"WiFi\",\"停车场\",\"健身房\"]",
    "location": "重庆",
    "address": "重庆南山201",
    "brand": "芒果酒店家",
    "cover_image": "https://example.com/hotel.jpg",
    "images": "[\"https://example.com/1.jpg\"]",
    "rooms": [
      {
        "id": 1,
        "room_type": "单人床",
        "bed_type": "大床",
        "area": "25.00",
        "floor": "10-15层",
        "max_occupancy": 2,
        "base_price": "128.00",
        "total_rooms": 10,
        "available_rooms": 5,
        "facilities": "[\"WiFi\",\"空调\"]",
        "images": "[\"https://example.com/room.jpg\"]"
      }
    ]
  }
}
```

---

### 5. 创建订单

**接口**: `POST /api/orderMobile/create`

**请求参数**:
```json
{
  "hotel_id": 1,
  "room_id": 1,
  "user_id": 1,
  "check_in_date": "2026-02-26",
  "check_out_date": "2026-02-27",
  "guest_name": "张三",
  "guest_phone": "13800138000",
  "total_price": 128.00
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "订单提交成功",
  "data": {
    "id": 1,
    "order_no": "ORD17720864571971505",
    "user_id": 1,
    "hotel_id": 1,
    "room_id": 1,
    "check_in_date": "2026-02-26",
    "check_out_date": "2026-02-27",
    "nights": 1,
    "total_price": "128.00",
    "status": 1,
    "guest_name": "张三",
    "guest_phone": "13800138000"
  }
}
```

---

### 6. 支付订单

**接口**: `PUT /api/orderMobile/pay/:order_no`

**路径参数**:
- `order_no`: 订单号

**说明**:
- 将订单状态从 1（待付款）改为 2（待确定）
- 自动扣减库存（更新 room_inventory 表）
- 只有状态为 1 的订单才能支付

**成功响应**:
```json
{
  "success": true,
  "message": "付款成功",
  "data": {
    "id": 1,
    "order_no": "ORD17720864571971505",
    "status": 2,
    "updated_at": "2026-02-26T10:35:00.000Z"
  }
}
```

---

### 7. 获取订单列表

**接口**: `GET /api/orderMobile/list`

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| user_id | number | 是 | 用户ID |
| status | number | 否 | 订单状态：1-待付款，2-待确定，3-待入住，4-已完成 |

**成功响应**:
```json
{
  "success": true,
  "message": "查询成功",
  "data": {
    "total": 5,
    "orders": [
      {
        "id": 1,
        "order_no": "ORD17720864571971505",
        "hotel_name": "芒果酒店",
        "hotel_cover_image": "https://example.com/hotel.jpg",
        "room_type": "单人床",
        "room_images": "[\"https://example.com/room.jpg\"]",
        "check_in_date": "2026-02-26",
        "check_out_date": "2026-02-27",
        "nights": 1,
        "total_price": "128.00",
        "status": 2,
        "guest_name": "张三",
        "guest_phone": "13800138000"
      }
    ]
  }
}
```

---

## PC端商家接口

### 1. 商家登录

**接口**: `POST /api/loginPC/login`

**请求参数**:
```json
{
  "username": "merchant123",
  "password": "password123"
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "merchant123",
      "role": 2
    }
  }
}
```

---

### 2. 查询酒店列表

**接口**: `GET /api/hotels/search`

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| user_id | number | 是 | 商家用户ID |
| status | number | 否 | 酒店状态 |
| keyword | string | 否 | 关键词搜索 |

**成功响应**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "芒果酒店",
        "status": 1,
        "location": "重庆",
        "star_rating": 4
      }
    ]
  }
}
```

---

### 3. 新增酒店

**接口**: `POST /api/hotels`

**请求参数**:
```json
{
  "user_id": 1,
  "name": "芒果酒店",
  "english_name": "Mango Hotel",
  "brand": "芒果酒店家",
  "star_rating": 4,
  "location": "重庆市市辖区涪陵区",
  "address": "江南水岸",
  "hotel_phone": "05551234567",
  "contact": "唐经理",
  "contact_phone": "123000000",
  "description": "豪华酒店",
  "hotel_facilities": "停车场,餐厅,免费WiFi",
  "cover_image": "https://example.com/hotel.jpg",
  "images": "[\"https://example.com/1.jpg\"]",
  "hotel_type": 1
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "酒店创建成功，等待平台审核",
  "data": {
    "id": 1,
    "status": 2
  }
}
```

---

### 4. 新增房型

**接口**: `POST /api/rooms`

**请求参数**:
```json
{
  "hotel_id": 1,
  "room_type": "单人床",
  "room_type_en": "Single Room",
  "bed_type": "大床",
  "area": 25.00,
  "floor": "10-15层",
  "max_occupancy": 2,
  "base_price": 128.00,
  "total_rooms": 10,
  "facilities": "WiFi,空调,独立卫浴",
  "description": "舒适的单人房",
  "images": "[\"https://example.com/room.jpg\"]"
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "房间创建成功",
  "data": {
    "id": 1
  }
}
```

---

### 5. 获取订单列表

**接口**: `GET /api/orderPC/list`

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| user_id | number | 是 | 商家用户ID |
| status | number | 否 | 订单状态 |
| hotel_id | number | 否 | 酒店ID |

**成功响应**:
```json
{
  "success": true,
  "data": {
    "total": 10,
    "orders": [
      {
        "id": 1,
        "order_no": "ORD17720864571971505",
        "hotel_name": "芒果酒店",
        "room_type": "单人床",
        "check_in_date": "2026-02-26",
        "check_out_date": "2026-02-27",
        "status": 2,
        "total_price": "128.00"
      }
    ]
  }
}
```

---

### 6. 确认订单

**接口**: `PUT /api/orderPC/confirm/:order_no`

**路径参数**:
- `order_no`: 订单号

**请求参数**:
```json
{
  "assigned_room_no": "1001"
}
```

**说明**:
- 将订单状态从 2（待确定）改为 3（待入住）
- 分配实际房间号

**成功响应**:
```json
{
  "success": true,
  "message": "订单已确定，状态更新为待入住",
  "data": {
    "order_no": "ORD17720864571971505",
    "status": 3,
    "assigned_room_no": "1001"
  }
}
```

---

## 平台管理接口

### 1. 获取待审核酒店列表

**接口**: `GET /api/hotelsReview/list`

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| status | number | 否 | 状态：2-待审批，3-审批拒绝 |

**成功响应**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "name": "芒果酒店",
        "status": 2,
        "location": "重庆",
        "created_at": "2026-02-25T00:10:39.000Z"
      }
    ]
  }
}
```

---

### 2. 审核通过

**接口**: `PUT /api/hotelsReview/approve/:id`

**路径参数**:
- `id`: 酒店ID

**说明**:
- 将酒店状态改为 1（营业中）
- 自动为酒店的所有房型生成未来90天的库存记录

**成功响应**:
```json
{
  "success": true,
  "message": "酒店审核通过"
}
```

---

### 3. 审核拒绝

**接口**: `PUT /api/hotelsReview/reject/:id`

**路径参数**:
- `id`: 酒店ID

**请求参数**:
```json
{
  "rejection_reason": "酒店信息不完整"
}
```

**成功响应**:
```json
{
  "success": true,
  "message": "酒店审核已拒绝"
}
```

---

### 4. 获取用户列表

**接口**: `GET /api/userManage/list`

**查询参数**:
| 参数名 | 类型 | 必填 | 说明 |
|--------|------|------|------|
| role | number | 否 | 角色：1-用户，2-商家，3-管理员 |
| keyword | string | 否 | 关键词搜索 |

**成功响应**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "username": "user123",
        "phone": "13800138000",
        "role": 1,
        "created_at": "2026-02-25T00:00:00.000Z"
      }
    ]
  }
}
```

---

## 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 注意事项

1. 所有日期格式统一使用 `YYYY-MM-DD`
2. 价格字段统一使用 `decimal(10,2)` 类型
3. JSON 字符串字段（如 images、facilities）需要前端解析
4. 库存扣减在支付成功后自动执行
5. 订单自动完成任务每小时执行一次
