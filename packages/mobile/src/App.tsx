import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home/index'
import List from '@/pages/List';
import Detail from '@/pages/Detail';
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 配置首页路由 */}
        <Route path="/" element={<Home />} />

        {/* 2. 预留列表页和详情页占位，方便后续扩展 */}
        <Route path="/list" element={<List />} />
        <Route path="/detail/:id?" element={<Detail />} />

        {/* 3. 容错处理：输入不存在的地址时重定向回首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App