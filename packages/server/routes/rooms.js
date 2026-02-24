const express = require('express');
const router = express.Router();
const { query, pool } = require('../config/database');

/**
 * 新增房间接口
 * POST /api/rooms/create
 * 
 * 请求体参数：
 * - hotel_id: 所属酒店ID (必填)
 * - room_type_code: 房型编号，如 RT001 (必填)
 * - room_type: 房型 (必填)
 * - room_type_en: 英文房型 (可选)
 * - bed_type: 床型 (可选，默认'大床')
 * - area: 面积(㎡) (可选)
 * - floor: 楼层 (可选)
 * - max_occupancy: 最多入住人数 (必填)
 * - base_price: 基础价格(元/晚) (必填)
 * - total_rooms: 此类型房间总数 (必填)
 * - room_numbers: 房间号列表，JSON数组，如 ["101","102"] (可选)
 * - facilities: 房间设施，JSON数组 (可选)
 * - description: 房间描述 (可选)
 * - images: 房间图片列表，JSON数组 (可选)
 */
router.post('/create', async (req, res) => {
  try {
    const {
      hotel_id,
      room_type_code,
      room_type,
      room_type_en,
      bed_type = '大床',
      area,
      floor,
      max_occupancy,
      base_price,
      total_rooms,
      room_numbers,
      facilities,
      description,
      images
    } = req.body;

    // 验证必填字段
    if (!hotel_id) {
      return res.status(400).json({
        success: false,
        message: '所属酒店不能为空'
      });
    }

    if (!room_type_code) {
      return res.status(400).json({
        success: false,
        message: '房型编号不能为空'
      });
    }

    if (!room_type) {
      return res.status(400).json({
        success: false,
        message: '房型不能为空'
      });
    }

    if (!max_occupancy) {
      return res.status(400).json({
        success: false,
        message: '最多入住人数不能为空'
      });
    }

    if (!base_price) {
      return res.status(400).json({
        success: false,
        message: '基础价格不能为空'
      });
    }

    if (!total_rooms) {
      return res.status(400).json({
        success: false,
        message: '房间总数不能为空'
      });
    }

    // 验证酒店是否存在
    const checkHotelSql = 'SELECT id, status FROM hotels WHERE id = ? AND is_deleted = 0';
    const existingHotels = await query(checkHotelSql, [hotel_id]);
    
    if (existingHotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '所属酒店不存在或已被删除'
      });
    }

    // 插入房间数据（available_rooms 自动等于 total_rooms，无需前端传入）
    const sql = `
      INSERT INTO rooms (
        hotel_id,
        room_type_code,
        room_type,
        room_type_en,
        bed_type,
        area,
        floor,
        max_occupancy,
        base_price,
        total_rooms,
        room_numbers,
        facilities,
        description,
        images,
        is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `;

    const params = [
      hotel_id,
      room_type_code,
      room_type,
      room_type_en,
      bed_type,
      area,
      floor,
      max_occupancy,
      base_price,
      total_rooms,
      room_numbers,
      facilities,
      description,
      images
    ];

    const result = await query(sql, params);

    // 将新建房间的 total_rooms 累加到对应酒店的 room_number
    // 使用 COALESCE 处理 room_number 为 NULL 的情况（NULL + n = NULL）
    const updateHotelSql = `
      UPDATE hotels
      SET room_number = COALESCE(room_number, 0) + ?
      WHERE id = ? AND is_deleted = 0
    `;
    await query(updateHotelSql, [total_rooms, hotel_id]);

    // ── 当酒店状态为 1（营业中）时，初始化未来 180 天库存 ───────
    const hotelStatus = existingHotels[0].status;
    let inventoryInserted = 0;

    if (hotelStatus === 1) {
      const DAYS = 180;
      const today = new Date();
      const newRoomId = result.insertId;
      const inventoryValues = [];

      for (let i = 0; i < DAYS; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const dateStr = d.toISOString().slice(0, 10);
        // [room_id, hotel_id, date, total_rooms, available_rooms]
        inventoryValues.push([newRoomId, hotel_id, dateStr, total_rooms, total_rooms]);
      }

      const insertInventorySql = `
        INSERT IGNORE INTO room_inventory (room_id, hotel_id, date, total_rooms, available_rooms)
        VALUES ?
      `;
      await pool.query(insertInventorySql, [inventoryValues]);
      inventoryInserted = inventoryValues.length;

      console.log(`房间 ${newRoomId} 创建成功，酒店状态为 1，已写入 ${inventoryInserted} 条库存记录`);
    } else {
      console.log(`房间 ${result.insertId} 创建成功，酒店状态为 ${hotelStatus}（非营业中），跳过库存初始化`);
    }

    res.status(201).json({
      success: true,
      message: '房间创建成功',
      data: {
        id: result.insertId,
        room_type_code,
        room_type,
        total_rooms,
        is_deleted: 0,
        inventory_initialized: hotelStatus === 1,
        inventory_days: inventoryInserted
      }
    });

  } catch (error) {
    console.error('创建房间失败:', error);
    res.status(500).json({
      success: false,
      message: '创建房间失败',
      error: error.message
    });
  }
});

