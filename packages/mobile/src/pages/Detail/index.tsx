import React, { useState, useEffect } from 'react';
import { NavBar, Swiper, Image, Toast, Tag, ImageViewer, DotLoading } from 'antd-mobile';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { StarFill, EnvironmentOutline, PictureOutline, CalendarOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
import { apiGetHotelDetail } from '@/api/hotel'
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
  const nightCount = dayjs(endDate).diff(dayjs(beginDate), 'day');
  // 1. 定义状态
  const [showCalendar, setShowCalendar] = useState(false); // 控制日历显示
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false); // 控制图片预览
  useEffect(() => {
    const getHotelDetail = async () => {
      if (!id) return
      setLoading(true)
      try {
        const res: any = await apiGetHotelDetail(id)
        if (res?.code === 200) {
          setDetail(res.data)
        }
      } catch (error) {
        Toast.show({ content: '加载失败' })
      } finally {
        setLoading(false)
      }
    }
    getHotelDetail()
  }, [id])
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
          {/* 这里用 detail.name */}
          {detail.name}
          <span className={styles.starBadge}>五星级</span>
        </div>

        <div className={styles.scoreRow}>
          <div className={styles.scoreBlock}>
            {/* 这里用 detail.score */}
            <span className={styles.score}>{detail.score}</span>
            <span className={styles.scoreText}>{detail.scoreText}</span>
          </div>
          <div className={styles.commentSummary}>
            "服务周到" · "位置优越" · "早餐丰富"
          </div>
          <div className={styles.mapLink}>
            地图 <EnvironmentOutline />
          </div>
        </div>

        <div className={styles.addressRow}>{detail.address}</div>
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
        {detail.rooms && detail.rooms.map((room: any) => (
          <div key={room.id} className={styles.roomCard}>
            <div className={styles.roomImgBox}>
              <Image src={room.image} fit='cover' className={styles.roomImg} />
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
                {/* 预订按钮 */}
                <div
                  className={styles.bookBtn}
                  onClick={() => {
                    navigate(
                      `/order/${room.id}?` +
                      `beginDate=${beginDate}&` +
                      `endDate=${endDate}`
                    )
                  }}
                >
                  预订
                </div>
              </div>
            </div>
          </div>
        ))}
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