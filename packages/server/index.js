const express = require("express");
const app = express();
const PORT = 3000;
const { testConnection } = require("./config/database");
const hotelsRouter = require("./routes/hotels");

// 中间件 - 解析 JSON 请求体
app.use(express.json());

// 中间件 - 解析 URL 编码的请求体
app.use(express.urlencoded({ extended: true }));

// CORS 中间件（允许跨域）
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// 日志中间件
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API 路由
app.use("/api/hotels", hotelsRouter);

// 根路由 - API 信息
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "酒店平台 API 服务器正在运行",
    version: "1.0.0",
    endpoints: [
      { 
        path: "/api/hotels/search", 
        method: "GET", 
        description: "搜索酒店",
        params: "location, keyword, starRating, minPrice, maxPrice, page, pageSize"
      },
      { 
        path: "/api/hotels/:id", 
        method: "GET", 
        description: "获取酒店详情" 
      },
      { 
        path: "/api/hotels/cities/popular", 
        method: "GET", 
        description: "获取热门城市列表" 
      }
    ]
  });
});

// 健康检查路由
app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "未找到请求的资源",
    path: req.url
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error("服务器错误:", err);
  res.status(500).json({
    success: false,
    message: "服务器内部错误",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// 启动服务器
app.listen(PORT, "127.0.0.1", async () => {
  console.log(`========================================`);
  console.log(`🚀 服务器已启动！`);
  console.log(`📍 地址: http://127.0.0.1:${PORT}`);
  console.log(`📋 API文档: http://127.0.0.1:${PORT}`);
  console.log(`🏨 酒店搜索: http://127.0.0.1:${PORT}/api/hotels/search`);
  console.log(`⏰ 启动时间: ${new Date().toLocaleString("zh-CN")}`);
  console.log(`========================================`);
  
  // 测试数据库连接
  console.log('\n🔍 检查数据库连接...');
  await testConnection();
  console.log('');
});

