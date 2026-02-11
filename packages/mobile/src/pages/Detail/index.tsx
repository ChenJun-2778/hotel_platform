import React, { useState, useEffect } from 'react';
import { NavBar, Swiper, Image, Toast, Tag, ImageViewer, DotLoading } from 'antd-mobile';
import { useNavigate, useParams } from 'react-router-dom';
import { StarFill, EnvironmentOutline, PictureOutline } from 'antd-mobile-icons';
import styles from './index.module.css';
import {apiGetHotelDetail} from '@/api/hotel'

const HotelDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // 获取 URL 里的酒店 ID

  // --- 1. 模拟酒店详情数据 ---
  // const hotelInfo = {
  //   id: id,
  //   name: '上海陆家嘴禧玥酒店',
  //   score: 4.8,
  //   scoreText: '超棒',
  //   tags: ['高档型', '近外滩', '新中式'],
  //   address: '浦东新区富城路201号',
  //   images: [
  //     'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  //     'https://images.unsplash.com/photo-1582719508461-905c673771fd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60',
  //     'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'
  //   ]
  // };

  // // --- 2. 模拟房型列表数据 ---
  // const roomList = [
  //   {
  //     id: 101,
  //     name: '雅致大床房',
  //     desc: '35㎡ | 大床 | 有窗',
  //     tags: ['含早', '免费取消', '即使确认'],
  //     price: 936,
  //     image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
  //   },
  //   {
  //     id: 102,
  //     name: '江景豪华双床房',
  //     desc: '45㎡ | 双床 | 落地窗看江',
  //     tags: ['双早', '不可取消'],
  //     price: 1280,
  //     image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
  //   },
  //   {
  //     id: 103,
  //     name: '行政套房 (270度景观)',
  //     desc: '68㎡ | 特大床 | 行政礼遇',
  //     tags: ['行政酒廊', '延迟退房', '免费下午茶'],
  //     price: 2450,
  //     image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=60'
  //   }
  // ];
  // 1. 定义状态
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
        Toast.show({content: '加载失败'})
      } finally {
        setLoading(false)
      }
    }
    getHotelDetail()
  },[id])

  // 控制图片预览
  const [visible, setVisible] = useState(false);
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
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
      </div>

      {/* 1. 顶部轮播图 */}
      <div className={styles.swiperWrapper}>
        <Swiper loop autoplay>
          {/* ✅ 修改点：这里用 detail.images */}
          {detail.images.map((img: string, index: number) => (
            <Swiper.Item key={index} onClick={() => setVisible(true)}>
              <div className={styles.imageContainer}>
                <Image src={img} fit='cover' className={styles.heroImage} />
              </div>
            </Swiper.Item>
          ))}
        </Swiper>
        <div className={styles.imageCount} onClick={() => setVisible(true)}>
            {/* ✅ 修改点：这里用 detail.images.length */}
            <PictureOutline /> {detail.images.length}张
        </div>
      </div>

      {/* 图片预览组件 */}
      <ImageViewer.Multi
        images={detail.images} // ✅ 修改点
        visible={visible}
        onClose={() => setVisible(false)}
      />

      {/* 2. 酒店核心信息卡片 */}
      <div className={styles.infoCard}>
        <div className={styles.hotelTitle}>
            {/* ✅ 修改点：这里用 detail.name */}
            {detail.name}
            <span className={styles.starBadge}>五星级</span>
        </div>
        
        <div className={styles.scoreRow}>
            <div className={styles.scoreBlock}>
                {/* ✅ 修改点：这里用 detail.score */}
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

      {/* 3. 房型列表区域 */}
      <div className={styles.roomListWrapper}>
        <div className={styles.sectionTitle}>选择房型</div>
        
        {/* ✅ 修改点：这里用 detail.rooms.map，因为 Mock 数据里 rooms 在 detail 内部 */}
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
                                // 跳转传参
                                navigate(`/order/${room.id}?roomName=${room.name}&price=${room.price}`)
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
      <div style={{height: 40}}></div>
    </div>
  );
};

export default HotelDetail;