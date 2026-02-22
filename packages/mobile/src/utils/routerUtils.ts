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
  
  const goCities = (type: number = 1, city: string) => {
    // 把当前城市放到参数里，方便 DomesticCity 读取
    const searchParams = new URLSearchParams({
      current: city
    });

    // ✅ 核心逻辑：根据传进来的 type，直接精准拼出完整的子路由路径
    // 如果是海外 (type === 2)，直接跳 /city-select/overseas
    // 其他情况默认跳 /city-select/domestic
    const targetPath = type === 2 ? '/city-select/overseas' : '/city-select/domestic';

    // 一步到位，直接起飞
    navigate(`${targetPath}?${searchParams.toString()}`);
  }
  
  return { goCities }
}