// hooks/useGoList.ts
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

export const useGoList = () => {
  const navigate = useNavigate();

  const goList = (params: any, type: number = 1) => {
    // 1. 先复制一份参数，避免直接修改原始状态
    const formattedParams = { ...params, type };

    // 2. 如果存在 dateRange 数组，将其转化为 URL 需要的 beginDate 和 endDate
    if (params.dateRange && params.dateRange[0] && params.dateRange[1]) {
      formattedParams.beginDate = dayjs(params.dateRange[0]).format('YYYY-MM-DD');
      formattedParams.endDate = dayjs(params.dateRange[1]).format('YYYY-MM-DD');
    }

    // 3. 彻底删除原始的数组对象，防止序列化出冗余或错误的参数
    delete formattedParams.dateRange;

    // 4. 生成干净的查询字符串
    const query = new URLSearchParams(formattedParams).toString();
    navigate(`/list?${query}`);
  };

  return { goList };
};

export const useGoCities = () => {
  const navigate = useNavigate();
  // 城市页面的跳转
  const goCities = (type: number = 1, city: string) => {
    // 携带当前业务类型跳转，方便城市页展示对应的热门城市
    // 防止中文乱码
    const searchParams = new URLSearchParams({
      type: String(type),
      current: city
    });
    navigate(`/city-select?${searchParams.toString()}`);
  }
  return {goCities}
}