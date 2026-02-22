import { useState, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { getHotelList } from '../../../../services/hotelService';
import { createRoom, getRoomList, updateRoom as updateRoomAPI, deleteRoom as deleteRoomAPI } from '../../../../services/roomService';

/**
 * 房间列表管理 Hook
 */
const useRoomList = () => {
  const [hotels, setHotels] = useState([]);
  const [roomsData, setRoomsData] = useState({});
  const [loading, setLoading] = useState(false);

  /**
   * 同步酒店的房间数（计算属性，不写入数据库）
   * 返回该酒店的实际房间数
   */
  const syncHotelRoomCount = useCallback(async (hotelId) => {
    try {
      // 获取该酒店的房间列表
      const response = await getRoomList({ hotel_id: hotelId });
      const roomList = response.data?.rooms || response.rooms || [];
      const roomCount = roomList.length;
      
      console.log(`✅ 同步酒店房间数: 酒店ID=${hotelId}, 房间数=${roomCount}`);
      
      // 注意：房间数作为计算属性，不写入数据库
      // 在查看详情和编辑时会实时计算
      
      return roomCount;
    } catch (error) {
      console.error('❌ 同步酒店房间数失败:', error.message);
      return 0;
    }
  }, []);

  /**
   * 加载酒店列表
   */
  const loadHotels = useCallback(async () => {
    try {
      const response = await getHotelList();
      const hotelList = response.data?.list || response.list || [];
      
      // 转换为下拉选项格式
      const hotelOptions = hotelList.map(hotel => ({
        value: hotel.id,
        label: hotel.name,
        totalRooms: hotel.room_number || 0,
      }));
      
      setHotels(hotelOptions);
    } catch (error) {
      console.error('加载酒店列表失败:', error);
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
        // 确保 status 是有效的数字（1-4）
        let status = Number(room.status);
        if (isNaN(status) || status < 1 || status > 4) {
          console.warn(`⚠️ 房间 ${room.room_number} 状态值无效: ${room.status}，默认设为1（可预订）`);
          status = 1;
        }
        
        const formattedRoom = {
          id: room.id,
          roomNumber: room.room_number,
          type: room.room_type,
          type_en: room.room_type_en,
          bed_type: room.bed_type,
          area: room.area,
          floor: room.floor, // 字符串类型，如 "28层"
          max_occupancy: room.max_occupancy,
          price: room.base_price,
          total_rooms: room.total_rooms,
          available_rooms: room.available_rooms,
          facilities: room.facilities ? JSON.parse(room.facilities) : [],
          description: room.description,
          images: room.images ? JSON.parse(room.images) : [],
          status: status, // 确保是数字类型：1=可预订, 2=已入住, 3=已预订, 4=清洁中
          booked_by: room.booked_by, // 预定人ID，"0"表示无人预定
        };
        
        console.log(`✅ 房间 ${formattedRoom.roomNumber} - 状态: ${formattedRoom.status} (${typeof formattedRoom.status})`);
        return formattedRoom;
      });
      
      console.log(`✅ 加载房间列表成功: 酒店ID=${hotelId}, 房间数=${formattedRooms.length}`);
      
      // 输出房间状态统计，用于调试
      const statusStats = formattedRooms.reduce((acc, room) => {
        acc[room.status] = (acc[room.status] || 0) + 1;
        return acc;
      }, {});
      console.log('📊 房间状态统计:', statusStats);
      
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
  }, []);

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
      
      // 构建提交数据
      const submitData = {
        hotel_id: roomData.hotel_id,
        room_number: roomData.room_number,
        room_type: roomData.room_type,
        room_type_en: roomData.room_type_en || '',
        bed_type: roomData.bed_type,
        area: Number(roomData.area),
        floor: String(roomData.floor), // 字符串类型
        max_occupancy: Number(roomData.max_occupancy),
        base_price: Number(roomData.base_price),
        total_rooms: Number(roomData.total_rooms),
        available_rooms: Number(roomData.available_rooms),
        facilities: JSON.stringify(Array.isArray(roomData.facilities) ? roomData.facilities : []),
        description: roomData.description || '',
        images: JSON.stringify(roomData.images || []),
        status: 1, // 新建房间默认为1（可预订）
        booked_by: "0", // 默认无人预定
      };
      
      await createRoom(submitData);
      console.log(`✅ 添加房间成功: ${submitData.room_number}`);
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
      
      // 构建提交数据（id 放在 Body 中）
      const submitData = {
        id: roomId, // ⭐ id 作为 Body 参数
        hotel_id: roomData.hotel_id,
        room_number: roomData.room_number,
        room_type: roomData.room_type,
        room_type_en: roomData.room_type_en || '',
        bed_type: roomData.bed_type,
        area: Number(roomData.area),
        floor: String(roomData.floor), // 字符串类型
        max_occupancy: Number(roomData.max_occupancy),
        base_price: Number(roomData.base_price),
        total_rooms: Number(roomData.total_rooms),
        available_rooms: Number(roomData.available_rooms),
        facilities: JSON.stringify(Array.isArray(roomData.facilities) ? roomData.facilities : []),
        description: roomData.description || '',
        images: JSON.stringify(roomData.images || []),
        status: Number(roomData.status) || 1,
        booked_by: roomData.booked_by || "0", // 保留原有预定人
      };
      
      await updateRoomAPI(roomId, submitData);
      console.log(`✅ 更新房间成功: ID=${roomId}, 房间号=${submitData.room_number}`);
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
