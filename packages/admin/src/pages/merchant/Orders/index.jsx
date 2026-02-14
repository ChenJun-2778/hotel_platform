import React from 'react';
import { Outlet } from 'react-router-dom';

/**
 * 订单管理主入口
 * 使用 Outlet 渲染子路由
 */
const Orders = () => {
  return <Outlet />;
};

export default Orders;
