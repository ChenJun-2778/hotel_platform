import React from 'react';
import styles from './index.module.css'
import type {Hotel} from './type'
const HotelCard: React.FC<{ hotel: Hotel }> = ({ hotel }) => {
  return (
    <div className={styles.hotelCard}>
      {/* 左侧图片区 */}
      <div className={styles.cardLeft}>
        <img src={hotel.image} alt={hotel.name} />
        <div className={styles.videoIcon}>▶</div>
      </div>

      {/* 右侧内容区 */}
      <div className={styles.cardRight}>
        <div className={styles.hotelNameRow}>
          <span className={styles.hotelName}>{hotel.name}</span>
          <span className={styles.hotelStar}>{'◆'.repeat(hotel.star)}</span>
        </div>

        <div className={styles.scoreRow}>
          <span className={styles.scoreNum}>{hotel.score}</span>
          <span className={styles.scoreText}>{hotel.scoreText}</span>
          <span className={styles.commentInfo}>{hotel.commentCount}点评 · {hotel.collectCount}收藏</span>
        </div>

        <div className={styles.positionText}>{hotel.position}</div>
        
        <div className={styles.recommendText}>{hotel.recommend}</div>

        <div className={styles.tagRow}>
          {hotel.tags.map(tag => <span key={tag} className={styles.hotelTag}>{tag}</span>)}
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
            <span className={styles.priceNum}>{hotel.price}</span>
            <span className={styles.priceTail}>起</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard