# 易宿酒店预订平台 - 管理后台

## 开发日志

### 2月10日（下午）
- **前后端接口对接完成**：Hotels模块已完全对接真实API（`http://47.99.56.81:3000/api/hotels/*`）
- **字段映射统一**：创建了详细的字段映射文档（FIELD_MAPPING.md），统一使用后端字段名
- **页面布局重构**：
  - 创建了通用的 PageContainer 组件，统一所有页面布局
  - 搜索栏固定在右上角，采用圆角设计
  - 添加按钮改为右下角悬浮按钮（FAB），不随页面滚动
  - Hotels 和 Rooms 页面已应用新布局
- **功能完善**：
  - 实现了酒店状态管理（上架/下架功能）
  - 新建酒店默认状态为"待审批"
  - 商户可在"营业中"和"已下架"之间切换状态
  - 图片上传优化：改为点击提交时才上传到OSS，提升用户体验
  - 修复了OSS权限问题，设置文件ACL为public-read
- **UI优化**：
  - 查看酒店详情页面采用美观的卡片布局，渐变紫色头部
  - 表格列宽优化，避免横向滚动条
  - 删除了不必要的字段显示（如状态字段）
- **组件抽取**：
  - SearchBar：通用搜索组件，支持自定义占位符和回调
  - PageContainer：通用页面容器，提供统一布局模式

### 2月10日（上午）
- 完善了前后端字段映射，写了个对照表文档
- 修复了location字段的生成逻辑，现在用城市名称了
- 给详情页和表格加了字段兼容处理，前后端字段都能正常显示
- 把地址输入改成了级联选择器，用了china-division包

### 2月9日
- 重构了rooms模块，把代码拆分了一下，之前一个文件太长了
- 实现了房间的查看、编辑、删除功能，左键点击查看详情，右键弹出菜单
- 修复了房间状态显示的bug，现在颜色能正常显示了
- 写了个代码分析报告，看了下复用情况还不错

### 2月8日
- 优化了hotels页面的样式，加了些hover效果
- 把hotels模块的代码重构了，拆成了好几个小组件
- 抽取了一些通用组件像FormSection、ImageUploader这些

### 2月7日
- 对接了后端接口，不过后端有点问题，先用假数据测试
- 实现了酒店的增删改查功能
- 加了图片上传功能，用的阿里云oss

### 2月6日
- 完成了酒店管理和房间管理的表单设计
- 房间管理用了门的样式，不同颜色代表不同状态
- 加了一些表单验证

### 2月5日
- 搭建了项目基础框架，用的react+vite
- 做了登录页面，左右分栏布局
- 实现了权限管理，分管理员和商户两个角色
- 创建了各个页面的框架，用了懒加载优化性能
- 配置了路由，按角色分了admin和merchant两个路径

## 技术栈
react、antd、vite、react-router、dayjs、china-division、ali-oss

## 后端接口
- 基础地址：`http://47.99.56.81:3000/api`
- Hotels模块：已对接真实API
- Rooms模块：已对接真实API
  - 创建房间：POST /api/rooms/create
  - 获取房间列表：GET /api/rooms/list?hotel_id={hotelId}
  - 获取房间详情：GET /api/rooms/:id
  - 更新房间：PUT /api/rooms/:id
  - 删除房间：DELETE /api/rooms/:id

## OSS配置
- Region: oss-cn-beijing
- Bucket: hotel-xiecheng
- 文件ACL: public-read

## 启动
```bash
pnpm install
pnpm dev
```

## 目录结构
```
src/
├── components/          # 组件
│   └── common/         # 通用组件
│       ├── PageContainer.jsx    # 页面容器
│       ├── SearchBar.jsx        # 搜索栏
│       ├── ImageUploader.jsx    # 图片上传
│       ├── FormSection.jsx      # 表单区块
│       └── StatusTag.jsx        # 状态标签
├── pages/              # 页面
│   ├── admin/         # 管理员页面
│   └── merchant/      # 商户页面
│       ├── Hotels/    # 酒店管理
│       └── Rooms/     # 房间管理
├── hooks/             # 自定义hooks
├── utils/             # 工具函数
├── config/            # 配置文件
├── constants/         # 常量定义
└── services/          # API服务
```

## 重要文档
- `FIELD_MAPPING.md`：酒店字段映射对照表
- `ROOM_FIELD_MAPPING.md`：房间字段映射对照表
- `OSS_CONFIG_README.md`：OSS配置说明
- `components/common/PAGE_CONTAINER_USAGE.md`：PageContainer使用指南
