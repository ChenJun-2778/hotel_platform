# 易宿酒店预订平台 - 管理端后端接口需求文档

## 1. 概述

本文档定义了易宿酒店预订平台管理端所需的后端接口、数据表结构和字段说明。

**后端 API 基础地址**: `http://47.99.56.81:3000/api`

**管理端已实现功能模块**:
- 酒店审核管理
- 用户管理
- 数据统计
- 个人信息管理
- 控制台首页

---

## 2. 数据表结构

### 2.1 用户表 (users)

| 字段名 | 类型 | 长度 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|------|
| id | INT | - | 是 | 用户ID（主键，自增） | 1 |
| username | VARCHAR | 50 | 是 | 用户名（唯一） | admin |
| password | VARCHAR | 255 | 是 | 密码（加密存储） | $2b$10$... |
| real_name | VARCHAR | 50 | 否 | 真实姓名 | 张三 |
| email | VARCHAR | 100 | 否 | 邮箱 | admin@example.com |
| phone | VARCHAR | 20 | 否 | 手机号 | 13800138000 |
| avatar | VARCHAR | 500 | 否 | 头像URL | https://... |
| role | ENUM | - | 是 | 角色：admin/merchant/user | admin |
| status | TINYINT | - | 是 | 状态：1=启用，0=禁用 | 1 |
| created_at | DATETIME | - | 是 | 创建时间 | 2026-01-15 10:30:00 |
| updated_at | DATETIME | - | 是 | 更新时间 | 2026-02-13 14:20:00 |
| last_login_at | DATETIME | - | 否 | 最后登录时间 | 2026-02-13 09:15:00 |

**索引**:
- PRIMARY KEY: id
- UNIQUE KEY: username
- INDEX: email, role, status

---

### 2.2 酒店表 (hotels)

| 字段名 | 类型 | 长度 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|------|
| id | INT | - | 是 | 酒店ID（主键，自增） | 1 |
| merchant_id | INT | - | 是 | 商户ID（外键关联users.id） | 5 |
| name | VARCHAR | 100 | 是 | 酒店名称 | 易宿豪华酒店 |
| english_name | VARCHAR | 100 | 否 | 英文名称 | Yisu Luxury Hotel |
| brand | VARCHAR | 100 | 否 | 品牌 | 易宿连锁 |
| star_rating | TINYINT | - | 是 | 星级：1-5 | 5 |
| room_number | INT | - | 是 | 房间总数 | 120 |
| location | VARCHAR | 200 | 是 | 所在区域（省市区） | 浙江省杭州市西湖区 |
| address | VARCHAR | 200 | 是 | 详细地址 | 文三路123号 |
| hotel_phone | VARCHAR | 20 | 是 | 酒店电话 | 0571-12345678 |
| contact | VARCHAR | 50 | 是 | 联系人 | 张经理 |
| contact_phone | VARCHAR | 20 | 是 | 联系电话 | 13800138000 |
| hotel_facilities | TEXT | - | 否 | 酒店设施（逗号分隔） | 免费WiFi,停车场,餐厅 |
| check_in_time | DATETIME | - | 是 | 入住时间 | 2026-02-10 14:00:00 |
| check_out_time | DATETIME | - | 是 | 退房时间 | 2026-02-12 12:00:00 |
| description | TEXT | - | 否 | 酒店描述 | 位于市中心... |
| cover_image | VARCHAR | 500 | 否 | 封面图片URL | https://... |
| images | TEXT | - | 否 | 图片列表（JSON数组字符串） | ["https://..."] |
| status | TINYINT | - | 是 | 状态：0=待审核，1=已通过，2=已拒绝 | 1 |
| reject_reason | TEXT | - | 否 | 拒绝原因 | 资质不全 |
| created_at | DATETIME | - | 是 | 创建时间 | 2026-01-15 10:30:00 |
| updated_at | DATETIME | - | 是 | 更新时间 | 2026-02-13 14:20:00 |

**索引**:
- PRIMARY KEY: id
- INDEX: merchant_id, status, location

**注意**:
- `location` 字段存储完整的省市区信息，如"浙江省杭州市西湖区"或"上海"
- `check_in_time` 和 `check_out_time` 存储完整的日期时间，前端只显示时间部分
- `created_at` 和 `updated_at` 由数据库自动管理

---

### 2.3 统计数据表 (statistics)

