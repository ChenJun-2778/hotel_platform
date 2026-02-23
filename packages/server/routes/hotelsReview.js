const express = require('express');
const router = express.Router();
const { query, pool } = require('../config/database');

/**
 * 获取酒店审核列表接口（分页）
 * GET /api/hotelsReview/list
 * 
 * 查询参数：
 * - page: 页码（可选，默认1）
 * - pageSize: 每页条数（可选，默认10）
 * - status: 状态筛选（可选，1-营业中，0-已下架，2-待审批，3-审批拒绝）
 * 
 * 返回字段：
 * - id: 酒店ID
 * - hotel_name: 酒店名称
 * - merchant_name: 商户名称（从users表获取）
 * - address: 完整地址（location + address拼接）
 * - star_rating: 酒店星级
 * - status: 状态（1-营业中，0-已下架，2-待审批，3-审批拒绝）
 * - rejection_reason: 拒绝原因（仅当status=3时有值）
 * - created_at: 创建时间
 */
router.get('/list', async (req, res) => {
  try {
    // 获取分页参数，确保是整数
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize) || 10)); // 限制最大100条
    const offset = (page - 1) * pageSize;

    // 获取状态筛选参数
    const statusFilter = req.query.status !== undefined ? parseInt(req.query.status) : null;

    // 构建WHERE条件
    let whereCondition = 'h.is_deleted = 0';
    const queryParams = [];

    // 如果有状态筛选
    if (statusFilter !== null && !isNaN(statusFilter)) {
      whereCondition += ' AND h.status = ?';
      queryParams.push(statusFilter);
    }

    // 查询总数
    const countSql = `
      SELECT COUNT(*) as total 
      FROM hotels h
      INNER JOIN users u ON h.user_id = u.id
      WHERE ${whereCondition}
    `;
    const countResult = await query(countSql, queryParams);
    const total = countResult[0].total;

    // 查询酒店审核列表
    const sql = `
      SELECT 
        h.id,
        h.name AS hotel_name,
        u.username AS merchant_name,
        CONCAT(h.location, ' ', h.address) AS address,
        h.star_rating,
        h.status,
        h.rejection_reason,
        h.created_at
      FROM hotels h
      INNER JOIN users u ON h.user_id = u.id
      WHERE ${whereCondition}
      ORDER BY h.created_at DESC
      LIMIT ${offset}, ${pageSize}
    `;

    const hotels = await query(sql, queryParams);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        list: hotels,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });

  } catch (error) {
    console.error('查询酒店审核列表失败:', error);
    res.status(500).json({
      success: false,
      message: '查询酒店审核列表失败',
      error: error.message
    });
  }
});

/**
 * 酒店审批通过接口
 * PUT /api/hotelsReview/approve/:id
 * 
 * 路径参数：
 * - id: 酒店ID
 * 
 * 功能：
 *   1. 将酒店状态改为 1（营业中），代表审批通过
 *   2. 自动将该酒店所有房间的库存写入 room_inventory 表（未来180天）
 *      若某日期的库存记录已存在，则跳过（INSERT IGNORE）
 * 
 * 返回数据：成功消息
 */
