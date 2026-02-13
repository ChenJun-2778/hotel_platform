import {
  DashboardOutlined,
  UserOutlined,
  ShopOutlined,
  FileTextOutlined,
  BarChartOutlined,
  HomeOutlined,
  UnorderedListOutlined,
  CalendarOutlined,
} from '@ant-design/icons';

// 管理员菜单
export const adminMenus = [
  {
    key: '/admin/dashboard',
    icon: DashboardOutlined,
    label: '控制台',
    path: '/admin/dashboard',
  },
  {
    key: '/admin/users',
    icon: UserOutlined,
    label: '用户管理',
    path: '/admin/users',
  },
  {
    key: '/admin/hotel-audit',
    icon: ShopOutlined,
    label: '酒店审核',
    path: '/admin/hotel-audit',
  },
  {
    key: '/admin/statistics',
    icon: BarChartOutlined,
    label: '数据统计',
    path: '/admin/statistics',
  },
];

// 商户菜单
export const merchantMenus = [
  {
    key: '/merchant/dashboard',
    icon: DashboardOutlined,
    label: '控制台',
    path: '/merchant/dashboard',
  },
  {
    key: '/merchant/hotels',
    icon: ShopOutlined,
    label: '我的酒店',
    path: '/merchant/hotels',
  },
  {
    key: '/merchant/rooms',
    icon: HomeOutlined,
    label: '房间管理',
    path: '/merchant/rooms',
  },
  {
    key: 'orders',
    icon: FileTextOutlined,
    label: '订单管理',
    children: [
      {
        key: '/merchant/orders/list',
        icon: UnorderedListOutlined,
        label: '订单明细',
        path: '/merchant/orders/list',
      },
      {
        key: '/merchant/orders/calendar',
        icon: CalendarOutlined,
        label: '日历视图',
        path: '/merchant/orders/calendar',
      },
    ],
  },
];

// 根据角色获取菜单
export const getMenusByRole = (role) => {
  switch (role) {
    case 'admin':
      return adminMenus;
    case 'merchant':
      return merchantMenus;
    default:
      return [];
  }
};
