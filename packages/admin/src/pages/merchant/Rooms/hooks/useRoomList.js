import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { getHotelList } from '../../../../services/hotelService';
import { createRoom, getRoomList, updateRoom as updateRoomAPI, deleteRoom as deleteRoomAPI } from '../../../../services/roomService';
import { useRoomStore } from '../../../../stores/roomStore';

/**
 * 房间列表管理 Hook
 */
const useRoomList = () => {
  const [hotels, setHotels] = useState([]);
  const [roomsData, setRoomsData] = useState({});
  const [loading, setLoading] = useState(false);
  
  // 使用 Zustand Store
  const addHotelRooms = useRoomStore(state => state.addHotelRooms);

  /**
   * 同步酒店的房间数（计算属性，不写入数据库）
   * 不再更新酒店列表中的房间数显示
   */
  const syncHotelRoomCount = useCallback(async (hotelId) => {
    try {
      // 获取该酒店的房间列表
      const response = await getRoomList({ hotel_id: hotelId });
      const roomList = response.data?.rooms || response.rooms || [];
      // 计算所有房间的 total_rooms 总和
      const roomCount = roomList.reduce((sum, room) => sum + (Number(room.total_rooms) || 0), 0);
      
      console.log(`✅ 同步酒店房间数: 酒店ID=${hotelId}, ${roomList.length}条记录, 总房间数=${roomCount}`);
      
      // 不再更新酒店列表中的显示
      
      return roomCount;
    } catch (error) {
      console.error('❌ 同步酒店房间数失败:', error.message);
      return 0;
    }
  }, []);

  /**
   * 加载酒店列表（获取所有酒店）
   */
  const loadHotels = useCallback(async () => {
    try {
      // 构建请求参数
      const params = {
        page: 1, 
        pageSize: 1000 
      };
      
      // 商户用户只能看到自己的酒店
      const user = useRoomStore.getState().user || JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.role_type === 2 && user?.id) {
        params.user_id = user.id;
        console.log('✅ 商户用户，添加 user_id 过滤:', user.id);
      }
      
      const response = await getHotelList(params);
      const hotelList = response.data?.list || response.list || [];
      
      console.log('✅ 加载酒店列表，共', hotelList.length, '条');
      
      // 房间管理页面显示所有酒店（不过滤状态）
      const hotelOptions = hotelList.map(hotel => ({
        value: hotel.id,
        label: hotel.name,
        totalRooms: 0,
      }));
      
      setHotels(hotelOptions);
    } catch (error) {
      console.error('❌ 加载酒店列表失败:', error);
      message.error('加载酒店列表失败');
    }
  }, []);

  /**
   * 加载指定酒店的房间列表
   */
  const loadRoomsByHotel = useCallback(async (hotelId) => {
    if (!hotelId) return;
    
    setLoading(true);
    try {
      const response = await getRoomList({ hotel_id: hotelId });
      
      // 后端返回格式：{success: true, data: {rooms: [...], total: 3}}
      const roomList = response.data?.rooms || response.rooms || [];
      
      // 转换房间数据格式
      const formattedRooms = roomList.map(room => {
        // 调试：输出原始房间数据
        console.log('📦 原始房间数据:', {
          id: room.id,
          room_type: room.room_type,
          bed_type: room.bed_type,
          max_occupancy: room.max_occupancy,
          所有字段: Object.keys(room)
        });
        
        const formattedRoom = {
          id: room.id,
          room_type_code: room.room_type_code, // ⭐ 房型编号
          room_type: room.room_type, // 房型名称
          room_type_en: room.room_type_en,
          bed_type: room.bed_type, // ⭐ 床型
          area: room.area, // ⭐ 面积
          floor: room.floor,
          max_occupancy: room.max_occupancy, // ⭐ 最多入住人数
          base_price: room.base_price, // ⭐ 价格
          total_rooms: room.total_rooms,
          room_numbers: room.room_numbers ? JSON.parse(room.room_numbers) : [], // ⭐ 房间号列表
          facilities: room.facilities ? JSON.parse(room.facilities) : [],
          description: room.description,
          images: room.images ? JSON.parse(room.images) : [],
          // 以下字段用于兼容旧代码
          roomNumber: room.room_type_code, // 映射为房型编号
          type: room.room_type,
          type_en: room.room_type_en,
          price: room.base_price,
        };
        
        console.log(`✅ 房型 ${formattedRoom.room_type_code} (${formattedRoom.room_type}) - 床型: ${formattedRoom.bed_type}, 入住人数: ${formattedRoom.max_occupancy}`);
        return formattedRoom;
      });
      
      console.log(`✅ 加载房间列表成功: 酒店ID=${hotelId}, 房间数=${formattedRooms.length}`);
      
      // 输出房间状态统计，用于调试
      const statusStats = formattedRooms.reduce((acc, room) => {
        acc[room.status] = (acc[room.status] || 0) + 1;
        return acc;
      }, {});
      console.log('📊 房间状态统计:', statusStats);
      
      // 缓存房间列表到 Context（用于订单页面）
      if (Array.isArray(roomList) && roomList.length > 0) {
        try {
          // 从 API 获取酒店名称
          let hotelName = '';
          try {
            const hotelResponse = await getHotelList();
            const hotelList = hotelResponse.data?.list || hotelResponse.list || [];
            const foundHotel = hotelList.find(h => h.id === hotelId);
            hotelName = foundHotel?.name || '';
            console.log('✅ 从 API 获取酒店名称:', hotelName, '酒店ID:', hotelId);
          } catch (e) {
            console.warn('⚠️ 从 API 获取酒店名称失败:', e);
          }
          
          if (!hotelName) {
            console.warn('⚠️ 无法获取酒店名称，酒店ID:', hotelId);
          }
          
          // 使用 Context 缓存房间数据
          addHotelRooms(hotelId, roomList, hotelName);
        } catch (e) {
          console.warn('⚠️ 缓存房间列表失败:', e);
        }
      }
      
      setRoomsData(prev => ({
        ...prev,
        [hotelId]: formattedRooms,
      }));
    } catch (error) {
      console.error('❌ 加载房间列表失败:', error.message);
      message.error('加载房间列表失败');
      setRoomsData(prev => ({
        ...prev,
        [hotelId]: [],
      }));
    } finally {
      setLoading(false);
    }
  }, [addHotelRooms]);

  /**
   * 初始化：加载酒店列表
   */
  useEffect(() => {
    loadHotels();
  }, [loadHotels]);

  /**
   * 获取指定酒店的房间列表
   */
  const getRoomsByHotel = useCallback((hotelId) => {
    return roomsData[hotelId] || [];
  }, [roomsData]);

  /**
   * 计算房间统计数据
   */
  const calculateStats = useCallback((rooms) => {
    return {
      total: rooms.length,
      available: rooms.filter(r => r.status === 1).length,      // 可预订
      occupied: rooms.filter(r => r.status === 2).length,       // 已入住
      reserved: rooms.filter(r => r.status === 3).length,       // 已预订
      cleaning: rooms.filter(r => r.status === 4).length,       // 清洁中
    };
  }, []);

  /**
   * 添加房间
   */
  const addRoom = useCallback(async (roomData) => {
    try {
      setLoading(true);
      
      console.log('🔄 useRoomList v3.0 - 字段名映射：room_number -> room_type_code');
      console.log('📝 原始房间数据:', roomData);
      
      // 构建提交数据 - 映射字段名到后端期望的格式
      const submitData = {
        hotel_id: roomData.hotel_id,
        room_type_code: roomData.room_number, // ⭐ 前端的 room_number 映射为后端的 room_type_code
        room_type: roomData.room_type,
        room_type_en: roomData.room_type_en || '',
        bed_type: roomData.bed_type,
        area: Number(roomData.area),
        floor: String(roomData.floor), // 字符串类型
        max_occupancy: Number(roomData.max_occupancy),
        base_price: Number(roomData.base_price),
        total_rooms: Number(roomData.total_rooms),
        room_numbers: JSON.stringify(roomData.room_numbers || []), // ⭐ 房间号列表（必需）
        facilities: JSON.stringify(Array.isArray(roomData.facilities) ? roomData.facilities : []),
        description: roomData.description || '',
        images: JSON.stringify(roomData.images || []),
        booked_by: "0", // 默认无人预定
      };
      
      console.log('📤 提交数据字段列表:', Object.keys(submitData));
      console.log('📤 提交数据详情:', JSON.stringify(submitData, null, 2));
      console.log('✅ 字段映射: room_number -> room_type_code =', submitData.room_type_code);
      
      await createRoom(submitData);
      console.log(`✅ 添加房间成功: ${submitData.room_type_code}`);
      message.success('房间添加成功！');
      
      // 重新加载该酒店的房间列表
      await loadRoomsByHotel(roomData.hotel_id);
      
      // 记录房间数变化（计算属性，不写入数据库）
      await syncHotelRoomCount(roomData.hotel_id);
      
      return true;
    } catch (error) {
      console.error('❌ 添加房间失败:', error.message);
      message.error(error.message || '添加房间失败，请重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadRoomsByHotel, syncHotelRoomCount]);

  /**
   * 更新房间
   */
  const updateRoom = useCallback(async (roomId, roomData) => {
    try {
      setLoading(true);
      
      console.log('🔄 更新房间 - 字段名映射：room_number -> room_type_code');
      
      // 构建提交数据（id 放在 Body 中）
      const submitData = {
        id: roomId, // ⭐ id 作为 Body 参数
        hotel_id: roomData.hotel_id,
        room_type_code: roomData.room_number, // ⭐ 前端的 room_number 映射为后端的 room_type_code
        room_type: roomData.room_type,
        room_type_en: roomData.room_type_en || '',
        bed_type: roomData.bed_type,
        area: Number(roomData.area),
        floor: String(roomData.floor), // 字符串类型
        max_occupancy: Number(roomData.max_occupancy),
        base_price: Number(roomData.base_price),
        total_rooms: Number(roomData.total_rooms),
        room_numbers: JSON.stringify(roomData.room_numbers || []), // ⭐ 房间号列表（必需）
        facilities: JSON.stringify(Array.isArray(roomData.facilities) ? roomData.facilities : []),
        description: roomData.description || '',
        images: JSON.stringify(roomData.images || []),
        booked_by: roomData.booked_by || "0", // 保留原有预定人
      };
      
      console.log('📤 更新数据详情:', JSON.stringify(submitData, null, 2));
      
      await updateRoomAPI(roomId, submitData);
      console.log(`✅ 更新房间成功: ID=${roomId}, 房型编号=${submitData.room_type_code}`);
      message.success('房间更新成功！');
      
      // 重新加载该酒店的房间列表
      await loadRoomsByHotel(roomData.hotel_id);
      
      return true;
    } catch (error) {
      console.error('❌ 更新房间失败:', error.message);
      message.error(error.message || '更新房间失败，请重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadRoomsByHotel]);

  /**
   * 删除房间
   */
  const deleteRoom = useCallback(async (roomId, hotelId) => {
    try {
      setLoading(true);
      
      await deleteRoomAPI(roomId);
      console.log(`✅ 删除房间成功: ID=${roomId}`);
      message.success('房间删除成功！');
      
      // 重新加载该酒店的房间列表
      if (hotelId) {
        await loadRoomsByHotel(hotelId);
        // 记录房间数变化（计算属性，不写入数据库）
        await syncHotelRoomCount(hotelId);
      }
      
      return true;
    } catch (error) {
      console.error('❌ 删除房间失败:', error.message);
      message.error(error.message || '删除房间失败，请重试');
      return false;
    } finally {
      setLoading(false);
    }
  }, [loadRoomsByHotel, syncHotelRoomCount]);

  /**
   * 刷新房间列表
   */
  const refreshRooms = useCallback((hotelId) => {
    if (hotelId) {
      loadRoomsByHotel(hotelId);
    }
  }, [loadRoomsByHotel]);

  return {
    hotels,
    roomsData,
    loading,
    getRoomsByHotel,
    calculateStats,
    addRoom,
    updateRoom,
    deleteRoom,
    refreshRooms,
    loadRoomsByHotel,
  };
};

export default useRoomList;
