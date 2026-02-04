import SearchBase from '../components/SearchBase';
import { useNavigate } from 'react-router-dom';

const Overseas = () => {
  const navigate = useNavigate();
  return <SearchBase type="overseas" onSearch={() => navigate('/list?type=2')} />;
};
export default Overseas;