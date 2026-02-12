// 1. 定义 Context 的类型，方便子组件提示
export type HomeContextType = {
    dateRange: [Date, Date];
    setDateRange: (dates: [Date, Date]) => void;
  };