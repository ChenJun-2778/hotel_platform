// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import Home from '@/pages/Home/index'
// import List from '@/pages/List';
// import Detail from '@/pages/Detail';
// import Domestic from '@/pages/Home/Domestic';
// import Overseas from '@/pages/Home/Overseas';
// import Hourly from '@/pages/Home/Hourly'
// import Inn from '@/pages/Home/Inn'
// import CitySelect from '@/pages/CitySelect';
// import OrderFill from '@/pages/OrderFill';
// import Login from '@/pages/Login';
// import User from './pages/User';
// import OrderList from '@/pages/OrderList';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         {/* 1. 配置首页路由 */}
//         <Route path="/" element={<Home />} >
//           <Route index element={<Navigate to="domestic" replace />} />
//           <Route path="domestic" element={<Domestic />} />
//           <Route path="overseas" element={<Overseas />} />
//           <Route path="hourly" element={<Hourly />} />
//           <Route path="inn" element={<Inn />} />
//         </Route>

//         {/* 2. 预留列表页和详情页占位，方便后续扩展 */}
//         {/* 搜索list页面 */}
//         <Route path="/list" element={<List />} />
//         {/* 详情页面 */}
//         <Route path="/detail/:id?" element={<Detail />} />
//         {/* 城市选择页面 */}
//         <Route path="/city-select" element={<CitySelect />} />
//         {/* 订购页面 */}
//         <Route path="/order/:id" element={<OrderFill />} />
//         {/* 登录页面 */}
//         <Route path="/login" element={<Login />} />
//         {/* 用户中心页面 */}
//         <Route path="/user" element={<User />} />
//         {/* 订单列表页面 */}
//         <Route path="/order-list" element={<OrderList />} />
//         {/* 3. 容错处理：输入不存在的地址时重定向回首页 */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App


import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // 👈 引入刚才写的路由配置

const App: React.FC = () => {
  return (
    // 这里可以包裹其他的 Provider，比如 Antd 的 ConfigProvider 或 Redux
    <div className="app">
      {/* ✅ 所有的路由逻辑都交给 RouterProvider */}
      <RouterProvider router={router} />
    </div>
  );
};

export default App;