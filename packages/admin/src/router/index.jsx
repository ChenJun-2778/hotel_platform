import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import PageLoading from '../components/PageLoading';
import Layout from '../components/Layout';
import Login from '../pages/Login';
import Forbidden from '../pages/Forbidden';

// 懒加载包装器
function lazyLoad(importFunc) {
  const LazyComponent = lazy(importFunc);
  return (
    <Suspense fallback={<PageLoading />}>
      <LazyComponent />
    </Suspense>
  );
}

// 懒加载管理员页面
const adminDashboard = () => import('../pages/admin/Dashboard');
const adminUsers = () => import('../pages/admin/Users/index');
const adminHotelAudit = () => import('../pages/admin/HotelAudit/index');
const adminStatistics = () => import('../pages/admin/Statistics/index');
const adminProfile = () => import('../pages/admin/Profile');

// 懒加载商户页面
const merchantDashboard = () => import('../pages/merchant/Dashboard');
const merchantHotels = () => import('../pages/merchant/Hotels');
const merchantRooms = () => import('../pages/merchant/Rooms');
const merchantOrders = () => import('../pages/merchant/Orders/index');
const merchantOrderList = () => import('../pages/merchant/Orders/OrderList');
const merchantOrderCalendar = () => import('../pages/merchant/Orders/OrderCalendar');
const merchantProfile = () => import('../pages/merchant/Profile');

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/admin/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/403',
    element: <Forbidden />,
  },
  // 管理员路由
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: lazyLoad(adminDashboard),
      },
      {
        path: 'users',
        element: lazyLoad(adminUsers),
      },
      {
        path: 'hotel-audit',
        element: lazyLoad(adminHotelAudit),
      },
      {
        path: 'statistics',
        element: lazyLoad(adminStatistics),
      },
      {
        path: 'profile',
        element: lazyLoad(adminProfile),
      },
    ],
  },
  // 商户路由
  {
    path: '/merchant',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/merchant/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: lazyLoad(merchantDashboard),
      },
      {
        path: 'hotels',
        element: lazyLoad(merchantHotels),
      },
      {
        path: 'rooms',
        element: lazyLoad(merchantRooms),
      },
      {
        path: 'orders',
        element: lazyLoad(merchantOrders),
        children: [
          {
            index: true,
            element: <Navigate to="/merchant/orders/list" replace />,
          },
          {
            path: 'list',
            element: lazyLoad(merchantOrderList),
          },
          {
            path: 'calendar',
            element: lazyLoad(merchantOrderCalendar),
          },
        ],
      },
      {
        path: 'profile',
        element: lazyLoad(merchantProfile),
      },
    ],
  },
]);

export default router;
