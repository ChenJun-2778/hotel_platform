import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home/index'
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 配置首页路由 */}
        <Route path="/" element={<Home />} />

        {/* 2. 预留列表页和详情页占位，方便后续扩展 */}
        <Route path="/list" element={<div>酒店列表页（待开发）</div>} />
        <Route path="/detail/:id" element={<div>酒店详情页（待开发）</div>} />

        {/* 3. 容错处理：输入不存在的地址时重定向回首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App