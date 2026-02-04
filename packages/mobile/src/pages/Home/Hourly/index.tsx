import SearchBase from '../components/SearchBase';
import { useNavigate } from 'react-router-dom';

const Hourly = () => {
  const navigate = useNavigate();
  return <SearchBase type="hourly" showNightCount={false} onSearch={() => navigate('/list?type=3')} />;
};
export default Hourly;