router.put('/approve/:id', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);

    // 验证ID是否为有效数字
    if (!hotelId || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的酒店ID'
      });
    }

    // 检查酒店是否存在
    const checkSql = 'SELECT id, status FROM hotels WHERE id = ? AND is_deleted = 0';
    const existingHotels = await query(checkSql, [hotelId]);
    
    if (existingHotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已被删除'
      });
    }

    const hotel = existingHotels[0];

    // 检查酒店当前状态
    if (hotel.status === 1) {
      return res.status(400).json({
        success: false,
        message: '该酒店已经是营业中状态'
      });
    }

    // 更新酒店状态为营业中
    const updateSql = `
      UPDATE hotels 
      SET status = 1, updated_at = NOW()
      WHERE id = ? AND is_deleted = 0
    `;
    await query(updateSql, [hotelId]);

    // -------------------------------------------------------
    // 审批通过后：初始化 room_inventory（未来180天的库存）
    // -------------------------------------------------------

    // 1. 查询该酒店下所有未删除的房间
    const roomsSql = `
      SELECT id AS room_id, total_rooms
      FROM rooms
      WHERE hotel_id = ? AND is_deleted = 0
    `;
    const rooms = await query(roomsSql, [hotelId]);

    if (rooms.length > 0) {
      // 2. 生成从今天起未来180天的日期列表
      const DAYS = 180;
      const today = new Date();
      const dateList = [];
      for (let i = 0; i < DAYS; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        // 格式化为 YYYY-MM-DD
        dateList.push(d.toISOString().slice(0, 10));
      }

      // 3. 构建批量插入数据：(room_id, hotel_id, date, total_rooms, available_rooms)
      const inventoryValues = [];
      for (const room of rooms) {
        for (const date of dateList) {
          // available_rooms 初始值等于 total_rooms（新审批酒店库存全部可用）
          inventoryValues.push([room.room_id, hotelId, date, room.total_rooms, room.total_rooms]);
        }
      }

      // 4. 使用 INSERT IGNORE 批量写入，已存在的记录自动跳过
      // 注意：批量 VALUES ? 需要用 pool.query 而非 pool.execute
      const insertSql = `
        INSERT IGNORE INTO room_inventory (room_id, hotel_id, date, total_rooms, available_rooms)
        VALUES ?
      `;
      await pool.query(insertSql, [inventoryValues]);

      console.log(`酒店 ${hotelId} 审批通过，已初始化 ${rooms.length} 个房型 × ${DAYS} 天 = ${inventoryValues.length} 条库存记录`);
    }

    res.status(200).json({
      success: true,
      message: '酒店审批通过，状态已更新为营业中，库存已初始化',
      data: {
        id: hotelId,
        status: 1,
        inventory_initialized: rooms.length > 0
      }
    });

  } catch (error) {
    console.error('酒店审批失败:', error);
    res.status(500).json({
      success: false,
      message: '酒店审批失败',
      error: error.message
    });
  }
});

/**
 * 酒店审批拒绝接口
 * PUT /api/hotelsReview/reject/:id
 * 
 * 路径参数：
 * - id: 酒店ID
 * 
 * 请求体参数：
 * - rejection_reason: 拒绝原因（必填）
 * 
 * 功能：将酒店状态改为 3（审批拒绝），并保存拒绝原因
 * 
 * 返回数据：成功消息
 */
router.put('/reject/:id', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);
    const { rejection_reason } = req.body;

    // 验证ID是否为有效数字
    if (!hotelId || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的酒店ID'
      });
    }

    // 验证拒绝原因不能为空
    if (!rejection_reason || rejection_reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '拒绝原因不能为空'
      });
    }

    // 检查酒店是否存在
    const checkSql = 'SELECT id, status FROM hotels WHERE id = ? AND is_deleted = 0';
    const existingHotels = await query(checkSql, [hotelId]);
    
    if (existingHotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已被删除'
      });
    }

    const hotel = existingHotels[0];

    // 检查酒店当前状态
    if (hotel.status === 3) {
      return res.status(400).json({
        success: false,
        message: '该酒店已经是审批拒绝状态'
      });
    }

    // 更新酒店状态为审批拒绝，并保存拒绝原因
    const updateSql = `
      UPDATE hotels 
      SET status = 3, rejection_reason = ?, updated_at = NOW()
      WHERE id = ? AND is_deleted = 0
    `;

    await query(updateSql, [rejection_reason.trim(), hotelId]);

    res.status(200).json({
      success: true,
      message: '酒店审批已拒绝',
      data: {
        id: hotelId,
        status: 3,
        rejection_reason: rejection_reason.trim()
      }
    });

  } catch (error) {
    console.error('酒店审批拒绝失败:', error);
    res.status(500).json({
      success: false,
      message: '酒店审批拒绝失败',
      error: error.message
    });
  }
});

module.exports = router;
