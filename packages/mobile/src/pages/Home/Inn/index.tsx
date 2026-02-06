import SearchBase from '../components/SearchBase';
import { useGoList } from '@/utils/routerUtils'

const Inn = () => {
  const { goList } = useGoList()
  return <SearchBase type="inn" onSearch={goList} />;
};
export default Inn;