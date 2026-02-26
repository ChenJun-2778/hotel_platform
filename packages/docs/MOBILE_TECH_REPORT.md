# 📱 酒店预订系统 - Mobile 端技术汇报

## 一、项目概述

### 1.1 项目背景
本项目是一个完整的酒店预订移动端应用，支持国内酒店、海外酒店、钟点房和民宿四种业务类型。用户可以通过该应用搜索酒店、查看详情、在线预订并管理订单。

### 1.2 技术选型
- **前端框架**: React 19 + TypeScript
- **UI 组件库**: Ant Design Mobile 5.x
- **路由管理**: React Router DOM 7.x
- **HTTP 客户端**: Axios
- **构建工具**: Vite 7.x
- **样式方案**: CSS Modules
- **动画库**: Framer Motion
- **日期处理**: Day.js
- **拼音匹配**: pinyin-match

---

## 二、核心技术要点

### 2.1 项目架构设计

#### 📁 目录结构设计
mobile/src/ ├── api/ # API 接口层（按业务模块划分） │ ├── Hotel/ # 酒店相关接口 │ ├── Order/ # 订单相关接口 │ └── User/ # 用户相关接口 ├── components/ # 公共组件 │ ├── MainLayout/ # 主布局（含底部导航） │ ├── HotelCard/ # 酒店卡片 │ ├── DateRangePicker/ # 日期选择器 │ └── AuthRoute/ # 路由鉴权 ├── pages/ # 页面组件 │ ├── Home/ # 首页（含4个子频道） │ ├── List/ # 酒店列表页 │ ├── Detail/ # 酒店详情页 │ ├── CitySelect/ # 城市选择页 │ ├── OrderFill/ # 订单填写页 │ ├── OrderList/ # 订单列表页 │ └── User/ # 个人中心 ├── utils/ # 工具函数 ├── mock/ # Mock 数据 └── router/ # 路由配置


**设计思路**：
- **分层架构**：API 层、组件层、页面层、工具层清晰分离
- **模块化**：按业务功能划分模块，便于维护和扩展
- **组件复用**：抽离公共组件，提高代码复用率

---

### 2.2 路由架构

#### 🔀 嵌套路由设计

**核心思路**：
1. **主布局路由**：包含底部 TabBar 的页面（首页、订单、我的）
2. **独立页面路由**：不需要底部导航的全屏页面（登录、详情、列表等）
3. **子路由嵌套**：首页内部的 4 个频道、城市选择的国内/海外切换

