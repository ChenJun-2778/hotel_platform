# 📱 Mobile 端 - 用户预订系统

移动端酒店预订应用，为用户提供便捷的酒店搜索、预订和订单管理功能。

## 🎯 功能特性

### 核心功能
- ✅ 用户注册/登录
- ✅ 多类型酒店搜索（国内/海外/钟点房/民宿）
- ✅ 智能城市选择（支持拼音搜索）
- ✅ 酒店列表展示与筛选
- ✅ 酒店详情查看
- ✅ 实时库存显示
- ✅ 在线预订与支付
- ✅ 订单管理
- ✅ 个人中心

### 特色功能
- 🔥 低库存提示（仅剩X间）
- 📅 日期选择器
- 🔍 关键词搜索
- 📊 多维度筛选（价格、星级、评分、设施）
- 🎨 精美UI设计
- ⚡ 流畅动画效果

## 🛠 技术栈

- **框架**: React 19 + TypeScript
- **路由**: React Router DOM 7.x
- **UI 组件**: Ant Design Mobile 5.x
- **HTTP 客户端**: Axios
- **日期处理**: Day.js
- **动画**: Framer Motion
- **拼音匹配**: pinyin-match
- **构建工具**: Vite 7.x

## 📁 项目结构

```
mobile/
├── src/
│   ├── api/                    # API 接口封装
│   │   ├── Hotel/             # 酒店相关接口
│   │   │   ├── index.ts       # 接口定义
│   │   │   └── type.ts        # 类型定义
│   │   ├── Order/             # 订单相关接口
│   │   └── User/              # 用户相关接口
│   │
│   ├── components/            # 公共组件
│   │   ├── DateRangePicker/  # 日期范围选择器
│   │   ├── HotelCard/        # 酒店卡片
│   │   ├── SearchBar/        # 搜索栏
│   │   └── TabBar/           # 底部导航栏
│   │
│   ├── pages/                # 页面组件
│   │   ├── Home/            # 首页
│   │   │   ├── Domestic/    # 国内酒店
│   │   │   ├── Overseas/    # 海外酒店
│   │   │   ├── Hourly/      # 钟点房
│   │   │   └── Inn/         # 民宿
│   │   ├── List/            # 酒店列表页
│   │   ├── Detail/          # 酒店详情页
│   │   ├── Search/          # 搜索页
│   │   ├── CitySelect/      # 城市选择页
│   │   │   ├── DomesticCity/ # 国内城市
│   │   │   └── OverseasCity/ # 海外城市
│   │   ├── OrderFill/       # 订单填写页
│   │   ├── OrderList/       # 订单列表页
│   │   ├── PaymentResult/   # 支付结果页
│   │   ├── Login/           # 登录页
│   │   └── User/            # 个人中心
│   │
│   ├── mock/                # Mock 数据
│   │   ├── data.ts          # 模拟数据
│   │   └── cityData.ts      # 城市数据
│   │
│   ├── utils/               # 工具函数
│   │   ├── request.ts       # Axios 封装
│   │   ├── routerUtils.ts   # 路由工具
│   │   └── mockRequest.ts   # Mock 请求工具
│   │
│   ├── router/              # 路由配置
│   │   └── index.tsx        # 路由定义
│   │
│   ├── main.tsx             # 应用入口
│   └── index.css            # 全局样式
│
├── .env.development         # 开发环境配置
├── .env.production          # 生产环境配置
├── vite.config.ts           # Vite 配置
└── package.json             # 依赖配置
```

## 🚀 快速开始

### 1. 安装依赖
```bash
cd mobile
npm install
```

### 2. 配置环境变量

创建 `.env.development` 文件：
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_USE_MOCK=false
```

创建 `.env.production` 文件：
```env
VITE_API_BASE_URL=https://your-api-domain.com
VITE_USE_MOCK=false
```

### 3. 启动开发服务器
```bash
npm run dev
```

应用将运行在 `http://localhost:5173`

