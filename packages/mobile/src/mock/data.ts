// src/mock/data.ts

// 1. 酒店列表数据
export const MOCK_HOTEL_LIST = [
    {
      id: 1,
      name: '上海陆家嘴禧玥酒店',
      cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      brand: '禧玥酒店',
      star_rating: 5,
      location: '浦东新区',
      address: '浦东新区富城路201号',
      description: 'BOSS推荐：25楼是沪上知名米其林新荣记',
      hotel_facilities: '免费升房,新中式风,免费停车,一线江景',
      min_price: 936
    },
    {
      id: 2,
      name: '上海和平饭店',
      cover_image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      brand: '和平饭店',
      star_rating: 5,
      location: '黄浦区',
      address: '黄浦区南京东路20号',
      description: '历史悠久的地标建筑',
      hotel_facilities: '历史建筑,博物馆,爵士乐',
      min_price: 2800
    },
    {
      id: 3,
      name: '上海外滩茂悦大酒店',
      cover_image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      brand: '茂悦',
      star_rating: 5,
      location: '黄浦区',
      address: '黄浦区中山东一路199号',
      description: '外滩江景房，尽享浦江美景',
      hotel_facilities: '江景房,含早餐,健身房,游泳池',
      min_price: 1580
    }
  ];
  
  // 2. 酒店详情数据
  export const MOCK_HOTEL_DETAIL = {
    id: 1,
    name: '上海陆家嘴禧玥酒店',
    star_rating: 5,
    description: '位于陆家嘴核心区域，毗邻东方明珠、上海中心等地标建筑。酒店设计融合现代与传统，25楼设有米其林餐厅新荣记。',
    hotel_facilities: '免费WiFi,免费停车,健身房,游泳池,餐厅,会议室',
    location: '浦东新区',
    address: '浦东新区富城路201号',
    brand: '禧玥酒店',
    english_name: 'Hyatt Regency Shanghai Wujiaochang',
    hotel_phone: '021-12345678',
    contact: '张经理',
    contact_phone: '021-87654321',
    cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    images: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60,https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60,https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
    room_number: 200,
    rooms: [
      {
        id: 101,
        hotel_id: 1,
        room_number: '2101',
        room_type: '雅致大床房',
        room_type_en: 'Deluxe King Room',
        bed_type: '大床',
        area: 35,
        floor: '21楼',
        max_occupancy: 2,
        base_price: 936,
        total_rooms: 50,
        available_rooms: 10,
        facilities: '含早,免费取消,即时确认',
        description: '35平米舒适空间，配备大床，适合商务出行',
        images: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
      },
      {
        id: 102,
        hotel_id: 1,
        room_number: '2201',
        room_type: '江景豪华双床房',
        room_type_en: 'River View Twin Room',
        bed_type: '双床',
        area: 45,
        floor: '22楼',
        max_occupancy: 3,
        base_price: 1280,
        total_rooms: 30,
        available_rooms: 5,
        facilities: '双早,不可取消,江景',
        description: '45平米豪华空间，落地窗江景，配备双床',
        images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
      }
    ]
  };

  // 3. 订单列表 Mock 数据
  export const MOCK_ORDERS = [
    {
      id: 1,
      order_no: 'ORD2026022301',
      user_id: 1,
      hotel_id: 1,
      room_id: 101,
      check_in_date: '2026-02-25',
      check_out_date: '2026-02-27',
      nights: 2,
      total_price: 1872,
      status: 1, // 待付款
      guest_name: '张三',
      guest_phone: '13800138000',
      hotel_cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      hotel_name: '上海陆家嘴禧玥酒店',
      room_type: '雅致大床房',
      room_images: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    },
    {
      id: 2,
      order_no: 'ORD2026022302',
      user_id: 1,
      hotel_id: 1,
      room_id: 102,
      check_in_date: '2026-03-01',
      check_out_date: '2026-03-03',
      nights: 2,
      total_price: 2560,
      status: 2, // 待确定
      guest_name: '李四',
      guest_phone: '13900139000',
      hotel_cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      hotel_name: '上海陆家嘴禧玥酒店',
      room_type: '江景豪华双床房',
      room_images: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    },
    {
      id: 3,
      order_no: 'ORD2026022203',
      user_id: 1,
      hotel_id: 2,
      room_id: 201,
      check_in_date: '2026-02-28',
      check_out_date: '2026-03-01',
      nights: 1,
      total_price: 2800,
      status: 3, // 待入住
      guest_name: '王五',
      guest_phone: '13700137000',
      hotel_cover_image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      hotel_name: '上海和平饭店',
      room_type: '豪华套房',
      room_images: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    },
    {
      id: 4,
      order_no: 'ORD2026022004',
      user_id: 1,
      hotel_id: 1,
      room_id: 101,
      check_in_date: '2026-02-15',
      check_out_date: '2026-02-17',
      nights: 2,
      total_price: 1872,
      status: 4, // 已完成
      guest_name: '赵六',
      guest_phone: '13600136000',
      hotel_cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      hotel_name: '上海陆家嘴禧玥酒店',
      room_type: '雅致大床房',
      room_images: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
    }
  ];

  