import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export const useGoList = () => {
  const navigate = useNavigate();

  const goList = (params: any, type: number = 1) => {
    // 处理日期转化逻辑，防止 URL 传对象
    const formattedParams = {
      ...params,
      start: params.dateRange?.[0] ? dayjs(params.dateRange[0]).format('YYYY-MM-DD') : '',
      end: params.dateRange?.[1] ? dayjs(params.dateRange[1]).format('YYYY-MM-DD') : '',
      type
    };
    
    // 移除不再需要的原始对象
    delete formattedParams.dateRange;

    const query = new URLSearchParams(formattedParams).toString();
    navigate(`/list?${query}`);
  };

  return { goList };
};