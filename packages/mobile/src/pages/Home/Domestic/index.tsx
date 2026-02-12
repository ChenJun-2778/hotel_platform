import { useOutletContext } from 'react-router-dom';
import SearchBase from '../components/SearchBase';
// import { useNavigate } from 'react-router-dom';
// import { useGoList } from '@/utils/routerUtils'
import type { HomeContextType } from '../type/homeContextType'

const Domestic = () => {
  const { dateRange, setDateRange } = useOutletContext<HomeContextType>();
  return <SearchBase 
  type="domestic" 
  // ✅ 3. 把接收到的数据传给 SearchBase
  dateRange={dateRange}
  onDateChange={setDateRange}
/>;
};
export default Domestic;