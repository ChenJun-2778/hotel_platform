import { useState, useEffect, useMemo } from 'react';
import { message } from 'antd';
import { getHotelList } from '../../../../services/hotelService';
import { getCalendarData } from '../../../../services/orderService';
import { useAuthStore } from '../../../../stores/authStore';

/**
 * 日历数据管理 Hook
 * 负责获取和计算日历视图所需的所有数据
 */
const useCalendarData = (selectedDate, selectedHotel) => {
  const [hotels, setHotels] = useState([]);
  const [calendarData, setCalendarData] = useState({
    date: '',
    totalRooms: 0,
    freeRooms: 0,
    occupiedRooms: 0,
    occupancyRate: 0,
    rooms: [],
  });
  const [loading, setLoading] = useState(false);
  
  const user = useAuthStore(state => state.user);

  /**
   * 加载酒店列表（获取所有酒店）
   */
  useEffect(() => {
    const loadHotels = async () => {
      try {
        // 构建请求参数
        const params = {
          page: 1, 
          pageSize: 1000 
        };
        
        // 商户用户只能看到自己的酒店
        if (user?.role_type === 2 && user?.id) {
          params.user_id = user.id;
          console.log('✅ 商户用户，添加 user_id 过滤:', user.id);
        }
        
        const response = await getHotelList(params);
        const hotelList = response.data?.list || response.list || [];
        
        console.log('✅ 加载酒店列表成功:', hotelList.length);
        
        // 只显示营业中的酒店（status=1）
        const onlineHotels = hotelList.filter(hotel => hotel.status === 1);
        console.log('✅ 营业中的酒店:', onlineHotels.length, '条');
        
        // 转换为下拉选项格式
        const hotelOptions = [
          { value: null, label: '全部酒店' },
          ...onlineHotels.map(hotel => ({
            value: hotel.id,
            label: hotel.name,
          }))
        ];
        
        setHotels(hotelOptions);
      } catch (error) {
        console.error('❌ 加载酒店列表失败:', error);
        message.error('加载酒店列表失败');
      }
    };

    loadHotels();
  }, [user]);

  /**
   * 加载日历数据
   */
  useEffect(() => {
    const loadCalendarData = async () => {
      if (!user?.id || !selectedDate) return;
      
      setLoading(true);
      try {
        const dateStr = selectedDate.format('YYYY-MM-DD');
        
        // 如果选择了特定酒店，直接请求该酒店的数据
        if (selectedHotel) {
          const params = {
            user_id: user.id,
            date: dateStr,
            hotel_id: selectedHotel,
          };
          
          console.log('📅 加载单个酒店日历数据 - 参数:', params);
          const response = await getCalendarData(params);
          const data = response.data || response;
          
          // 为每个房间添加酒店信息
          const hotelInfo = hotels.find(h => h.value === selectedHotel);
          const roomsWithHotel = (data.rooms || []).map(room => ({
            ...room,
            hotel_id: selectedHotel,
            hotel_name: hotelInfo?.label || '',
          }));
          
          setCalendarData({
            date: data.date || dateStr,
            totalRooms: data.totalRooms || 0,
            freeRooms: data.freeRooms || 0,
            occupiedRooms: data.occupiedRooms || 0,
            occupancyRate: data.occupancyRate || 0,
            rooms: roomsWithHotel,
          });
        } else {
          // 全部酒店模式：遍历所有营业中的酒店，分别请求数据
          console.log('📅 加载全部酒店日历数据');
          const onlineHotels = hotels.filter(h => h.value !== null); // 排除"全部酒店"选项
          
          if (onlineHotels.length === 0) {
            setCalendarData({
              date: dateStr,
              totalRooms: 0,
              freeRooms: 0,
              occupiedRooms: 0,
              occupancyRate: 0,
              rooms: [],
            });
            return;
          }
          
          // 并发请求所有酒店的数据
          const promises = onlineHotels.map(hotel => 
            getCalendarData({
              user_id: user.id,
              date: dateStr,
              hotel_id: hotel.value,
            }).then(response => {
              const data = response.data || response;
              // 为每个房间添加酒店信息
              return {
                hotelId: hotel.value,
                hotelName: hotel.label,
                data: data,
              };
            }).catch(error => {
              console.error(`❌ 加载酒店 ${hotel.label} 数据失败:`, error);
              return null;
            })
          );
          
          const results = await Promise.all(promises);
          const validResults = results.filter(r => r !== null);
          
          console.log('✅ 成功加载', validResults.length, '个酒店的数据');
          
          // 合并所有酒店的数据
          let totalRooms = 0;
          let freeRooms = 0;
          let occupiedRooms = 0;
          const allRooms = [];
          
          validResults.forEach(result => {
            totalRooms += result.data.totalRooms || 0;
            freeRooms += result.data.freeRooms || 0;
            occupiedRooms += result.data.occupiedRooms || 0;
            
            // 为每个房间添加酒店信息
            const roomsWithHotel = (result.data.rooms || []).map(room => ({
              ...room,
              hotel_id: result.hotelId,
              hotel_name: result.hotelName,
            }));
            
            allRooms.push(...roomsWithHotel);
          });
          
          const occupancyRate = totalRooms > 0 
            ? Number(((occupiedRooms / totalRooms) * 100).toFixed(1))
            : 0;
          
          console.log('✅ 合并后的统计:', {
            totalRooms,
            freeRooms,
            occupiedRooms,
            occupancyRate,
            roomsCount: allRooms.length,
          });
          
          setCalendarData({
            date: dateStr,
            totalRooms,
            freeRooms,
            occupiedRooms,
            occupancyRate,
            rooms: allRooms,
          });
        }
      } catch (error) {
        console.error('❌ 加载日历数据失败:', error);
        message.error('加载日历数据失败，请重试');
        setCalendarData({
          date: selectedDate.format('YYYY-MM-DD'),
          totalRooms: 0,
          freeRooms: 0,
          occupiedRooms: 0,
          occupancyRate: 0,
          rooms: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadCalendarData();
  }, [selectedDate, selectedHotel, user, hotels]);

  /**
   * 按房型分组房间数据（单个酒店模式）
   */
  const groupedByRoomType = useMemo(() => {
    const groups = {};
    
    calendarData.rooms.forEach((room) => {
      const roomType = room.room_type || room.roomType || room.type || '未知房型';
      const roomTypeCode = room.room_type_code || room.roomTypeCode || room.room_number || roomType;
      const basePrice = room.base_price || room.basePrice || room.price || 0;
      const roomNumber = room.roomNo || room.room_number || room.roomNumber || room.number || '';
      const available = room.available !== undefined ? room.available : true;
      const hotelId = room.hotel_id || room.hotelId || '';
      const hotelName = room.hotel_name || room.hotelName || '';
      
      const key = `${hotelId}-${roomType}`;
      
      if (!groups[key]) {
        groups[key] = {
          room_type_code: roomTypeCode,
          room_type: roomType,
          base_price: basePrice,
          hotel_id: hotelId,
          hotel_name: hotelName,
          room_numbers: [],
        };
      }
      
      groups[key].room_numbers.push({
        roomNumber: roomNumber,
        available: available,
        order: room.order || null,
      });
    });
    
    return Object.values(groups);
  }, [calendarData.rooms]);

  /**
   * 按酒店分组房间数据（全部酒店模式）
   */
  const groupedByHotel = useMemo(() => {
    if (selectedHotel) {
      // 单个酒店模式，不需要按酒店分组
      return null;
    }
    
    const hotelGroups = {};
    
    groupedByRoomType.forEach(roomType => {
      const hotelId = roomType.hotel_id;
      const hotelName = roomType.hotel_name || '未知酒店';
      
      if (!hotelGroups[hotelId]) {
        hotelGroups[hotelId] = {
          hotelId,
          hotelName,
          roomTypes: [],
        };
      }
      
      hotelGroups[hotelId].roomTypes.push(roomType);
    });
    
    console.log('✅ 按酒店分组完成 - 总酒店数:', Object.keys(hotelGroups).length);
    
    return Object.values(hotelGroups);
  }, [groupedByRoomType, selectedHotel]);

  /**
   * 统计信息
   */
  const stats = useMemo(() => {
    return {
      total: calendarData.totalRooms,
      available: calendarData.freeRooms,
      booked: calendarData.occupiedRooms,
      occupancyRate: calendarData.occupancyRate,
    };
  }, [calendarData]);

  return {
    hotels,
    roomBookings: groupedByRoomType,
    hotelGroups: groupedByHotel,
    stats,
    loading,
  };
};

export default useCalendarData;
