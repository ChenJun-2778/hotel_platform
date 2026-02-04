import SearchBase from '../components/SearchBase';
import { useNavigate } from 'react-router-dom';

const Inn = () => {
  const navigate = useNavigate();
  return <SearchBase type="inn" onSearch={() => navigate('/list?type=4')} />;
};
export default Inn;