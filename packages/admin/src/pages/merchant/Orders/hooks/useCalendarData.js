import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { getHotelList } from '../../../../services/hotelService';
import { getRoomList } from '../../../../services/roomService';
import { useRoomStore } from '../../../../stores/roomStore';
import { useAuthStore } from '../../../../stores/authStore';
import useOrderList from './useOrderList';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * 日历数据管理 Hook
 * 负责获取和计算日历视图所需的所有数据
 */
const useCalendarData = (selectedDate, selectedHotel) => {
  const [hotels, setHotels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const user = useAuthStore(state => state.user);
  const getAssignedRoom = useRoomStore(state => state.getAssignedRoom);
  const { orders, loading: ordersLoading } = useOrderList();

  /**
   * 加载酒店列表
   */
  useEffect(() => {
    const loadHotels = async () => {
      try {
        const response = await getHotelList();
        const hotelList = response.data?.list || response.list || [];
        
        // 转换为下拉选项格式
        const hotelOptions = [
          { value: null, label: '全部酒店' },
          ...hotelList.map(hotel => ({
            value: hotel.id,
            label: hotel.name,
          }))
        ];
        
        setHotels(hotelOptions);
        console.log('✅ 加载酒店列表成功:', hotelList.length);
      } catch (error) {
        console.error('❌ 加载酒店列表失败:', error);
        message.error('加载酒店列表失败');
      }
    };

    loadHotels();
  }, []);

  /**
   * 加载房间列表
   */
  useEffect(() => {
    const loadRooms = async () => {
      if (!user?.id) return;
      
      setLoading(true);
      try {
        let allRooms = [];
        
        if (selectedHotel) {
          // 加载指定酒店的房间
          const response = await getRoomList({ hotel_id: selectedHotel });
          const roomList = response.data?.rooms || response.rooms || [];
          allRooms = roomList;
        } else {
          // 加载所有酒店的房间
          const hotelList = hotels.filter(h => h.value !== null);
          for (const hotel of hotelList) {
            try {
              const response = await getRoomList({ hotel_id: hotel.value });
              const roomList = response.data?.rooms || response.rooms || [];
              allRooms = [...allRooms, ...roomList];
            } catch (err) {
              console.warn(`⚠️ 加载酒店 ${hotel.label} 的房间失败:`, err);
            }
          }
        }
        
        setRooms(allRooms);
        console.log('✅ 加载房间列表成功:', allRooms.length);
      } catch (error) {
        console.error('❌ 加载房间列表失败:', error);
        message.error('加载房间列表失败');
      } finally {
        setLoading(false);
      }
    };

    if (hotels.length > 0) {
      loadRooms();
    }
  }, [selectedHotel, hotels, user]);

  /**
   * 计算指定日期的房间预订情况
   */
  const roomBookings = useMemo(() => {
    return rooms.map(room => {
      // 查找该房间在选定日期的订单
      const order = orders.find(order => {
        // 获取前端分配的房间号
        const assignedRoom = getAssignedRoom(order.orderNo);
        const roomMatch = assignedRoom === room.room_number;
        
        // 检查日期是否在订单范围内
        const checkIn = dayjs(order.checkIn);
        const checkOut = dayjs(order.checkOut);
        const isInRange = selectedDate.isSameOrAfter(checkIn, 'day') && 
                         selectedDate.isBefore(checkOut, 'day');
        
        return roomMatch && isInRange && room.hotel_id === order.hotelId;
      });

      // 确定房间状态
      let status = room.status || 1; // 默认可预订
      if (order) {
        // 根据订单状态和日期判断房间状态
        const checkIn = dayjs(order.checkIn);
        const isCheckInDay = selectedDate.isSame(checkIn, 'day');
        
        if (order.status === 3 && isCheckInDay) {
          status = 3; // 已预订（待入住）
        } else if (order.status === 3 && selectedDate.isAfter(checkIn, 'day')) {
          status = 2; // 已入住
        } else if (order.status === 2) {
          status = 3; // 待确定（显示为已预订）
        }
      }

      return {
        id: room.id,
        roomNumber: room.room_number,
        type: room.room_type,
        price: room.base_price,
        hotel: room.hotel_name || '未知酒店',
        hotelId: room.hotel_id,
        floor: room.floor,
        status: status,
        order: order || null,
      };
    });
  }, [rooms, orders, selectedDate, getAssignedRoom]);

  /**
   * 统计信息
   */
  const stats = useMemo(() => {
    const total = roomBookings.length;
    const available = roomBookings.filter(r => r.status === 1).length;
    const occupied = roomBookings.filter(r => r.status === 2).length;
    const reserved = roomBookings.filter(r => r.status === 3).length;
    const cleaning = roomBookings.filter(r => r.status === 4).length;
    const booked = occupied + reserved;
    
    return {
      total,
      available,
      occupied,
      reserved,
      cleaning,
      booked,
      occupancyRate: total > 0 ? ((booked / total) * 100).toFixed(1) : 0,
    };
  }, [roomBookings]);

  return {
    hotels,
    roomBookings,
    stats,
    loading: loading || ordersLoading,
  };
};

export default useCalendarData;
