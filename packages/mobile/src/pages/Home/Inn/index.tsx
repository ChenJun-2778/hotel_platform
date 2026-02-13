import { useOutletContext } from 'react-router-dom';
import SearchBase from '../components/SearchBase';
import type { HomeContextType } from '../type/homeContextType'; 

const Inn = () => {
  const { dateRange, setDateRange } = useOutletContext<HomeContextType>();
  
  return (
    <SearchBase 
      type="inn" // ✅ 这里是 inn
      dateRange={dateRange}
      onDateChange={setDateRange}
    />
  );
};

export default Inn;