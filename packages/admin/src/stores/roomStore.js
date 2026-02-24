import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * 房间和订单状态管理 Store
 * 使用 Zustand + 持久化插件
 */
export const useRoomStore = create(
  persist(
    (set, get) => ({
      // ========== 状态 ==========
      rooms: [],
      timestamp: null,
      loading: false,
      orderRoomAssignments: {},

      // ========== 房间相关方法 ==========
      
      /**
       * 设置所有房间数据
       */
      setRooms: (rooms) => set({ rooms, timestamp: Date.now() }),

      /**
       * 添加或更新某个酒店的房间数据
       */
      addHotelRooms: (hotelId, rooms, hotelName) => {
        const roomsWithHotelInfo = rooms.map(room => ({
          ...room,
          hotel_id: hotelId,
          hotel_name: hotelName,
        }));

        set(state => ({
          rooms: [
            ...state.rooms.filter(r => r.hotel_id !== hotelId),
            ...roomsWithHotelInfo
          ],
          timestamp: Date.now(),
        }));

        console.log(`✅ 已缓存酒店房间: ${hotelName} (ID: ${hotelId}), 共 ${rooms.length} 条`);
      },

      /**
       * 更新单个房间数据
       */
      updateRoom: (roomId, data) => {
        set(state => ({
          rooms: state.rooms.map(room =>
            room.id === roomId ? { ...room, ...data } : room
          ),
        }));
      },

      /**
       * 删除单个房间
       */
      deleteRoom: (roomId) => {
        set(state => ({
          rooms: state.rooms.filter(room => room.id !== roomId),
        }));
      },

      /**
       * 清除所有房间缓存
       */
      clearRooms: () => set({ rooms: [], timestamp: null }),

      /**
       * 根据酒店名称和房型获取房间列表
       */
      getRoomsByHotelAndType: (hotelName, roomType) => {
        return get().rooms.filter(
          room => room.hotel_name === hotelName && room.room_type === roomType
        );
      },

      /**
       * 根据酒店ID获取房间列表
       */
      getRoomsByHotelId: (hotelId) => {
        return get().rooms.filter(room => room.hotel_id === hotelId);
      },

      /**
       * 检查缓存是否过期（默认5分钟）
       */
      isCacheExpired: (maxAge = 5 * 60 * 1000) => {
        const timestamp = get().timestamp;
        if (!timestamp) return true;
        return Date.now() - timestamp > maxAge;
      },

      /**
       * 设置加载状态
       */
      setLoading: (loading) => set({ loading }),

      // ========== 订单房间分配方法 ==========

      /**
       * 分配房间给订单
       */
      assignRoomToOrder: (orderNo, roomNumber) => {
        set(state => ({
          orderRoomAssignments: {
            ...state.orderRoomAssignments,
            [orderNo]: roomNumber,
          },
        }));
        console.log(`✅ 已分配房间: 订单 ${orderNo} → 房间 ${roomNumber}`);
      },

      /**
       * 获取订单分配的房间号
       */
      getAssignedRoom: (orderNo) => {
        return get().orderRoomAssignments[orderNo] || null;
      },

      /**
       * 清除订单的房间分配
       */
      clearOrderAssignment: (orderNo) => {
        set(state => {
          const { [orderNo]: _removed, ...rest } = state.orderRoomAssignments;
          return { orderRoomAssignments: rest };
        });
        console.log(`🗑️ 已清除订单 ${orderNo} 的房间分配`);
      },

      /**
       * 清除所有订单分配
       */
      clearAllAssignments: () => set({ orderRoomAssignments: {} }),

      // ========== 统计方法 ==========

      /**
       * 获取缓存统计信息
       */
      getCacheStats: () => {
        const state = get();
        const hotelIds = [...new Set(state.rooms.map(r => r.hotel_id))];
        return {
          totalRooms: state.rooms.length,
          totalHotels: hotelIds.length,
          totalAssignments: Object.keys(state.orderRoomAssignments).length,
          timestamp: state.timestamp,
          isExpired: state.timestamp ? Date.now() - state.timestamp > 5 * 60 * 1000 : true,
        };
      },
    }),
    {
      name: 'hotel-room-storage', // localStorage 键名
      storage: createJSONStorage(() => localStorage),
      // 只持久化订单分配，房间数据不持久化（因为可能过期）
      partialize: (state) => ({
        orderRoomAssignments: state.orderRoomAssignments,
      }),
    }
  )
);