/**
 * 查询房间列表接口
 * GET /api/rooms/list
 * 
 * 查询参数：
 * - hotel_id: 所属酒店ID (必填)
 * - keyword: 搜索关键词 (可选，用于搜索房间号或房型)
 * 
 * 返回字段：
 * - id: 房间主键ID
 * - hotel_id: 所属酒店ID
 * - room_type_code: 房型编号
 * - room_numbers: 房间号列表（JSON数组）
 * - room_type: 房型
 * - base_price: 基础价格(元/晚)
 */
router.get('/list', async (req, res) => {
  try {
    const { hotel_id, keyword } = req.query;

    // 验证必填参数
    if (!hotel_id) {
      return res.status(400).json({
        success: false,
        message: '酒店ID不能为空'
      });
    }

    // 验证酒店是否存在
    const checkHotelSql = 'SELECT id FROM hotels WHERE id = ? AND is_deleted = 0';
    const existingHotels = await query(checkHotelSql, [hotel_id]);
    
    if (existingHotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已被删除'
      });
    }

    // 获取关键词搜索参数
    const searchKeyword = keyword ? keyword.trim() : '';

    // 构建WHERE条件和参数
    let whereCondition = 'hotel_id = ? AND is_deleted = 0';
    const queryParams = [hotel_id];

    if (searchKeyword) {
      // 如果有关键词，按房型或房型编号模糊搜索
      whereCondition += ' AND (room_type LIKE ? OR room_type_code LIKE ?)';
      const searchPattern = `%${searchKeyword}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    // 查询房间列表
    const sql = `
      SELECT 
        id,
        hotel_id,
        room_type_code,
        room_numbers,
        room_type,
        total_rooms,
        base_price
      FROM rooms
      WHERE ${whereCondition}
      ORDER BY room_type_code ASC
    `;

    const rooms = await query(sql, queryParams);

    // 累加每个房型的 total_rooms，得到该酒店真实总房间数
    const totalRooms = rooms.reduce((sum, r) => sum + (r.total_rooms || 0), 0);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        total: totalRooms,          // 所有房型 total_rooms 之和（真实总房间数）
        rooms: rooms
      }
    });

  } catch (error) {
    console.error('查询房间列表失败:', error);
    res.status(500).json({
      success: false,
      message: '查询房间列表失败',
      error: error.message
    });
  }
});

/**
 * 查询房间详情接口
 * GET /api/rooms/detail
 * 
 * 查询参数：
 * - id: 房间ID (必填)
 * 
 * 返回所有房间字段信息
 */
router.get('/detail', async (req, res) => {
  try {
    const { id } = req.query;

    // 验证必填参数
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '房间ID不能为空'
      });
    }

    // 查询房间详情
    const sql = `
      SELECT 
        id,
        hotel_id,
        room_type_code,
        room_numbers,
        room_type,
        room_type_en,
        bed_type,
        area,
        floor,
        max_occupancy,
        base_price,
        total_rooms,
        facilities,
        description,
        images,
        created_at,
        updated_at,
        is_deleted
      FROM rooms
      WHERE id = ? AND is_deleted = 0
    `;

    const rooms = await query(sql, [id]);

    if (rooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: '房间不存在或已被删除'
      });
    }

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: rooms[0]
    });

  } catch (error) {
    console.error('查询房间详情失败:', error);
    res.status(500).json({
      success: false,
      message: '查询房间详情失败',
      error: error.message
    });
  }
});

/**
 * 删除房间接口
 * DELETE /api/rooms/delete
 * 
 * 查询参数：
 * - id: 房间ID (必填)
 * 
 * 说明：逻辑删除，将 is_deleted 设置为 1
 */
router.delete('/delete', async (req, res) => {
  try {
    const { id } = req.query;

    // 验证必填参数
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '房间ID不能为空'
      });
    }

    // 检查房间是否存在
    const checkSql = 'SELECT id, room_type_code, room_type FROM rooms WHERE id = ? AND is_deleted = 0';
    const existingRooms = await query(checkSql, [id]);

    if (existingRooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: '房间不存在或已被删除'
      });
    }

    // 执行逻辑删除
    const deleteSql = `
      UPDATE rooms 
      SET is_deleted = 1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;

    await query(deleteSql, [id]);

    res.status(200).json({
      success: true,
      message: '房间删除成功',
      data: {
        id: existingRooms[0].id,
        room_type_code: existingRooms[0].room_type_code,
        room_type: existingRooms[0].room_type
      }
    });

  } catch (error) {
    console.error('删除房间失败:', error);
    res.status(500).json({
      success: false,
      message: '删除房间失败',
      error: error.message
    });
  }
});

