import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from '@/pages/Home/index'
import List from '@/pages/List';
import Detail from '@/pages/Detail';
import Domestic from '@/pages/Home/Domestic';
import Overseas from '@/pages/Home/Overseas';
import Hourly from '@/pages/Home/Hourly'
import Inn from '@/pages/Home/Inn'
import CitySelect from '@/pages/CitySelect';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 配置首页路由 */}
        <Route path="/" element={<Home />} >
          <Route index element={<Navigate to="domestic" replace />} />
          <Route path="domestic" element={<Domestic />} />
          <Route path="overseas" element={<Overseas />} />
          <Route path="hourly" element={<Hourly />} />
          <Route path="inn" element={<Inn />} />
        </Route>

        {/* 2. 预留列表页和详情页占位，方便后续扩展 */}
        {/* 搜索list页面 */}
        <Route path="/list" element={<List />} />
        {/* 详情页面 */}
        <Route path="/detail/:id?" element={<Detail />} />
        {/* 城市选择页面 */}
        <Route path="/city-select" element={<CitySelect />} />

        {/* 3. 容错处理：输入不存在的地址时重定向回首页 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App