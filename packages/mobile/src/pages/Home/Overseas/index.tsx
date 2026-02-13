import { useOutletContext } from 'react-router-dom';
import SearchBase from '../components/SearchBase';
// 记得引入你在 Home 里定义的 Context 类型
import type {HomeContextType} from '../type/homeContextType'

const Overseas = () => {
  const { dateRange, setDateRange } = useOutletContext<HomeContextType>();
  
  return (
    <SearchBase 
      type="overseas" // ✅ 这里是 overseas
      dateRange={dateRange}
      onDateChange={setDateRange}
    />
  );
};

export default Overseas;