| 字段名 | 类型 | 长度 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|------|
| id | INT | - | 是 | 统计ID（主键，自增） | 1 |
| stat_date | DATE | - | 是 | 统计日期 | 2026-02-13 |
| total_orders | INT | - | 是 | 订单总数 | 150 |
| completed_orders | INT | - | 是 | 完成订单数 | 135 |
| cancelled_orders | INT | - | 是 | 取消订单数 | 15 |
| total_revenue | DECIMAL | 10,2 | 是 | 总收入（元） | 125000.00 |
| total_users | INT | - | 是 | 用户总数 | 1182 |
| new_users | INT | - | 是 | 新增用户数 | 26 |
| total_merchants | INT | - | 是 | 商户总数 | 95 |
| new_merchants | INT | - | 是 | 新增商户数 | 2 |
| created_at | DATETIME | - | 是 | 创建时间 | 2026-02-13 23:59:59 |

**索引**:
- PRIMARY KEY: id
- UNIQUE KEY: stat_date

---

### 2.4 酒店收入统计表 (hotel_revenue)

| 字段名 | 类型 | 长度 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|------|
| id | INT | - | 是 | 统计ID（主键，自增） | 1 |
| hotel_id | INT | - | 是 | 酒店ID（外键） | 5 |
| hotel_name | VARCHAR | 100 | 是 | 酒店名称 | 豪华大酒店 |
| stat_date | DATE | - | 是 | 统计日期 | 2026-02-13 |
| revenue | DECIMAL | 10,2 | 是 | 收入（元） | 12500.00 |
| order_count | INT | - | 是 | 订单数 | 25 |
| created_at | DATETIME | - | 是 | 创建时间 | 2026-02-13 23:59:59 |

**索引**:
- PRIMARY KEY: id
- INDEX: hotel_id, stat_date

---

### 2.5 酒店入住率统计表 (hotel_occupancy)

| 字段名 | 类型 | 长度 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|------|
| id | INT | - | 是 | 统计ID（主键，自增） | 1 |
| hotel_id | INT | - | 是 | 酒店ID（外键） | 5 |
| hotel_name | VARCHAR | 100 | 是 | 酒店名称 | 豪华大酒店 |
| stat_date | DATE | - | 是 | 统计日期 | 2026-02-13 |
| total_rooms | INT | - | 是 | 总房间数 | 120 |
| occupied_rooms | INT | - | 是 | 已入住房间数 | 102 |
| occupancy_rate | DECIMAL | 5,2 | 是 | 入住率（%） | 85.00 |
| created_at | DATETIME | - | 是 | 创建时间 | 2026-02-13 23:59:59 |

**索引**:
- PRIMARY KEY: id
- INDEX: hotel_id, stat_date

---

## 3. 接口定义

### 3.1 用户管理接口

#### 3.1.1 获取用户列表
```
GET /api/users/list
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| page | INT | 否 | 页码（默认1） | 1 |
| pageSize | INT | 否 | 每页数量（默认10） | 10 |
| keyword | STRING | 否 | 搜索关键词（用户名/邮箱） | admin |
| role | STRING | 否 | 角色筛选 | admin |
| status | INT | 否 | 状态筛选 | 1 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "username": "admin",
        "real_name": "管理员",
        "email": "admin@example.com",
        "phone": "13800138000",
        "avatar": "https://...",
        "role": "admin",
        "status": 1,
        "created_at": "2026-01-15 10:30:00",
        "last_login_at": "2026-02-13 09:15:00"
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

---

#### 3.1.2 创建用户
```
POST /api/users/create
```

**请求体**:
```json
{
  "username": "newuser",
  "password": "123456",
  "real_name": "新用户",
  "email": "newuser@example.com",
  "phone": "13900139000",
  "role": "merchant",
  "status": 1
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "用户创建成功",
  "data": {
    "id": 101,
    "username": "newuser"
  }
}
```

---

#### 3.1.3 更新用户
```
PUT /api/users/:id
```

**请求体**:
```json
{
  "real_name": "更新姓名",
  "email": "updated@example.com",
  "phone": "13900139000",
  "status": 1
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "用户更新成功"
}
```

---

#### 3.1.4 删除用户
```
DELETE /api/users/:id
```

**响应示例**:
```json
{
  "success": true,
  "message": "用户删除成功"
}
```

---

### 3.2 酒店审核接口

#### 3.2.1 获取酒店列表（用于审核）
```
GET /api/hotels/list
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| page | INT | 否 | 页码（默认1） | 1 |
| pageSize | INT | 否 | 每页数量（默认10） | 10 |
| keyword | STRING | 否 | 搜索关键词（酒店名称） | 易宿 |
| status | INT | 否 | 状态筛选：0=待审核，1=已通过，2=已拒绝 | 0 |

**响应示例**:
```json
{
  "success": true,
  "data": {
    "list": [
      {
        "id": 1,
        "merchant_id": 5,
        "merchant_name": "张三商户",
        "name": "易宿豪华酒店",
        "star_rating": 5,
        "contact_phone": "0571-12345678",
        "location": "浙江省杭州市西湖区文三路123号",
        "status": 0,
        "reject_reason": null,
        "created_at": "2026-01-15 10:30:00"
      }
    ],
    "total": 50,
    "page": 1,
    "pageSize": 10
  }
}
```

