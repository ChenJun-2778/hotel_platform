import { useState, useEffect } from 'react';
import { message } from 'antd';
import { createHotel, getHotelList, updateHotel } from '../../../../services/hotelService';
import { HOTEL_STATUS } from '../../../../constants/hotelStatus';

/**
 * 酒店列表管理 Hook
 */
const useHotelList = () => {
  const [hotelList, setHotelList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 加载酒店列表
  const loadHotelList = async () => {
    setLoading(true);
    try {
      const response = await getHotelList();
      const hotels = response.data || response || [];
      setHotelList(Array.isArray(hotels) ? hotels : []);
      
      // 假数据（已注释）
      // const mockHotels = [
      //   {
      //     id: 1,
      //     name: '易宿豪华酒店',
      //     name_en: 'Yisu Luxury Hotel',
      //     brand: '易宿连锁',
      //     star_level: 5,
      //     country: '中国',
      //     province: '浙江省',
      //     city: '杭州市',
      //     district: '西湖区',
      //     address: '文三路123号',
      //     phone: '0571-12345678',
      //     contact_person: '张经理',
      //     contact_phone: '+86-13800138000',
      //     facilities: ['WiFi', '停车场', '餐厅', '健身房', '游泳池'],
      //     cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      //     images: [
      //       'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      //       'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
      //     ],
      //     description: '位于市中心，交通便利，环境优雅',
      //     check_in_time: '14:00',
      //     check_out_time: '12:00',
      //     total_rooms: 50,
      //     status: 1,
      //   },
      //   {
      //     id: 2,
      //     name: '易宿商务酒店',
      //     name_en: 'Yisu Business Hotel',
      //     brand: '易宿连锁',
      //     star_level: 4,
      //     country: '中国',
      //     province: '浙江省',
      //     city: '杭州市',
      //     district: '滨江区',
      //     address: '江南大道456号',
      //     phone: '0571-23456789',
      //     contact_person: '李经理',
      //     contact_phone: '+86-13900139000',
      //     facilities: ['WiFi', '停车场', '会议室', '商务中心'],
      //     cover_image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800',
      //     images: [
      //       'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800',
      //     ],
      //     description: '商务出行首选，配套设施齐全',
      //     check_in_time: '14:00',
      //     check_out_time: '12:00',
      //     total_rooms: 30,
      //     status: 1,
      //   },
      //   {
      //     id: 3,
      //     name: '易宿精品民宿',
      //     name_en: 'Yisu Boutique Inn',
      //     brand: '易宿连锁',
      //     star_level: 3,
      //     country: '中国',
      //     province: '浙江省',
      //     city: '杭州市',
      //     district: '西湖区',
      //     address: '龙井路789号',
      //     phone: '0571-34567890',
      //     contact_person: '王经理',
      //     contact_phone: '+86-13700137000',
      //     facilities: ['WiFi', '停车场', '茶室', '花园'],
      //     cover_image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
      //     images: [
      //       'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
      //       'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800',
      //     ],
      //     description: '西湖边的精品民宿，环境清幽',
      //     check_in_time: '15:00',
      //     check_out_time: '11:00',
      //     total_rooms: 15,
      //     status: 2,
      //   },
      // ];
      // setHotelList(mockHotels);
    } catch (error) {
      console.error('加载酒店列表失败:', error);
      message.error('加载酒店列表失败，请重试');
      setHotelList([]);
    } finally {
      setLoading(false);
    }
  };

  // 添加酒店
  const addHotel = async (hotelData) => {
    try {
      await createHotel(hotelData);
      message.success('酒店添加成功！');
      await loadHotelList(); // 重新加载列表
      return true;
    } catch (error) {
      console.error('添加酒店失败:', error);
      message.error('添加酒店失败，请重试');
      return false;
    }
  };

  // 更新酒店
  const updateHotelData = async (id, hotelData) => {
    try {
      await updateHotel(id, hotelData);
      message.success('酒店更新成功！');
      await loadHotelList(); // 重新加载列表
      return true;
    } catch (error) {
      console.error('更新酒店失败:', error);
      message.error('更新酒店失败，请重试');
      return false;
    }
  };

  // 组件加载时获取列表
  useEffect(() => {
    loadHotelList();
  }, []);

  return {
    hotelList,
    loading,
    loadHotelList,
    addHotel,
    updateHotelData,
  };
};

export default useHotelList;
