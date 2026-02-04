# 数据库配置说明

## 配置文件位置

`config/db.config.js`

## 当前配置

```javascript
{
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123',
  database: 'hotel'
}
```

## 初始化步骤

### 1. 确认 MySQL 服务已启动

### 2. 确认数据库用户名和密码

请检查您的 MySQL 用户名和密码是否正确。

如果密码不是 `123`，请修改 `config/db.config.js` 文件中的 `password` 字段。

### 3. 运行初始化脚本

```bash
npm run db:init
```

这将：

- 自动创建 `hotel` 数据库（如果不存在）
- 创建 `hotels` 表
- 插入 3 条示例数据

### 4. 验证

初始化成功后，您可以在 MySQL 中查询：

```sql
USE hotel;
SELECT * FROM hotels;
```

## 数据库表结构

### hotels 表字段说明

| 字段名      | 类型          | 说明                     |
| ----------- | ------------- | ------------------------ |
| id          | INT           | 主键，自动递增           |
| name        | VARCHAR(255)  | 酒店名称                 |
| cover_image | VARCHAR(500)  | 酒店首页图片URL          |
| description | TEXT          | 酒店备注/描述            |
| tags        | VARCHAR(500)  | 酒店标签（逗号分隔）     |
| price       | DECIMAL(10,2) | 酒店价格（每晚）         |
| status      | TINYINT       | 状态：1-营业中，0-已下架 |
| created_at  | TIMESTAMP     | 创建时间                 |
| updated_at  | TIMESTAMP     | 更新时间                 |

## 常见问题

### Q: Access denied 错误

**原因**：用户名或密码不正确

**解决**：

1. 检查 MySQL 用户名和密码
2. 修改 `config/db.config.js` 中的配置
3. 重新运行 `npm run db:init`

### Q: 如何修改数据库密码配置？

编辑 `config/db.config.js` 文件，修改 `password` 字段即可。

### Q: 数据库已存在如何处理？

脚本会自动检测，如果数据库已存在则直接使用，不会重复创建。