**注意**: 需要关联 users 表获取 merchant_name（商户名称）

---

#### 3.2.2 获取酒店详情
```
GET /api/hotels/:id
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "merchant_id": 5,
    "merchant_name": "张三商户",
    "name": "易宿豪华酒店",
    "english_name": "Yisu Luxury Hotel",
    "brand": "易宿连锁",
    "star_rating": 5,
    "room_number": 120,
    "location": "浙江省杭州市西湖区文三路123号",
    "country": "中国",
    "province": "浙江省",
    "city": "杭州市",
    "district": "西湖区",
    "address": "文三路123号",
    "hotel_phone": "0571-12345678",
    "contact": "张经理",
    "contact_phone": "13800138000",
    "hotel_facilities": "免费WiFi,停车场,餐厅,健身房,游泳池",
    "check_in_time": "2000-01-01 14:00:00",
    "check_out_time": "2000-01-01 12:00:00",
    "description": "位于市中心，交通便利...",
    "cover_image": "https://...",
    "images": "[\"https://...\",\"https://...\"]",
    "status": 0,
    "reject_reason": null,
    "created_at": "2026-01-15 10:30:00",
    "updated_at": "2026-02-13 14:20:00"
  }
}
```

---

#### 3.2.3 审核通过酒店
```
PUT /api/hotels/:id/approve
```

**请求体**: 无

**响应示例**:
```json
{
  "success": true,
  "message": "酒店审核通过"
}
```

**说明**: 将酒店 status 更新为 1（已通过）

---

#### 3.2.4 审核拒绝酒店
```
PUT /api/hotels/:id/reject
```

**请求体**:
```json
{
  "reason": "酒店资质不全，缺少消防许可证"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "酒店审核已拒绝"
}
```

**说明**: 
- 将酒店 status 更新为 2（已拒绝）
- 保存 reject_reason（拒绝原因）

---

### 3.3 数据统计接口

#### 3.3.1 获取订单趋势数据
```
GET /api/statistics/order-trend
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| start_date | DATE | 是 | 开始日期 | 2026-02-01 |
| end_date | DATE | 是 | 结束日期 | 2026-02-13 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-02-05",
      "total_orders": 45,
      "completed_orders": 38,
      "cancelled_orders": 7
    },
    {
      "date": "2026-02-06",
      "total_orders": 52,
      "completed_orders": 45,
      "cancelled_orders": 7
    }
  ]
}
```

---

#### 3.3.2 获取收入统计数据
```
GET /api/statistics/revenue
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| start_date | DATE | 是 | 开始日期 | 2026-02-01 |
| end_date | DATE | 是 | 结束日期 | 2026-02-13 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "hotel_name": "豪华大酒店",
      "revenue": 125000.00
    },
    {
      "hotel_name": "舒适商务酒店",
      "revenue": 89000.00
    }
  ]
}
```

**说明**: 返回指定时间范围内各酒店的收入汇总

---

#### 3.3.3 获取入住率统计数据
```
GET /api/statistics/occupancy
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| start_date | DATE | 是 | 开始日期 | 2026-02-01 |
| end_date | DATE | 是 | 结束日期 | 2026-02-13 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "hotel_name": "豪华大酒店",
      "occupancy_rate": 85.00
    },
    {
      "hotel_name": "舒适商务酒店",
      "occupancy_rate": 78.00
    }
  ]
}
```

**说明**: 返回指定时间范围内各酒店的平均入住率

---

#### 3.3.4 获取用户增长数据
```
GET /api/statistics/user-growth
```

**请求参数**:
| 参数名 | 类型 | 必填 | 说明 | 示例 |
|--------|------|------|------|------|
| start_date | DATE | 是 | 开始日期 | 2026-02-01 |
| end_date | DATE | 是 | 结束日期 | 2026-02-13 |

**响应示例**:
```json
{
  "success": true,
  "data": [
    {
      "date": "2026-02-05",
      "total_users": 1050,
      "total_merchants": 85
    },
    {
      "date": "2026-02-06",
      "total_users": 1068,
      "total_merchants": 86
    }
  ]
}
```

---

#### 3.3.5 获取控制台首页统计数据
```
GET /api/statistics/dashboard
```

**请求参数**: 无

**响应示例**:
```json
{
  "success": true,
  "data": {
    "total_users": 1182,
    "total_hotels": 93,
    "pending_audits": 12,
    "total_revenue": 93280.00
  }
}
```

**说明**: 返回控制台首页需要的汇总数据

---

### 3.4 个人信息接口

