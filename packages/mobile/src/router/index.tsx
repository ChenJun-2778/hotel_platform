import { createBrowserRouter, Navigate } from 'react-router-dom';

// 1. 引入布局组件 (包含底部 TabBar)
import MainLayout from '@/components/MainLayout';

// 2. 引入主 Tab 页面
import Home from '@/pages/Home';
import OrderList from '@/pages/OrderList';
import User from '@/pages/User';

// 3. 引入 Home 下的子频道页面
import Domestic from '@/pages/Home/Domestic'; // 国内
import Overseas from '@/pages/Home/Overseas'; // 海外
import Hourly from '@/pages/Home/Hourly';     // 钟点房
import Inn from '@/pages/Home/Inn';           // 民宿

// 4. 引入其他全屏页面 (不需要底部 TabBar)
import Login from '@/pages/Login';
import List from '@/pages/List';         // 酒店列表/搜索结果页
import Detail from '@/pages/Detail';     // 酒店详情页
import CitySelect from '@/pages/CitySelect'; // 城市选择页
import OrderFill from '@/pages/OrderFill';   // 订单填写页
import Search from '@/pages/Search'; // Search页面

// 定义路由数组
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // ✅这一层负责显示底部导航栏
    children: [
      {
        path: '', // 默认路径 / 显示 Home
        element: <Home />,
        children: [
          // Home 页面的内部子路由 (配合 CapsuleTabs 切换)
          { index: true, element: <Navigate to="domestic" replace /> }, // 默认重定向到 domestic
          { path: 'domestic', element: <Domestic /> },
          { path: 'overseas', element: <Overseas /> },
          { path: 'hourly', element: <Hourly /> },
          { path: 'inn', element: <Inn /> },
        ]
      },
      {
        path: 'order-list', // 对应底部“订单”Tab
        element: <OrderList />,
      },
      {
        path: 'user', // 对应底部“我的”Tab
        element: <User />,
      },
    ],
  },
  
  // ================================================================
  // 👇 下面这些页面不需要底部导航栏，所以放在 MainLayout 外面 (平级)
  // ================================================================
  
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/list',
    element: <List />,
  },
  {
    // 详情页 (id 是可选参数，对应你原来的 path="/detail/:id?")
    path: '/detail/:id?', 
    element: <Detail />,
  },
  {
    path: '/city-select',
    element: <CitySelect />,
  },
  {
    // 填写订单页 (需要参数 id)
    path: '/order/:id',
    element: <OrderFill />,
  },
  // 搜索页面
  {
    path: '/search',
    element: <Search />,
  },
  {
    // 404 兜底，跳回首页
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

export default router;