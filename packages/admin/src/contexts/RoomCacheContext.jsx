import React, { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * 房间缓存 Context
 * 用于在应用中共享房间数据，避免重复请求
 */

// 初始状态
const initialState = {
  rooms: [], // 所有缓存的房间数据
  timestamp: null, // 最后更新时间
  loading: false,
};

// Action 类型
const ActionTypes = {
  SET_ROOMS: 'SET_ROOMS',
  ADD_HOTEL_ROOMS: 'ADD_HOTEL_ROOMS',
  UPDATE_ROOM: 'UPDATE_ROOM',
  DELETE_ROOM: 'DELETE_ROOM',
  CLEAR_CACHE: 'CLEAR_CACHE',
  SET_LOADING: 'SET_LOADING',
};

// Reducer
const roomCacheReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_ROOMS:
      return {
        ...state,
        rooms: action.payload,
        timestamp: Date.now(),
      };

    case ActionTypes.ADD_HOTEL_ROOMS: {
      // 移除该酒店的旧数据，添加新数据
      const filteredRooms = state.rooms.filter(
        room => room.hotel_id !== action.payload.hotelId
      );
      return {
        ...state,
        rooms: [...filteredRooms, ...action.payload.rooms],
        timestamp: Date.now(),
      };
    }

    case ActionTypes.UPDATE_ROOM:
      return {
        ...state,
        rooms: state.rooms.map(room =>
          room.id === action.payload.id ? { ...room, ...action.payload.data } : room
        ),
        timestamp: Date.now(),
      };

    case ActionTypes.DELETE_ROOM:
      return {
        ...state,
        rooms: state.rooms.filter(room => room.id !== action.payload),
        timestamp: Date.now(),
      };

    case ActionTypes.CLEAR_CACHE:
      return initialState;

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    default:
      return state;
  }
};

// 创建 Context
const RoomCacheContext = createContext(null);

/**
 * RoomCache Provider 组件
 */
export const RoomCacheProvider = ({ children }) => {
  const [state, dispatch] = useReducer(roomCacheReducer, initialState);

  /**
   * 设置所有房间数据
   */
  const setRooms = useCallback((rooms) => {
    dispatch({ type: ActionTypes.SET_ROOMS, payload: rooms });
  }, []);

  /**
   * 添加或更新某个酒店的房间数据
   */
  const addHotelRooms = useCallback((hotelId, rooms, hotelName) => {
    const roomsWithHotelInfo = rooms.map(room => ({
      ...room,
      hotel_id: hotelId,
      hotel_name: hotelName,
    }));
    
    dispatch({
      type: ActionTypes.ADD_HOTEL_ROOMS,
      payload: { hotelId, rooms: roomsWithHotelInfo },
    });
    
    console.log(`✅ 已缓存酒店房间: ${hotelName} (ID: ${hotelId}), 共 ${rooms.length} 条`);
  }, []);

  /**
   * 更新单个房间数据
   */
  const updateRoom = useCallback((roomId, data) => {
    dispatch({
      type: ActionTypes.UPDATE_ROOM,
      payload: { id: roomId, data },
    });
  }, []);

  /**
   * 删除单个房间
   */
  const deleteRoom = useCallback((roomId) => {
    dispatch({ type: ActionTypes.DELETE_ROOM, payload: roomId });
  }, []);

  /**
   * 清除所有缓存
   */
  const clearCache = useCallback(() => {
    dispatch({ type: ActionTypes.CLEAR_CACHE });
    console.log('🗑️ 已清除房间缓存');
  }, []);

  /**
   * 设置加载状态
   */
  const setLoading = useCallback((loading) => {
    dispatch({ type: ActionTypes.SET_LOADING, payload: loading });
  }, []);

  /**
   * 根据酒店名称和房型获取房间列表
   */
  const getRoomsByHotelAndType = useCallback((hotelName, roomType) => {
    return state.rooms.filter(
      room => room.hotel_name === hotelName && room.room_type === roomType
    );
  }, [state.rooms]);

  /**
   * 根据酒店ID获取房间列表
   */
  const getRoomsByHotelId = useCallback((hotelId) => {
    return state.rooms.filter(room => room.hotel_id === hotelId);
  }, [state.rooms]);

  /**
   * 检查缓存是否过期（默认5分钟）
   */
  const isCacheExpired = useCallback((maxAge = 5 * 60 * 1000) => {
    if (!state.timestamp) return true;
    return Date.now() - state.timestamp > maxAge;
  }, [state.timestamp]);

  /**
   * 获取缓存统计信息
   */
  const getCacheStats = useCallback(() => {
    const hotelIds = [...new Set(state.rooms.map(r => r.hotel_id))];
    return {
      totalRooms: state.rooms.length,
      totalHotels: hotelIds.length,
      timestamp: state.timestamp,
      isExpired: isCacheExpired(),
    };
  }, [state.rooms, state.timestamp, isCacheExpired]);

  const value = {
    // 状态
    rooms: state.rooms,
    timestamp: state.timestamp,
    loading: state.loading,
    
    // 方法
    setRooms,
    addHotelRooms,
    updateRoom,
    deleteRoom,
    clearCache,
    setLoading,
    getRoomsByHotelAndType,
    getRoomsByHotelId,
    isCacheExpired,
    getCacheStats,
  };

  return (
    <RoomCacheContext.Provider value={value}>
      {children}
    </RoomCacheContext.Provider>
  );
};

/**
 * 使用房间缓存的 Hook
 */
export const useRoomCache = () => {
  const context = useContext(RoomCacheContext);
  if (!context) {
    throw new Error('useRoomCache 必须在 RoomCacheProvider 内部使用');
  }
  return context;
};
