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