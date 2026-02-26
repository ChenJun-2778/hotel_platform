import React, { useState, useEffect } from 'react';
import { Swiper, Image, Toast, ImageViewer, DotLoading } from 'antd-mobile';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { EnvironmentOutline, PictureOutline, CalendarOutline, LocationFill, FireFill } from 'antd-mobile-icons';
import styles from './index.module.css';
import { apiGetHotelDetail } from '@/api/Hotel'
import dayjs from 'dayjs';
// 引入日历组件
import DateRangePicker from '@/components/DateRangePicker';

const HotelDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 获取 URL 里的酒店 ID
  // 获取 URL 上的日期参数 (如果没有就默认今天明天)
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultBegin = dayjs().format('YYYY-MM-DD');
  const defaultEnd = dayjs().add(1, 'day').format('YYYY-MM-DD');

  const beginDate = searchParams.get('beginDate') || defaultBegin;
  const endDate = searchParams.get('endDate') || defaultEnd;
  const type = searchParams.get('type') || '1'; // 获取酒店类型
  const nightCount = dayjs(endDate).diff(dayjs(beginDate), 'day');
  // 1. 定义状态
  const [showCalendar, setShowCalendar] = useState(false); // 控制日历显示
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); // 控制图片预览
  useEffect(() => {
    // ✅ 新增一个安全解析 JSON 数组的工具函数
    const safeParseArray = (str: any) => {
      if (!str) return [];
      if (Array.isArray(str)) return str;
      try {
        let parsed = JSON.parse(str);
        // 如果 parse 一次之后发现还是字符串（比如双重 stringify 的房间图片），就再 parse 一次
        if (typeof parsed === 'string') {
          parsed = JSON.parse(parsed);
        }
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        // 如果 JSON.parse 失败，兜底退化为普通的逗号切割
        return typeof str === 'string' ? str.split(',').map(s => s.trim()).filter(Boolean) : [];
      }
    };

    const getHotelDetail = async () => {
      if (!id) return
      setLoading(true)
      try {
        // ✅ 传递日期参数到后端，获取指定日期范围内的可用房间数
        const res = await apiGetHotelDetail(id, beginDate, endDate)
        if (res?.success) {
          const hotelData = res.data;
          
          // ✅ 解析酒店主图，如果解析出来是空的，拿 cover_image 兜底
          let parsedImages = safeParseArray(hotelData.images);
          if (parsedImages.length === 0 && hotelData.cover_image) {
            parsedImages = [hotelData.cover_image];
          }

          const processedData = {
            ...hotelData,
            images: parsedImages, // 使用处理后的正常图片数组
            
            // 处理房间数据
            rooms: hotelData.rooms?.map((room: any) => {
              // ✅ 安全解析房型图片和设施
              const roomImages = safeParseArray(room.images);
              const roomTags = safeParseArray(room.facilities);

              return {
                ...room,
                // 取真实的数组的第一张作为展示图
                image: roomImages.length > 0 ? roomImages[0] : '', 
                name: room.room_type,
                desc: `${room.area}㎡ | ${room.bed_type} | ${room.floor}`,
                tags: roomTags, // 使用处理后的正常标签数组
                price: room.base_price
              };
            })
            // ✅ 按价格从高到低排序
            .sort((a: any, b: any) => b.price - a.price) || []
          };
          
          setDetail(processedData);
        } else {
          Toast.show({ content: res?.message || '加载失败' })
        }
      } catch (error) {
        Toast.show({ content: '加载失败' })
      } finally {
        setLoading(false)
      }
    }
    getHotelDetail()
  }, [id, beginDate, endDate]) // ✅ 添加日期依赖，日期变化时重新加载
  // 处理日期更新
  const handleDateConfirm = (start: Date, end: Date) => {
    const newBegin = dayjs(start).format('YYYY-MM-DD');
    const newEnd = dayjs(end).format('YYYY-MM-DD');

    // 更新 URL，这样刷新页面日期还在
    setSearchParams({
      beginDate: newBegin,
      endDate: newEnd
    });

    setShowCalendar(false);
    Toast.show('日期已更新');
  };

  // 数据加载动画
  if (loading) {
    return (
      <div style={{ paddingTop: '40vh', textAlign: 'center' }}>
        <DotLoading color='primary' /> 正在加载详情...
      </div>
    );
  }
  // 防止数据为空导致报错
  if (!detail) return <div>未找到酒店信息</div>;
  return (
    <div className={styles.container}>
      {/* 顶部透明导航栏 */}
      <div className={styles.navBarWrapper}>
        <div className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>

      {/* 1. 顶部轮播图 */}
      <div className={styles.swiperWrapper}>
        <Swiper loop autoplay>
          {/* 这里用 detail.images */}
          {detail.images.map((img: string, index: number) => (
            <Swiper.Item key={index} onClick={() => setVisible(true)}>
              <div className={styles.imageContainer}>
                <Image src={img} fit='cover' className={styles.heroImage} />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
        <div className={styles.imageCount} onClick={() => setVisible(true)}>
          {/*  修改点：这里用 detail.images.length */}
          <PictureOutline /> {detail.images.length}张
        </div>
      </div>

      {/* 图片预览组件 */}
      <ImageViewer.Multi
        images={detail.images}
        visible={visible}
        onClose={() => setVisible(false)}
      />

      {/* 2. 酒店核心信息卡片 */}
      <div className={styles.infoCard}>
        <div className={styles.hotelTitle}>
          {detail.name}
          {detail.star_rating && (
            <span className={styles.starBadge}>
              {detail.star_rating === 5 ? '五星级' : 
               detail.star_rating === 4 ? '四星级' : 
               detail.star_rating === 3 ? '三星级' : 
               detail.star_rating === 2 ? '二星级' : 
               detail.star_rating === 1 ? '一星级' : ''}
            </span>
          )}
        </div>

        <div className={styles.scoreRow}>
          <div className={styles.commentSummary}>
            {detail.description || '热门精选酒店'}
          </div>
          <div className={styles.mapLink}>
            地图 <EnvironmentOutline />
          </div>
        </div>

        <div className={styles.addressRow}>
          <LocationFill style={{ color: '#ff6b6b', fontSize: '14px', flexShrink: 0, marginTop: '2px' }} />
          {detail.address}
        </div>
      </div>

      {/* 日期选择条 (插在房型列表前面) */}
      <div className={styles.dateBarWrapper} onClick={() => setShowCalendar(true)}>
        <div className={styles.dateInfo}>
          <div className={styles.dateLabel}>入住</div>
          <div className={styles.dateVal}>{dayjs(beginDate).format('MM月DD日')}</div>
        </div>
        <div className={styles.nightInfo}>
          <span className={styles.nightPill}>共{nightCount}晚</span>
        </div>
        <div className={styles.dateInfo}>
          <div className={styles.dateLabel}>离店</div>
          <div className={styles.dateVal}>{dayjs(endDate).format('MM月DD日')}</div>
        </div>
        <div className={styles.dateArrow}>
          <CalendarOutline fontSize={18} color='#0052d9' />
          <span style={{ fontSize: 12, color: '#999', marginLeft: 4 }}>修改</span>
        </div>
      </div>

      {/* 3. 房型列表区域 */}
      <div className={styles.roomListWrapper}>
        <div className={styles.sectionTitle}>选择房型</div>

        {/* 这里用 detail.rooms.map，因为 Mock 数据里 rooms 在 detail 内部 */}
        {detail.rooms && detail.rooms.map((room: any) => {
          // ✅ 使用 available_rooms（后端返回的可用房间数）而不是 total_rooms
          const availableRooms = room.available_rooms ?? room.total_rooms ?? 0;
          const isSoldOut = availableRooms === 0;
          const isLowStock = availableRooms > 0 && availableRooms <= 2;
          
          return (
            <div 
              key={room.id} 
              className={`${styles.roomCard} ${isSoldOut ? styles.soldOut : ''}`}
            >
              <div className={styles.roomImgBox}>
                <Image src={room.image} fit='cover' className={styles.roomImg} />
                {isSoldOut && <div className={styles.soldOutMask}>已售罄</div>}
              </div>

            <div className={styles.roomInfo}>
              <div className={styles.roomName}>{room.name}</div>
              <div className={styles.roomDesc}>{room.desc}</div>

              <div className={styles.tagRow}>
                {room.tags.map((tag: string) => (
                  <span key={tag} className={styles.miniTag}>{tag}</span>
                ))}
              </div>

              <div className={styles.priceRow}>
                <div className={styles.priceBlock}>
                  <span className={styles.currency}>¥</span>
                  <span className={styles.price}>{room.price}</span>
                </div>
                {/* 预订按钮：根据房间数显示不同状态 */}
                <div
                  className={`${styles.bookBtn} ${isSoldOut ? styles.disabled : ''}`}
                  onClick={() => {
                    if (isSoldOut) return; // 无房间时禁止点击
                    navigate(
                      `/order/${room.id}?` +
                      `hotelId=${detail.id}&` +
                      `hotelName=${encodeURIComponent(detail.name)}&` +
                      `roomName=${encodeURIComponent(room.name)}&` +
                      `price=${room.price}&` +
                      `beginDate=${beginDate}&` +
                      `endDate=${endDate}&` +
                      `type=${type}`
                    )
                  }}
                >
                  {isSoldOut ? '无房间' : (
                    isLowStock ? (
                      <>
                        <FireFill style={{ marginRight: '4px', fontSize: '14px' }} />
                        仅剩{availableRooms}间
                      </>
                    ) : '预订'
                  )}
                </div>
              </div>
            </div>
          </div>
        )})}
      </div>

      {/* 底部安全区垫高 */}
      <div style={{ height: 40 }}></div>
      <DateRangePicker 
         visible={showCalendar}
         onClose={() => setShowCalendar(false)}
         defaultDate={[dayjs(beginDate).toDate(), dayjs(endDate).toDate()]}
         onConfirm={handleDateConfirm}
      />
    </div>
  );
};

export default HotelDetail;