```typescript
// 路由结构示例
{
  path: '/',
  element: <MainLayout />,  // 带底部导航
  children: [
    {
      path: '',
      element: <Home />,
      children: [
        { path: 'domestic', element: <Domestic /> },  // 国内酒店
        { path: 'overseas', element: <Overseas /> },  // 海外酒店
        { path: 'hourly', element: <Hourly /> },      // 钟点房
        { path: 'inn', element: <Inn /> }             // 民宿
      ]
    },
    { path: 'order-list', element: <OrderList /> },
    { path: 'user', element: <User /> }
  ]
}
技术亮点：

使用 <Outlet /> 实现嵌套路由渲染
路由鉴权组件 <AuthRoute> 保护需要登录的页面
404 兜底路由自动重定向到首页
2.3 状态管理方案
📊 状态管理策略
采用 React Hooks + URL 状态管理，不引入额外的状态管理库：

本地状态：使用 useState 管理组件内部状态
URL 状态：使用 useSearchParams 管理页面间共享的状态
持久化状态：使用 localStorage 存储用户信息和 Token
// URL 状态管理示例
const [searchParams, setSearchParams] = useSearchParams();
const city = searchParams.get('city') || '上海';
const beginDate = searchParams.get('beginDate') || dayjs().format('YYYY-MM-DD');

// 更新 URL 状态
setSearchParams({
  city: newCity,
  beginDate: newBeginDate,
  endDate: newEndDate
});
优势：

URL 即状态，刷新页面不丢失
支持浏览器前进/后退
便于分享和收藏
无需额外的状态管理库
2.4 网络请求封装
🌐 Axios 拦截器设计
核心功能：

请求拦截：自动添加 JWT Token
响应拦截：统一处理业务错误和 HTTP 错误
错误提示：自动弹出 Toast 提示
// 请求拦截器
request.interceptors.request.use(config => {
  const token = localStorage.getItem('TOKEN');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.success === false) {
      Toast.show({ icon: 'fail', content: res.message });
      return Promise.reject(new Error(res.message));
    }
    return res;
  },
  error => {
    // 统一处理 HTTP 错误
    if (error.response?.status === 401) {
      localStorage.clear();
      // 跳转登录
    }
    return Promise.reject(error);
  }
);
技术亮点：

统一的错误处理机制
自动 Token 注入
业务错误和 HTTP 错误分离处理
2.5 智能城市搜索
🔍 拼音搜索实现
核心功能：

支持中文、拼音、拼音首字母搜索
支持省份名搜索（返回该省所有城市）
实时搜索，无需点击搜索按钮
import PinyinMatch from 'pinyin-match';

// 搜索过滤逻辑
const filteredCities = useMemo(() => {
  if (!keyword) return allCities;
  
  const result = [];
  const matchedCities = new Set();
  
  // 1. 匹配省份名
  Object.entries(provinceMap).forEach(([province, cities]) => {
    if (PinyinMatch.match(province, keyword)) {
      cities.forEach(city => matchedCities.add(city));
    }
  });
  
  // 2. 匹配城市名
  allCities.forEach(city => {
    if (matchedCities.has(city) || PinyinMatch.match(city, keyword)) {
      result.push(city);
    }
  });
  
  return result;
}, [keyword]);
技术亮点：

使用 useMemo 优化性能，避免重复计算
支持多种搜索方式（中文/拼音/首字母）
省份级联搜索，提升用户体验
2.6 实时库存管理
📦 库存查询与显示
核心逻辑：

酒店详情页传递日期参数到后端
后端查询 room_inventory 表，返回指定日期范围内的最小可用房间数
前端根据库存数量显示不同状态
// API 调用
const res = await apiGetHotelDetail(id, beginDate, endDate);

// 库存状态判断
const availableRooms = room.available_rooms ?? room.total_rooms ?? 0;
const isSoldOut = availableRooms === 0;
const isLowStock = availableRooms > 0 && availableRooms <= 2;

// UI 显示
{isSoldOut ? '无房间' : (
  isLowStock ? (
    <>
      <FireFill /> 仅剩{availableRooms}间
    </>
  ) : '预订'
)}
技术亮点：

实时库存查询，避免超卖
低库存提示，增加紧迫感
售罄状态禁用预订按钮
2.7 订单流程设计
💳 完整的订单流程
流程图：

选择房型 → 填写订单 → 创建订单(status=1) → 支付订单(status=2) → 扣减库存 → 支付结果页
核心代码：

// 1. 创建订单
const orderRes = await apiCreateOrder({
  hotel_id, room_id, user_id,
  check_in_date, check_out_date,
  guest_name, guest_phone, total_price
});

// 2. 支付订单（自动扣减库存）
const payRes = await apiPayOrder(order_no);

// 3. 跳转支付结果页
navigate(`/payment-result?success=true&order_no=${order_no}`);
技术亮点：

订单状态流转清晰
支付成功后自动扣减库存
防止恶意占用库存（创建订单不扣库存）
2.8 组件化设计
🧩 公共组件抽离
核心组件：

HotelCard（酒店卡片）

展示酒店基本信息
支持文字展开/收起
点击跳转详情页
DateRangePicker（日期选择器）

自定义日期范围选择
支持最小/最大日期限制
计算住宿天数
AuthRoute（路由鉴权）

保护需要登录的页面
自动跳转登录页
登录后返回原页面
MainLayout（主布局）

底部 TabBar 导航
路由高亮显示
统一的页面容器
设计原则：

单一职责：每个组件只做一件事
高内聚低耦合：组件独立，通过 props 通信
可复用性：组件可在多个页面使用
三、项目构建思路
3.1 需求分析阶段
📋 功能需求梳理
核心功能模块：

用户模块：注册、登录、个人中心
酒店模块：搜索、列表、详情、筛选、排序
订单模块：创建订单、支付、订单列表
城市模块：城市选择、定位、搜索
业务流程：

用户登录 → 选择城市 → 搜索酒店 → 查看详情 → 选择房型 → 填写订单 → 支付 → 查看订单
3.2 技术选型阶段
🛠 技术栈选择依据
技术	选择理由
React 19	最新版本，性能优化，Hooks API 成熟
TypeScript	类型安全，减少运行时错误，提升开发效率
Ant Design Mobile	组件丰富，移动端适配好，文档完善
Vite	构建速度快，开发体验好，配置简单
CSS Modules	样式隔离，避免全局污染
Axios	功能强大，拦截器机制完善
3.3 架构设计阶段
🏗 系统架构设计
分层架构：

┌─────────────────────────────────┐
│      Presentation Layer         │  页面组件层
│  (Pages + Components)           │
├─────────────────────────────────┤
│      Business Logic Layer       │  业务逻辑层
│  (Hooks + Utils)                │
├─────────────────────────────────┤
│      Data Access Layer          │  数据访问层
│  (API + Request)                │
├─────────────────────────────────┤
│      Backend API                │  后端接口
└─────────────────────────────────┘
数据流设计：

用户操作 → 触发事件 → 调用 API → 更新状态 → 重新渲染
3.4 开发实施阶段
👨‍💻 开发流程
1. 基础搭建

初始化项目（Vite + React + TypeScript）
配置路由（React Router）
封装 Axios 请求
搭建主布局
2. 页面开发

首页（4个频道）
城市选择页（拼音搜索）
酒店列表页（筛选排序）
酒店详情页（实时库存）
订单流程页（填写、支付、列表）
3. 功能完善

路由鉴权
错误处理
加载状态
空状态处理
4. 优化调试

性能优化（懒加载、防抖节流）
样式优化（响应式、动画）
兼容性测试
Bug 修复
3.5 核心功能实现
🎯 关键功能实现思路
1. 首页多频道切换

// 使用 CapsuleTabs + 嵌套路由实现
<CapsuleTabs activeKey={activeTab} onChange={handleTabChange}>
  <CapsuleTabs.Tab title='国内' key='domestic' />
  <CapsuleTabs.Tab title='海外' key='overseas' />
  <CapsuleTabs.Tab title='钟点房' key='hourly' />
  <CapsuleTabs.Tab title='民宿' key='inn' />
</CapsuleTabs>
<Outlet context={{ city, beginDate, endDate }} />
2. 酒店列表筛选排序

// 筛选条件状态管理
const [sortType, setSortType] = useState('def');
const [priceRange, setPriceRange] = useState([0, 1000]);
const [filterScore, setFilterScore] = useState('');

// 构建请求参数
const params = {
  destination: city,
  check_in_date: beginDate,
  check_out_date: endDate,
  sortType,
  price_min: priceRange[0],
  price_max: priceRange[1],
  score_min: filterScore
};

// 调用 API
const res = await apiGetHotelList(params);
3. 实时库存查询

// 传递日期参数
const res = await apiGetHotelDetail(id, beginDate, endDate);

// 后端 SQL 查询
SELECT r.*, MIN(ri.available_rooms) AS available_rooms
FROM rooms r
LEFT JOIN room_inventory ri
  ON ri.room_id = r.id
  AND ri.date >= ? AND ri.date < ?
WHERE r.hotel_id = ?
GROUP BY r.id
4. 订单支付流程

// 创建订单（不扣库存）
const order = await apiCreateOrder(orderData);

// 支付订单（扣减库存）
await apiPayOrder(order_no);

// 后端扣减库存
UPDATE room_inventory
SET available_rooms = GREATEST(available_rooms - 1, 0)
WHERE room_id = ? AND date >= ? AND date < ?
四、技术难点与解决方案
4.1 难点一：城市搜索性能优化
问题：城市数据量大（300+），实时搜索卡顿

解决方案：

使用 useMemo 缓存搜索结果
使用 pinyin-match 库提升匹配速度
虚拟列表优化渲染性能
const filteredCities = useMemo(() => {
  // 搜索逻辑
}, [keyword]); // 只在 keyword 变化时重新计算
4.2 难点二：日期选择器跨月选择
问题：需要支持跨月选择，且计算住宿天数

解决方案：

使用 Day.js 处理日期计算
自定义日期选择器组件
限制最小/最大日期范围
const nightCount = dayjs(endDate).diff(dayjs(beginDate), 'day');
4.3 难点三：库存实时更新
问题：多用户同时预订，如何避免超卖

解决方案：

后端查询 room_inventory 表获取实时库存
支付成功后立即扣减库存
使用数据库事务保证原子性
UPDATE room_inventory
SET available_rooms = GREATEST(available_rooms - 1, 0)
WHERE room_id = ? AND date >= ? AND date < ?
4.4 难点四：路由状态管理
问题：页面间参数传递复杂，刷新丢失状态

解决方案：

使用 URL 参数管理状态
关键信息存储到 localStorage
使用 useSearchParams 读写 URL 参数
const [searchParams, setSearchParams] = useSearchParams();
const city = searchParams.get('city') || localStorage.getItem('HOME_CITY');
五、性能优化
5.1 代码层面优化
路由懒加载
const Home = lazy(() => import('@/pages/Home'));
图片懒加载
<Image src={hotel.cover_image} lazy fit='cover' />
防抖节流
const handleSearch = debounce((keyword) => {
  // 搜索逻辑
}, 300);
useMemo 缓存计算
const filteredList = useMemo(() => {
  return list.filter(/* ... */);
}, [list, filters]);
5.2 构建层面优化
代码分割
// vite.config.ts
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'antd-mobile': ['antd-mobile']
      }
    }
  }
}
压缩优化
build: {
  minify: 'terser',
  terserOptions: {
    compress: {
      drop_console: true
    }
  }
}
六、项目亮点总结
6.1 技术亮点
✅ TypeScript 全面应用：类型安全，减少 Bug
✅ 组件化设计：高复用性，易维护
✅ 智能搜索：支持拼音、首字母、省份搜索
✅ 实时库存：避免超卖，提升用户体验
✅ 路由鉴权：保护敏感页面
✅ 统一错误处理：Axios 拦截器统一处理
✅ 性能优化：懒加载、防抖、缓存
6.2 业务亮点
✅ 多业务类型：支持国内、海外、钟点房、民宿
✅ 完整订单流程：从搜索到支付一站式服务
✅ 智能筛选排序：多维度筛选，满足不同需求
✅ 低库存提示：增加紧迫感，提升转化率
✅ 移动端适配：完美适配各种屏幕尺寸
七、未来优化方向
7.1 功能扩展
 添加酒店收藏功能
 添加酒店评价功能
 添加优惠券系统
 添加积分系统
 添加分享功能
7.2 技术优化
 引入 PWA，支持离线访问
 使用 Service Worker 缓存静态资源
 引入骨架屏，优化加载体验
 使用虚拟列表优化长列表性能
 引入单元测试，提升代码质量
八、总结
本项目是一个功能完整、技术先进的移动端酒店预订应用。通过合理的架构设计、组件化开发、性能优化等手段，实现了良好的用户体验和开发体验。

核心收获：

掌握了 React + TypeScript 的完整开发流程
学会了移动端 UI 组件库的使用
理解了前后端分离的开发模式
掌握了路由管理和状态管理
学会了性能优化的常用手段
感谢观看！