### 4. 构建生产版本
```bash
npm run build
```

构建产物将输出到 `dist` 目录

## 📱 页面说明

### 首页 (Home)
- 四个 Tab：国内酒店、海外酒店、钟点房、民宿
- 搜索栏：城市选择、日期选择
- 猜你喜欢：推荐酒店列表

### 城市选择页 (CitySelect)
- 热门城市快速选择
- 城市列表（按首字母分组）
- 支持拼音搜索
- 国内/海外城市切换

### 酒店列表页 (List)
- 酒店卡片展示
- 筛选功能：价格、星级、评分、设施
- 排序功能：价格、星级、评分
- 无限滚动加载

### 酒店详情页 (Detail)
- 酒店图片轮播
- 酒店基本信息
- 日期选择
- 房型列表
- 实时库存显示
- 低库存提示（仅剩X间）
- 售罄状态（无房间）

### 订单填写页 (OrderFill)
- 入住人信息填写
- 订单信息确认
- 价格计算
- 提交订单

### 支付结果页 (PaymentResult)
- 支付成功/失败提示
- 订单详情
- 跳转到订单列表

### 订单列表页 (OrderList)
- 订单状态筛选
- 订单卡片展示
- 订单详情查看

### 个人中心 (User)
- 用户信息展示
- 订单快捷入口
- 退出登录

## 🎨 UI 组件

### HotelCard（酒店卡片）
```tsx
<HotelCard
  id={hotel.id}
  name={hotel.name}
  image={hotel.cover_image}
  price={hotel.min_price}
  score={hotel.score}
  reviewCount={hotel.review_count}
  location={hotel.location}
  description={hotel.description}
/>
```

### DateRangePicker（日期选择器）
```tsx
<DateRangePicker
  visible={showCalendar}
  onClose={() => setShowCalendar(false)}
  defaultDate={[startDate, endDate]}
  onConfirm={handleDateConfirm}
/>
```

### SearchBar（搜索栏）
```tsx
<SearchBar
  city={city}
  beginDate={beginDate}
  endDate={endDate}
  onCityClick={handleCityClick}
  onDateClick={handleDateClick}
  onSearch={handleSearch}
/>
```

## 🔧 核心功能实现

### 1. 城市搜索（拼音匹配）
```typescript
import PinyinMatch from 'pinyin-match';

const filteredCities = cities.filter(city => {
  const match = PinyinMatch.match(city.name, keyword);
  return match !== false;
});
```

### 2. 实时库存查询
```typescript
// 传递日期参数获取实时库存
const res = await apiGetHotelDetail(id, beginDate, endDate);

// 根据 available_rooms 显示库存状态
const availableRooms = room.available_rooms ?? room.total_rooms ?? 0;
const isSoldOut = availableRooms === 0;
const isLowStock = availableRooms > 0 && availableRooms <= 2;
```

### 3. 订单支付流程
```typescript
// 1. 创建订单
const orderRes = await apiCreateOrder(orderData);

// 2. 支付订单（自动扣减库存）
const payRes = await apiPayOrder(order_no);

// 3. 跳转支付结果页
navigate(`/payment-result?success=true&order_no=${order_no}`);
```

### 4. 路由参数传递
```typescript
// 使用 URLSearchParams 传递参数
navigate(`/list?city=${city}&beginDate=${beginDate}&endDate=${endDate}&type=${type}`);

// 接收参数
const [searchParams] = useSearchParams();
const city = searchParams.get('city');
const beginDate = searchParams.get('beginDate');
```

## 🎯 状态管理

使用 React Hooks 进行状态管理：

```typescript
// 本地状态
const [hotels, setHotels] = useState([]);
const [loading, setLoading] = useState(false);

// URL 状态
const [searchParams, setSearchParams] = useSearchParams();

// 表单状态
const [formData, setFormData] = useState({
  guest_name: '',
  guest_phone: ''
});
```

