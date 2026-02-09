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
const adminUsers = () => import('../pages/admin/Users');
const adminHotelAudit = () => import('../pages/admin/HotelAudit');
const adminStatistics = () => import('../pages/admin/Statistics');

// 懒加载商户页面
const merchantDashboard = () => import('../pages/merchant/Dashboard');
const merchantHotels = () => import('../pages/merchant/Hotels');
const merchantRooms = () => import('../pages/merchant/Rooms');
const merchantOrders = () => import('../pages/merchant/Orders');

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
      },
    ],
  },
]);

export default router;
