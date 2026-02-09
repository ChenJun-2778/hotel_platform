# 阿里云 OSS 配置说明

## 配置步骤

### 1. 打开配置文件
编辑文件：`src/config/oss.js`

### 2. 填写你的阿里云 OSS 配置信息

```javascript
export const ossConfig = {
  region: 'oss-cn-hangzhou',           // 你的 OSS 地域
  accessKeyId: 'YOUR_ACCESS_KEY_ID',   // 你的 AccessKey ID
  accessKeySecret: 'YOUR_ACCESS_KEY_SECRET', // 你的 AccessKey Secret
  bucket: 'YOUR_BUCKET_NAME',          // 你的 Bucket 名称
};

export const ossHost = 'https://YOUR_BUCKET_NAME.oss-cn-hangzhou.aliyuncs.com';
```

### 3. 获取配置信息

#### 3.1 登录阿里云控制台
访问：https://oss.console.aliyun.com/

#### 3.2 获取 Bucket 信息
- 点击你的 Bucket 名称
- 查看 **Bucket 名称** 和 **地域节点**
- 例如：
  - Bucket 名称：`my-hotel-images`
  - 地域节点：`oss-cn-hangzhou`

#### 3.3 获取 AccessKey
- 点击右上角头像 → AccessKey 管理
- 创建 AccessKey（如果没有）
- 复制 **AccessKey ID** 和 **AccessKey Secret**

⚠️ **安全提示**：AccessKey Secret 只在创建时显示一次，请妥善保存！

#### 3.4 配置 Bucket 域名
- 在 Bucket 概览页面找到 **外网访问域名**
- 格式：`https://[bucket名称].[地域节点].aliyuncs.com`
- 例如：`https://my-hotel-images.oss-cn-hangzhou.aliyuncs.com`

### 4. 配置 Bucket 权限（重要）

#### 4.1 设置读写权限
- 进入 Bucket → 权限管理 → 读写权限
- 建议设置为：**公共读**（允许匿名用户读取文件）

#### 4.2 配置跨域规则（CORS）
- 进入 Bucket → 权限管理 → 跨域设置
- 添加规则：
  - 来源：`*`（或你的域名）
  - 允许 Methods：`GET, POST, PUT, DELETE, HEAD`
  - 允许 Headers：`*`
  - 暴露 Headers：`ETag, x-oss-request-id`
  - 缓存时间：`0`

### 5. 测试上传

1. 启动项目：`pnpm run dev`
2. 访问：`http://localhost:5173/merchant/hotels`
3. 点击"添加酒店"
4. 上传图片测试

## 文件存储结构

```
your-bucket/
├── hotels/              # 酒店图片
│   ├── 1234567890-abc123.jpg
│   └── 1234567891-def456.png
└── rooms/               # 房间图片
    ├── 1234567892-ghi789.jpg
    └── 1234567893-jkl012.png
```

## 上传限制

- **支持格式**：JPG、PNG、JPEG、WEBP
- **文件大小**：最大 5MB
- **酒店封面**：1张
- **酒店图片**：最多 8张
- **房间图片**：最多 6张

## 常见问题

### Q1: 上传失败，提示 AccessDenied
**A**: 检查 AccessKey 是否正确，Bucket 权限是否设置为公共读

### Q2: 图片上传成功但无法访问
**A**: 检查 Bucket 读写权限是否设置为"公共读"

### Q3: 跨域错误
**A**: 检查 Bucket 的 CORS 配置是否正确

### Q4: 上传速度慢
**A**: 选择离你最近的地域节点（Region）

## 安全建议

⚠️ **当前配置仅用于开发测试，生产环境请使用以下方案之一：**

1. **STS 临时凭证**（推荐）
   - 后端提供接口返回临时凭证
   - 前端使用临时凭证上传
   - 更安全，凭证有时效性

2. **后端签名**
   - 前端请求后端获取签名
   - 使用签名直接上传到 OSS

3. **后端代理上传**
   - 前端上传到后端
   - 后端转发到 OSS
   - 最安全但速度较慢

## 相关文档

- [阿里云 OSS 文档](https://help.aliyun.com/product/31815.html)
- [OSS JavaScript SDK](https://help.aliyun.com/document_detail/64041.html)
