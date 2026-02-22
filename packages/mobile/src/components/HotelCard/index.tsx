import React from 'react';
import styles from './index.module.css';
import type { Hotel } from './type'; // 注意：你可能需要去 type.ts 里更新一下接口字段

const HotelCard: React.FC<{ hotel: any }> = ({ hotel }) => {
  // ✅ 核心修复：安全处理标签。把后端的逗号字符串转成数组，如果没有就给空数组兜底
  const tagsArray = hotel.hotel_facilities 
    ? hotel.hotel_facilities.split(',') 
    : (hotel.tags || []);

  return (
    <div className={styles.hotelCard}>
      {/* 左侧图片区 */}
      <div className={styles.cardLeft}>
        {/* ✅ 字段替换：image -> cover_image */}
        <img src={hotel.cover_image || hotel.image} alt={hotel.name} />
        <div className={styles.videoIcon}>▶</div>
      </div>

      {/* 右侧内容区 */}
      <div className={styles.cardRight}>
        <div className={styles.hotelNameRow}>
          <span className={styles.hotelName}>{hotel.name}</span>
          {/* ✅ 字段替换：star -> star_rating，加兜底防止报错 */}
          <span className={styles.hotelStar}>{'◆'.repeat(hotel.star_rating || hotel.star || 0)}</span>
        </div>

        <div className={styles.scoreRow}>
          {/* ⚠️ 后端目前没返回评分点评数据，先用假数据兜底，防止页面太秃 */}
          <span className={styles.scoreNum}>{hotel.score || '4.8'}</span>
          <span className={styles.scoreText}>{hotel.scoreText || '超棒'}</span>
          <span className={styles.commentInfo}>{hotel.commentCount || '100+'}点评</span>
        </div>

        {/* ✅ 字段替换：position -> location 或 address */}
        <div className={styles.positionText}>{hotel.location || hotel.position}</div>
        
        {/* ✅ 字段替换：描述文本兜底 */}
        <div className={styles.recommendText}>{hotel.description || hotel.recommend || '热门精选酒店'}</div>

        {/* ✅ 安全渲染 map */}
        <div className={styles.tagRow}>
          {tagsArray.map((tag: string, index: number) => (
            // 建议使用 index 作为 key，因为设施里可能有重复或者特殊字符
            <span key={index} className={styles.hotelTag}>{tag}</span>
          ))}
        </div>

        {hotel.rank && (
          <div className={styles.rankBadge}>
            <span className={styles.rankIcon}>🏆</span> {hotel.rank}
          </div>
        )}

        <div className={styles.priceRow}>
          <div className={styles.priceLeft}>
             <span className={styles.vipTag}>钻石贵宾价 &gt;</span>
          </div>
          <div className={styles.priceRight}>
            <span className={styles.priceUnit}>¥</span>
            {/* ✅ 字段替换：price -> min_price */}
            <span className={styles.priceNum}>
              {/* 将字符串 "2323.00" 转换为整数，如果有小数则保留，视你的 UI 需求而定 */}
              {hotel.min_price ? parseInt(hotel.min_price) : (hotel.price || 0)}
            </span>
            <span className={styles.priceTail}>起</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;