import React, { useMemo, useState, useRef, useEffect } from 'react';
import styles from './index.module.css';
// import type { Hotel } from './type'; 
import LazyImage from '@/components/LazyImage';
import { LocationFill } from 'antd-mobile-icons';

const HotelCard: React.FC<{ hotel: any }> = ({ hotel }) => {
  // 控制描述文字的展开/收起状态
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  // 判断描述文字是否超过 3 行
  const [isDescOverflow, setIsDescOverflow] = useState(false);
  const descRef = useRef<HTMLDivElement>(null);

  // ✅ 使用 useMemo 缓存标签数组，避免重复计算
  const tagsArray = useMemo(() => {
    return hotel.hotel_facilities 
      ? hotel.hotel_facilities.split(',') 
      : (hotel.tags || []);
  }, [hotel.hotel_facilities, hotel.tags]);

  // 检测描述文字是否超过 3 行
  useEffect(() => {
    if (descRef.current) {
      const lineHeight = parseFloat(getComputedStyle(descRef.current).lineHeight);
      const maxHeight = lineHeight * 3; // 3 行的高度
      const actualHeight = descRef.current.scrollHeight;
      setIsDescOverflow(actualHeight > maxHeight);
    }
  }, [hotel.description]);

  // ✅ 使用 useMemo 缓存评分文案
  const scoreText = useMemo(() => {
    // 根据评分自动生成文案 (补充后端缺失的 scoreText)
    const getScoreText = (score: string | number | null) => {
      // 1. 拦截 null, undefined, "", 0
      if (!score) return '等你评价'; 
      
      const num = Number(score);
      // 2. 拦截那些无法转换成数字的乱码字符串
      if (isNaN(num)) return '暂无评分'; 

      // 3. 正常打分逻辑
      if (num >= 4.5) {
        return '超棒';
      } else if (num >= 4.0) {
        return '很好';
      } else {
        return '不错';
      }
    };
    
    return getScoreText(hotel.score);
  }, [hotel.score]);

  return (
    <div className={styles.hotelCard}>
      {/* 左侧图片区 */}
      <div className={styles.cardLeft}>
        <LazyImage 
          src={hotel.cover_image || hotel.image} 
          alt={hotel.name} 
          // 🚨 务必确认你的 css 里图片类名叫什么，这里假设叫 hotelImage
          className={styles.hotelImage} 
        />
        <div className={styles.videoIcon}>▶</div>
      </div>

      {/* 右侧内容区 */}
      <div className={styles.cardRight}>
        <div className={styles.hotelNameRow}>
          <span className={styles.hotelName}>{hotel.name}</span>
          <span className={styles.hotelStar}>{'◆'.repeat(hotel.star_rating || hotel.star || 0)}</span>
        </div>

        <div className={styles.scoreRow}>
          <span className={styles.scoreNum}>{hotel.score || '暂无'}</span>
          {/* ✅ 使用缓存的评分文案 */}
          <span className={styles.scoreText}>{scoreText}</span>
          {/* ✅ 修复：0 点评也能正确渲染 */}
          <span className={styles.commentInfo}>
            {hotel.review_count !== undefined ? hotel.review_count : '暂无'}点评
          </span>
          {/* ✅ 新增：收藏数显示 */}
          {hotel.favorite_count !== undefined && (
            <span className={styles.favoriteInfo}>
              {hotel.favorite_count}人收藏
            </span>
          )}
        </div>

        {/* ✅ 修复：优先使用具体 address，没有再降级使用 location */}
        <div className={styles.positionText}>
          <LocationFill className={styles.locationIcon} />
          {hotel.address || hotel.location || '位置不详'}
        </div>
        
        {/* 描述文字：支持展开/收起，最多显示 3 行 */}
        <div 
          className={`${styles.recommendText} ${isDescExpanded ? styles.expanded : ''}`}
          onClick={(e) => {
            if (isDescOverflow) {
              e.stopPropagation(); // 阻止冒泡，避免触发卡片点击
              setIsDescExpanded(!isDescExpanded);
            }
          }}
          style={{ cursor: isDescOverflow ? 'pointer' : 'default' }}
        >
          <div ref={descRef} className={styles.descContent}>
            {hotel.description || '热门精选酒店'}
          </div>
          {/* 只有文字超过 3 行时才显示展开/收起提示 */}
          {isDescOverflow && (
            <span className={styles.expandHint}>
              {isDescExpanded ? ' 收起' : ' 展开'}
            </span>
          )}
        </div>

        <div className={styles.tagRow}>
          {tagsArray.map((tag: string, index: number) => (
            <span key={index} className={styles.hotelTag}>{tag}</span>
          ))}
        </div>

        {/* 只有后端真正传了 rank 才会显示 */}
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
            <span className={styles.priceNum}>
              {hotel.min_price ? parseInt(hotel.min_price) : 0}
            </span>
            <span className={styles.priceTail}>起</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ✅ 使用 React.memo 避免不必要的重渲染
// 只有当 hotel.id 改变时才重新渲染
export default React.memo(HotelCard, (prevProps, nextProps) => {
  return prevProps.hotel.id === nextProps.hotel.id;
});