#### 3.4.1 获取当前用户信息
```
GET /api/users/profile
```

**请求头**:
```
Authorization: Bearer <token>
```

**响应示例**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "admin",
    "real_name": "管理员",
    "email": "admin@example.com",
    "phone": "13800138000",
    "avatar": "https://...",
    "role": "admin",
    "created_at": "2026-01-01 10:00:00",
    "last_login_at": "2026-02-13 09:15:00"
  }
}
```

---

#### 3.4.2 更新个人信息
```
PUT /api/users/profile
```

**请求体**:
```json
{
  "real_name": "新姓名",
  "email": "newemail@example.com",
  "phone": "13900139000"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "个人信息更新成功"
}
```

---

#### 3.4.3 修改密码
```
PUT /api/users/change-password
```

**请求体**:
```json
{
  "old_password": "oldpass123",
  "new_password": "newpass456"
}
```

**响应示例**:
```json
{
  "success": true,
  "message": "密码修改成功"
}
```

---

#### 3.4.4 上传头像
```
POST /api/users/upload-avatar
```

**请求体**: FormData
```
avatar: <file>
```

**响应示例**:
```json
{
  "success": true,
  "message": "头像上传成功",
  "data": {
    "avatar_url": "https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/avatars/..."
  }
}
```

**说明**: 
- 后端接收文件后上传到 OSS
- 返回 OSS 文件 URL
- 自动更新用户表的 avatar 字段

---

## 4. 通用规范

### 4.1 响应格式

所有接口统一返回格式：

**成功响应**:
```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

**失败响应**:
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误描述"
}
```

### 4.2 HTTP 状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（未登录） |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 4.3 身份验证

所有接口（除登录接口外）都需要在请求头中携带 Token：

```
Authorization: Bearer <token>
```

### 4.4 分页参数

列表接口统一使用以下分页参数：

| 参数名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| page | INT | 1 | 当前页码 |
| pageSize | INT | 10 | 每页数量 |

### 4.5 时间格式

- 数据库存储：`DATETIME` 类型
- 接口传输：`YYYY-MM-DD HH:mm:ss` 格式字符串
- 入住/退房时间：使用固定日期 `2000-01-01 HH:mm:ss`，前端只显示时间部分

### 4.6 图片上传

- 上传到阿里云 OSS
- Region: `oss-cn-beijing`
- Bucket: `hotel-xiecheng`
- 路径格式：
  - 酒店图片：`hotels/{timestamp}-{random}.{ext}`
  - 用户头像：`avatars/{timestamp}-{random}.{ext}`

---

## 5. 数据字典

### 5.1 用户角色 (role)

| 值 | 说明 |
|----|------|
| admin | 平台管理员 |
| merchant | 酒店商户 |
| user | 普通用户 |

### 5.2 用户状态 (status)

| 值 | 说明 |
|----|------|
| 1 | 启用 |
| 0 | 禁用 |

### 5.3 酒店状态 (status)

| 值 | 说明 |
|----|------|
| 0 | 待审核 |
| 1 | 已通过 |
| 2 | 已拒绝 |

### 5.4 酒店星级 (star_rating)

| 值 | 说明 |
|----|------|
| 1 | 一星级 |
| 2 | 二星级 |
| 3 | 三星级 |
| 4 | 四星级 |
| 5 | 五星级 |

---

## 6. 注意事项

1. **字段命名**: 后端使用下划线命名（snake_case），如 `star_rating`、`contact_phone`
2. **时间处理**: 入住/退房时间存储完整 datetime，但只使用时间部分，日期固定为 `2000-01-01`
3. **图片字段**: `images` 字段存储 JSON 数组字符串，如 `["url1","url2"]`
4. **关联查询**: 酒店列表需要关联 users 表获取商户名称（merchant_name）
5. **统计数据**: 建议使用定时任务每天凌晨生成统计数据，提高查询性能
6. **权限控制**: 管理员可以访问所有接口，商户只能访问自己的数据
7. **数据验证**: 后端需要验证必填字段、数据格式、数据范围等
8. **错误处理**: 返回友好的错误提示信息，便于前端展示

---

## 7. 开发优先级

### 高优先级（必须实现）
1. 用户管理接口（CRUD）
2. 酒店审核接口（列表、详情、审核通过/拒绝）
3. 个人信息接口（查看、更新、修改密码）
4. 控制台首页统计接口

### 中优先级（建议实现）
1. 数据统计接口（订单趋势、收入统计）
2. 头像上传接口

### 低优先级（可选实现）
1. 数据统计接口（入住率、用户增长）
2. 高级搜索和筛选功能

---

**文档版本**: v1.0  
**最后更新**: 2026-02-13  
**维护人**: 前端开发团队