/**
 * 修改房间接口
 * PUT /api/rooms/update
 * 
 * 请求体参数：
 * - id: 房间ID (必填)
 * - hotel_id: 所属酒店ID (可选)
 * - room_type_code: 房型编号，如 RT001 (可选)
 * - room_type: 房型 (可选)
 * - room_type_en: 英文房型 (可选)
 * - bed_type: 床型 (可选)
 * - area: 面积(㎡) (可选)
 * - floor: 楼层 (可选)
 * - max_occupancy: 最多入住人数 (可选)
 * - base_price: 基础价格(元/晚) (可选)
 * - total_rooms: 此类型房间总数 (可选)
 * - room_numbers: 房间号列表，JSON数组（可选）
 * - facilities: 房间设施，JSON数组 (可选)
 * - description: 房间描述 (可选)
 * - images: 房间图片列表，JSON数组 (可选)
 */
router.put('/update', async (req, res) => {
  try {
    const {
      id,
      hotel_id,
      room_type_code,
      room_type,
      room_type_en,
      bed_type,
      area,
      floor,
      max_occupancy,
      base_price,
      total_rooms,
      room_numbers,
      facilities,
      description,
      images
    } = req.body;

    // 验证必填参数
    if (!id) {
      return res.status(400).json({
        success: false,
        message: '房间ID不能为空'
      });
    }

    // 检查房间是否存在
    const checkSql = 'SELECT id FROM rooms WHERE id = ? AND is_deleted = 0';
    const existingRooms = await query(checkSql, [id]);

    if (existingRooms.length === 0) {
      return res.status(404).json({
        success: false,
        message: '房间不存在或已被删除'
      });
    }

    // 如果要修改 hotel_id，验证新酒店是否存在
    if (hotel_id) {
      const checkHotelSql = 'SELECT id FROM hotels WHERE id = ? AND is_deleted = 0';
      const existingHotels = await query(checkHotelSql, [hotel_id]);
      
      if (existingHotels.length === 0) {
        return res.status(404).json({
          success: false,
          message: '所属酒店不存在或已被删除'
        });
      }
    }

    // 构建动态更新 SQL
    const updateFields = [];
    const updateValues = [];

    if (hotel_id !== undefined) {
      updateFields.push('hotel_id = ?');
      updateValues.push(hotel_id);
    }
    if (room_type_code !== undefined) {
      updateFields.push('room_type_code = ?');
      updateValues.push(room_type_code);
    }
    if (room_type !== undefined) {
      updateFields.push('room_type = ?');
      updateValues.push(room_type);
    }
    if (room_type_en !== undefined) {
      updateFields.push('room_type_en = ?');
      updateValues.push(room_type_en);
    }
    if (bed_type !== undefined) {
      updateFields.push('bed_type = ?');
      updateValues.push(bed_type);
    }
    if (area !== undefined) {
      updateFields.push('area = ?');
      updateValues.push(area);
    }
    if (floor !== undefined) {
      updateFields.push('floor = ?');
      updateValues.push(floor);
    }
    if (max_occupancy !== undefined) {
      updateFields.push('max_occupancy = ?');
      updateValues.push(max_occupancy);
    }
    if (base_price !== undefined) {
      updateFields.push('base_price = ?');
      updateValues.push(base_price);
    }
    if (total_rooms !== undefined) {
      updateFields.push('total_rooms = ?');
      updateValues.push(total_rooms);
    }
    if (room_numbers !== undefined) {
      updateFields.push('room_numbers = ?');
      updateValues.push(room_numbers);
    }
    if (facilities !== undefined) {
      updateFields.push('facilities = ?');
      updateValues.push(facilities);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (images !== undefined) {
      updateFields.push('images = ?');
      updateValues.push(images);
    }

    // 如果没有要更新的字段
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有要更新的字段'
      });
    }

    // 添加更新时间
    updateFields.push('updated_at = CURRENT_TIMESTAMP');

    // 构建并执行 UPDATE SQL
    const updateSql = `
      UPDATE rooms 
      SET ${updateFields.join(', ')} 
      WHERE id = ?
    `;
    updateValues.push(id);

    await query(updateSql, updateValues);

    // 查询更新后的房间信息
    const getRoomSql = 'SELECT * FROM rooms WHERE id = ?';
    const updatedRoom = await query(getRoomSql, [id]);

    res.status(200).json({
      success: true,
      message: '房间更新成功',
      data: updatedRoom[0]
    });

  } catch (error) {
    console.error('更新房间失败:', error);
    res.status(500).json({
      success: false,
      message: '更新房间失败',
      error: error.message
    });
  }
});

module.exports = router;
