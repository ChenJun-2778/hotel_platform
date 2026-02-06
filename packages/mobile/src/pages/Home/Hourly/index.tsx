import SearchBase from '../components/SearchBase';
import { useGoList } from '@/utils/routerUtils'

const Hourly = () => {
  const { goList } = useGoList()
  return <SearchBase type="hourly" showNightCount={false} onSearch={goList} />;
};
export default Hourly;