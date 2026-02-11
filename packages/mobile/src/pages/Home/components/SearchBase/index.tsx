import React, { useState, useEffect } from 'react';
import { Button } from 'antd-mobile';
import styles from '../SearchBase/index.module.css'
import dayjs from 'dayjs';
// import { data } from 'react-router-dom';
// 导入日历组件
import DateRangePicker from '@/components/DateRangePicker/index'
import {useGoCities, useGoList} from '@/utils/routerUtils'

interface SearchBaseProps {
  type: 'domestic' | 'overseas' | 'hourly' | 'inn';
  // onSearch: (params?: any) => void;
  showNightCount?: boolean; // 是否显示“几晚”
}

 // 2. 定义类型映射字典 (放在组件外面即可，避免重复创建)
  const TYPE_MAP: Record<string, number> = {
    'domestic': 1,
    'overseas': 2,
    'hourly': 3,
    'inn': 4
  };

const SearchBase: React.FC<SearchBaseProps> = ({ type, showNightCount = true }) => {
  // 1. 控制日历弹窗显隐的状态
  const [visible, setVisible] = useState(false)
  // 2. 存储选中的日期范围，默认为“今天”和“明天”
  const [dateRange, setDateRange] = useState<[Date, Date] | null>([
    new Date(),
    dayjs().add(1, 'day').toDate()
  ]);
  //  dayjs().diff(date, 'day') 用来计算两个时间相差的天数
  const nightCount = dateRange && dateRange[0] && dateRange[1]
    ? dayjs(dateRange[1]).diff(dayjs(dateRange[0]), 'day')
    : 0;

  // 计算当前卡片的typeId
  const currentTypeId = TYPE_MAP[type] || 1;

  // 跳转城市选择页面
  const [city, setCity] = useState('上海')
  const { goCities } = useGoCities()
  const handleCityClick = () => {
    // 根据当前组件的 props.type 找到对应的数字 type，默认为 1
    // const targetType = TYPE_MAP[type] || 1;
    // 调用 hook 里的函数并传参
    goCities(currentTypeId, city);
  } 
  // 监听从城市的回传逻辑

  // 跳转List
  const { goList } = useGoList();
  const handelSearch = () => {
    // 设置打包的静态数据
    const params = {
      city: '上海', // 后续如果你接入了城市选择，这里就是动态的
      // 关键：将 Date 对象转为字符串，否则 URL 识别不了对象
      beginDate: dayjs(dateRange?.[0]).format('YYYY-MM-DD'),
      endDate: dayjs(dateRange?.[1]).format('YYYY-MM-DD'),
    }
    goList(params, currentTypeId)
  }
  // 接收城市
  useEffect(() => {
    // 定义一个检查函数
    const checkSelectedCity = () => {
      // 去“邮箱”里看看有没有信
      const selected = localStorage.getItem('selectedCity');
      if (selected) {
        setCity(selected); // 有信！更新 UI
        localStorage.removeItem('selectedCity'); // 读完把信撕了，防止下次重复读
      }
    };

    // 情况 A：从子页面返回时触发 (针对大部分浏览器)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSelectedCity();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 情况 B：组件重新挂载时触发 (针对 React 路由切换机制)
    checkSelectedCity();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  return (
    <div className={styles.searchCard}>
      {/* 目的地 */}
      <div className={styles.inputItem} onClick={handleCityClick}>
        <div className={styles.label}>{type === 'overseas' ? '目的地 (英文/拼音)' : '目的地'}</div>
        <div className={styles.value}>{city}</div>
      </div>

      {/* 日期选择 */}
      <div className={styles.inputItem} onClick={() => setVisible(true)}>
        <div className={styles.dateRow}>
          <div className={styles.dateBlock}>
            <div className={styles.label}>入住</div>
            <div className={styles.dateValue}>
              {dayjs(dateRange?.[0]).format('MM月DD日')}
            </div>
          </div>

          {showNightCount && <div className={styles.nightCount}>{nightCount}晚</div>}

          {showNightCount && <div className={`${styles.dateBlock} ${styles.textRight}`}>
            <div className={styles.label}>离店</div>
            <div className={styles.dateValue}>
              {dayjs(dateRange?.[1]).format('MM月DD日')}
            </div>
          </div>}
        </div>
      </div>

      {/* 查询酒店 */}
      <div className={styles.btnWrapper}>
        <Button block color='primary' size='large' onClick={handelSearch} className={styles.searchBtn}>
          查询酒店
        </Button>
      </div>
      {/* 日历组件 */}
      <DateRangePicker
        visible={visible}
        onClose={() => setVisible(false)}
        value={dateRange}
        onChange={setDateRange}
      />
    </div>
  );
};

export default SearchBase;