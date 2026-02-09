import { useState, useCallback } from 'react';
import { message } from 'antd';

/**
 * 房间列表管理 Hook
 */
const useRoomList = () => {
  // 模拟酒店数据
  const [hotels] = useState([
    { value: 'hotel1', label: '我的豪华酒店', totalRooms: 20 },
    { value: 'hotel2', label: '舒适商务酒店', totalRooms: 15 },
    { value: 'hotel3', label: '新开业酒店', totalRooms: 12 },
  ]);

  // 模拟房间数据
  const [roomsData] = useState({
    hotel1: [
      { roomNumber: '101', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '102', status: 'occupied', type: '大床房', price: 399, guest: '张三' },
      { roomNumber: '103', status: 'reserved', type: '标准间', price: 299, guest: '李四' },
      { roomNumber: '104', status: 'available', type: '豪华套房', price: 699 },
      { roomNumber: '105', status: 'occupied', type: '大床房', price: 399, guest: '王五' },
      { roomNumber: '201', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '202', status: 'reserved', type: '大床房', price: 399, guest: '赵六' },
      { roomNumber: '203', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '204', status: 'occupied', type: '豪华套房', price: 699, guest: '孙七' },
      { roomNumber: '205', status: 'available', type: '大床房', price: 399 },
      { roomNumber: '301', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '302', status: 'available', type: '大床房', price: 399 },
      { roomNumber: '303', status: 'reserved', type: '标准间', price: 299, guest: '周八' },
      { roomNumber: '304', status: 'available', type: '豪华套房', price: 699 },
      { roomNumber: '305', status: 'available', type: '大床房', price: 399 },
      { roomNumber: '401', status: 'occupied', type: '标准间', price: 299, guest: '吴九' },
      { roomNumber: '402', status: 'available', type: '大床房', price: 399 },
      { roomNumber: '403', status: 'available', type: '标准间', price: 299 },
      { roomNumber: '404', status: 'available', type: '豪华套房', price: 699 },
      { roomNumber: '405', status: 'reserved', type: '大床房', price: 399, guest: '郑十' },
    ],
    hotel2: [
      { roomNumber: '101', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '102', status: 'occupied', type: '商务间', price: 399, guest: '客户A' },
      { roomNumber: '103', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '201', status: 'reserved', type: '商务套房', price: 599, guest: '客户B' },
      { roomNumber: '202', status: 'available', type: '商务套房', price: 599 },
      { roomNumber: '203', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '301', status: 'occupied', type: '商务间', price: 399, guest: '客户C' },
      { roomNumber: '302', status: 'available', type: '商务套房', price: 599 },
      { roomNumber: '303', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '401', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '402', status: 'reserved', type: '商务套房', price: 599, guest: '客户D' },
      { roomNumber: '403', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '501', status: 'available', type: '商务间', price: 399 },
      { roomNumber: '502', status: 'available', type: '商务套房', price: 599 },
      { roomNumber: '503', status: 'occupied', type: '商务间', price: 399, guest: '客户E' },
    ],
    hotel3: [
      { roomNumber: '101', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '102', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '103', status: 'reserved', type: '精品套房', price: 799, guest: '新客A' },
      { roomNumber: '201', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '202', status: 'available', type: '精品套房', price: 799 },
      { roomNumber: '203', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '301', status: 'occupied', type: '精品间', price: 499, guest: '新客B' },
      { roomNumber: '302', status: 'available', type: '精品套房', price: 799 },
      { roomNumber: '303', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '401', status: 'available', type: '精品间', price: 499 },
      { roomNumber: '402', status: 'available', type: '精品套房', price: 799 },
      { roomNumber: '403', status: 'reserved', type: '精品间', price: 499, guest: '新客C' },
    ],
  });

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
      available: rooms.filter(r => r.status === 'available').length,
      occupied: rooms.filter(r => r.status === 'occupied').length,
      reserved: rooms.filter(r => r.status === 'reserved').length,
    };
  }, []);

  /**
   * 添加房间
   */
  const addRoom = useCallback(async (roomData) => {
    try {
      // TODO: 调用后端接口
      console.log('房间提交数据:', roomData);
      message.success('房间添加成功！');
      return true;
    } catch (error) {
      console.error('添加房间失败:', error);
      message.error('添加房间失败，请重试');
      return false;
    }
  }, []);

  /**
   * 更新房间
   */
  const updateRoom = useCallback(async (roomId, roomData) => {
    try {
      // TODO: 调用后端接口
      console.log('更新房间数据:', { roomId, roomData });
      message.success('房间更新成功！');
      return true;
    } catch (error) {
      console.error('更新房间失败:', error);
      message.error('更新房间失败，请重试');
      return false;
    }
  }, []);

  /**
   * 删除房间
   */
  const deleteRoom = useCallback(async (roomId) => {
    try {
      // TODO: 调用后端接口
      console.log('删除房间:', roomId);
      message.success('房间删除成功！');
      return true;
    } catch (error) {
      console.error('删除房间失败:', error);
      message.error('删除房间失败，请重试');
      return false;
    }
  }, []);

  return {
    hotels,
    roomsData,
    getRoomsByHotel,
    calculateStats,
    addRoom,
    updateRoom,
    deleteRoom,
  };
};

export default useRoomList;
