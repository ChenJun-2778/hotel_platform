import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import HotelList from '../pages/HotelList';
import HotelDetail from '../pages/HotelDetail';
import Login from '../pages/Login';
import HotelManage from '../pages/HotelManage';
import HotelAudit from '../pages/HotelAudit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'hotels',
        element: <HotelList />,
      },
      {
        path: 'hotel-detail',
        element: <HotelDetail />,
      },
      {
        path: 'hotel-manage',
        element: <HotelManage />,
      },
      {
        path: 'hotel-audit',
        element: <HotelAudit />,
      },
    ],
  },
]);

export default router;
