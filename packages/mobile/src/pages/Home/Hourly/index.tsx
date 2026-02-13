import { useOutletContext } from 'react-router-dom';
import SearchBase from '../components/SearchBase';
import type {HomeContextType} from '../type/homeContextType'

const Hourly = () => {
  const { dateRange, setDateRange } = useOutletContext<HomeContextType>();
  
  return (
    <SearchBase 
      type="hourly" // ✅ 这里是 hourly
      dateRange={dateRange}
      onDateChange={setDateRange}
      // 钟点房通常不需要显示“几晚”，你可以传个 false 隐藏掉（如果 SearchBase 支持的话）
      showNightCount={false} 
    />
  );
};

export default Hourly;