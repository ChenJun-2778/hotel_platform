// 单个酒店的接口
export interface Hotel {
  id: string;
  name: string;
  image: string; // 酒店主图 URL（左侧展示的大图）
  score: number; // 评分数值（如 4.8）
  scoreText: string; // 评分描述（如 "超棒"、"满意"）
  commentCount: number; // 点评数量（展示在评分旁边）
  collectCount: string; // 收藏数量（例如 "6.3万"）
  position: string; // 地理位置/距离描述（如 "近外滩·东方明珠"）
  recommend: string; // 推荐语或特色（通常显示为蓝色文字，如 "BOSS推荐..."）
  tags: string[]; // 标签数组（如 ["免费停车", "一线江景"]）
  price: number; // 酒店起步价（数字类型，方便后续排序逻辑）
  star: number; // 酒店星级（1-5的数字，用于渲染星星/钻石图标数量）
  rank?: string; // 榜单排名
}
// 导出酒店数组类型
export type HotelList = Hotel[]
