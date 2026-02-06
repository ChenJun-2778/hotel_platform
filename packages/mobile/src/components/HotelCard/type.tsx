// 单个酒店的接口
interface Hotel {
  id: string;
  name: string;
  image: string;
  score: number;
  scoreText: string;
  commentCount: number;
  collectCount: string;
  position: string;
  recommend: string;
  tags: string[];
  price: number;
  star: number;
  rank?: string; // 问号表示可选字段
}
// 导出酒店数组类型
export type HotelList = Hotel[]
