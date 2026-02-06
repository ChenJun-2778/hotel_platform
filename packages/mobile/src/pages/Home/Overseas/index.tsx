import SearchBase from '../components/SearchBase';
// import { useNavigate } from 'react-router-dom';
import { useGoList } from '@/utils/routerUtils'

const Overseas = () => {
  const { goList } = useGoList()
  return <SearchBase type="overseas" onSearch={goList} />;
};
export default Overseas;