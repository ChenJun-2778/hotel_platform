import { createBrowserRouter, Navigate } from 'react-router-dom';

// 1. 引入布局组件
import MainLayout from '@/components/MainLayout';

// 2. 引入你的页面组件
import Home from '@/pages/Home';
import OrderList from '@/pages/OrderList';
import User from '@/pages/User';
import Login from '@/pages/Login';
import HotelDetail from '@/pages/Detail'; // 假设你有详情页

// 3. 引入 Home 下的子页面 (国内/海外等)
import Domestic from '@/pages/Home/Domestic';
// import Overseas from '@/pages/Home/Overseas'; 

// 定义路由数组
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />, // ✅ 让 Layout 包裹这三个主页面
    children: [
      {
        path: '', // 默认路径 /
        element: <Home />,
        children: [
          // Home 页面的内部子路由 (国内/海外)
          { path: '', element: <Navigate to="domestic" replace /> }, // 默认重定向到 domestic
          { path: 'domestic', element: <Domestic /> },
          { path: 'overseas', element: <div>海外酒店(待开发)</div> }, // 占位
        ]
      },
      {
        path: 'order-list',
        element: <OrderList />,
      },
      {
        path: 'user',
        element: <User />,
      },
    ],
  },
  // ----------------------------------------------------------------
  // 👇 不需要底部导航的页面，放在 Layout 外面
  // ----------------------------------------------------------------
  {
    path: '/login',
    element: <Login />,
  },
  {
    // 动态路由参数
    path: '/detail/:id',
    element: <HotelDetail />,
  },
  {
    // 404 页面
    path: '*',
    element: <div>404 Not Found</div>,
  }
]);

export default router;