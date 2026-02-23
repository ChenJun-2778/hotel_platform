const express = require("express");
const app = express();
const PORT = 3000;
const { testConnection, query } = require("./config/database");
const hotelsRouter = require("./routes/hotels");
const roomsRouter = require("./routes/rooms");
const loginPCRouter = require("./routes/loginPC");
const hotelsReviewRouter = require("./routes/hotelsReview");
const orderPCRouter = require("./routes/orderPC");
const controlPCRouter = require("./routes/controlPC");

// 移动端
const loginMobileRouter = require("./routes/loginMobile");
const hotelsMobileRouter = require("./routes/hotelsMobile");
const orderMobileRouter = require("./routes/orderMobile");
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
app.use("/api/rooms", roomsRouter);
app.use("/api/loginPC", loginPCRouter);
app.use("/api/hotelsReview", hotelsReviewRouter);
app.use("/api/orderPC", orderPCRouter);
app.use("/api/controlPC", controlPCRouter);

// 移动端 API 路由
app.use("/api/loginMobile", loginMobileRouter);
app.use("/api/hotelsMobile", hotelsMobileRouter);
app.use("/api/orderMobile", orderMobileRouter);

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

// ── 定时任务：自动完成订单 ───────────────────────────────────────
// 规则：退房日期（check_out_date）已到期 且 status = 3（待入住） → 自动改为 4（已完成）
async function autoCompleteOrders() {
  try {
    const result = await query(
      `UPDATE orders
       SET status = 4
       WHERE status = 3
         AND check_out_date <= CURDATE()`
    );
    if (result.affectedRows > 0) {
      console.log(`[定时任务] 自动完成订单：共更新 ${result.affectedRows} 条订单 → 已完成`);
    }
  } catch (error) {
    console.error('[定时任务] 自动完成订单失败:', error.message);
  }
}

// 启动服务器
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`========================================`);
  console.log(`🚀 服务器已启动！`)
  
  // 测试数据库连接
  console.log('\n🔍 检查数据库连接...');
  await testConnection();
  console.log('');

  // 启动后立即执行一次，然后每小时轮询
  await autoCompleteOrders();
  setInterval(autoCompleteOrders, 60 * 60 * 1000); // 每小时执行一次
  console.log('⏰ 订单自动完成定时任务已启动（每小时检查一次）');
});