## 🌐 API 调用

### 封装 Axios
```typescript
// utils/request.ts
import axios from 'axios';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000
});

// 请求拦截器
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器
request.interceptors.response.use(
  response => response.data,
  error => {
    Toast.show({ content: error.message });
    return Promise.reject(error);
  }
);
```

### API 调用示例
```typescript
// api/Hotel/index.ts
export const apiGetHotelList = async (params: SearchParams) => {
  return request.get('/api/hotelsMobile/search', { params });
};

export const apiGetHotelDetail = async (
  id: string | number,
  check_in_date?: string,
  check_out_date?: string
) => {
  const params: any = {};
  if (check_in_date) params.check_in_date = check_in_date;
  if (check_out_date) params.check_out_date = check_out_date;
  
  return request.get(`/api/hotelsMobile/${id}`, { params });
};
```

## 📦 构建优化

### Vite 配置
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'antd-mobile': ['antd-mobile', 'antd-mobile-icons']
        }
      }
    }
  }
});
```

## 🎨 样式规范

### CSS Modules
```tsx
import styles from './index.module.css';

<div className={styles.container}>
  <div className={styles.header}>Header</div>
</div>
```

### 响应式设计
```css
/* 使用 vw 单位实现响应式 */
.container {
  padding: 4vw;
  font-size: 3.73vw; /* 14px / 375px * 100 */
}

/* 最大宽度限制 */
@media (min-width: 750px) {
  .container {
    max-width: 750px;
    margin: 0 auto;
  }
}
```

## 🐛 调试技巧

### 1. 开启 Mock 模式
```env
VITE_USE_MOCK=true
```

### 2. 查看网络请求
```typescript
// 在 request.ts 中添加日志
request.interceptors.request.use(config => {
  console.log('🔍 API请求:', config.url, config.params);
  return config;
});
```

### 3. React DevTools
安装 React DevTools 浏览器扩展，查看组件状态和性能

## 📱 移动端适配

### 1. Viewport 设置
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
```

### 2. 安全区域适配
```css
/* iOS 刘海屏适配 */
.container {
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 3. 1px 边框问题
```css
/* 使用 transform 实现真正的 1px */
.border::after {
  content: '';
  position: absolute;
  border: 1px solid #eee;
  transform: scaleY(0.5);
}
```

## 🚀 性能优化

### 1. 图片懒加载
```tsx
import { Image } from 'antd-mobile';

<Image
  src={hotel.cover_image}
  lazy
  fit='cover'
/>
```

### 2. 路由懒加载
```tsx
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));

<Suspense fallback={<Loading />}>
  <Home />
</Suspense>
```

### 3. 防抖与节流
```typescript
import { debounce } from 'lodash-es';

const handleSearch = debounce((keyword) => {
  // 搜索逻辑
}, 300);
```

## 📝 开发规范

### 1. 组件命名
- 组件文件使用 PascalCase：`HotelCard.tsx`
- 样式文件使用 camelCase：`index.module.css`

### 2. 类型定义
```typescript
// 定义接口类型
interface Hotel {
  id: number;
  name: string;
  price: number;
}

// 使用类型
const [hotels, setHotels] = useState<Hotel[]>([]);
```

### 3. 代码注释
```typescript
/**
 * 获取酒店列表
 * @param params 搜索参数
 * @returns 酒店列表数据
 */
export const apiGetHotelList = async (params: SearchParams) => {
  // 实现逻辑
};
```

## 🔒 安全注意事项

1. **Token 存储**: 使用 localStorage 存储 JWT Token
2. **敏感信息**: 不在前端存储密码等敏感信息
3. **XSS 防护**: React 自动转义 HTML，避免使用 dangerouslySetInnerHTML
4. **HTTPS**: 生产环境必须使用 HTTPS

## 📄 许可证

MIT License
