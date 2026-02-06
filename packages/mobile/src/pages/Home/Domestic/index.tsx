import SearchBase from '../components/SearchBase';
// import { useNavigate } from 'react-router-dom';
import { useGoList } from '@/utils/routerUtils'

const Domestic = () => {
  // const navigate = useNavigate();
  // // 携带参数跳转
  // const goList = (params: any) => {
  //   // 对查询参数编码
  //   const query = new URLSearchParams({...params, type: 1}).toString()
  //   navigate(`/list?${query}`)
  // }
  const { goList } = useGoList();
  return <SearchBase type="domestic" onSearch={goList} />;
};
export default Domestic;