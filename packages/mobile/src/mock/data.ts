// src/mock/data.ts

// 1. 酒店列表数据
export const MOCK_HOTEL_LIST = [
    {
      id: '1',
      name: '上海陆家嘴禧玥酒店',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      score: 4.8,
      scoreText: '超棒',
      commentCount: 4695,
      collectCount: '6.3万',
      position: '近外滩 · 东方明珠',
      recommend: 'BOSS:25楼是沪上知名米其林新荣记',
      tags: ['免费升房', '新中式风', '免费停车', '一线江景'],
      rank: '上海美景酒店榜 No.16',
      price: 936,
      star: 5
    },
    {
      id: '2',
      name: '上海和平饭店',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      score: 4.9,
      scoreText: '传奇',
      commentCount: 8821,
      collectCount: '10万+',
      position: '外滩 · 南京路步行街',
      recommend: '历史悠久的地标建筑',
      tags: ['历史建筑', '博物馆', '爵士乐'],
      price: 2800,
      star: 5
    }
  ];
  
  // 2. 酒店详情数据
  export const MOCK_HOTEL_DETAIL = {
    id: '1',
    name: '上海陆家嘴禧玥酒店',
    score: 4.8,
    scoreText: '超棒',
    tags: ['高档型', '近外滩', '新中式'],
    address: '浦东新区富城路201号',
    images: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
      'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
    ],
    rooms: [
      {
        id: 101,
        name: '雅致大床房',
        desc: '35㎡ | 大床 | 有窗',
        tags: ['含早', '免费取消', '即使确认'],
        price: 936,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
      },
      {
        id: 102,
        name: '江景豪华双床房',
        desc: '45㎡ | 双床 | 落地窗看江',
        tags: ['双早', '不可取消'],
        price: 1280,
        image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
      }
    ]
  };