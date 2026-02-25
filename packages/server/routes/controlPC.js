const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * PC端商户控制台数据接口
 * GET /api/controlPC/dashboard
 *
 * 查询参数：
 * - userId: 商家用户ID（必填）
 *
 * 返回字段：
 * - hotelCount:      该商家名下酒店数量
 * - todayOrderCount: 今日订单数量
 * - todayIncome:     今日总收入（元）
 * - customerCount:   累计客户数量（去重）
 */
router.get('/dashboard', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ success: false, message: '商家用户ID（userId）不能为空' });
    }

    // ── 1. 该商家名下酒店数量 ─────────────────────────────────
    const [hotelCountRows] = await Promise.all([
      query(
        'SELECT COUNT(*) AS hotelCount FROM hotels WHERE user_id = ? AND is_deleted = 0',
        [userId]
      )
    ]);
    const hotelCount = hotelCountRows[0].hotelCount;

    // ── 2. 今日订单数量 & 今日收入 & 累计客户数（通过 hotels.user_id 关联） ──
    const statsRows = await query(
      `SELECT
        COUNT(*)                                         AS todayOrderCount,
        IFNULL(SUM(o.total_price), 0)                   AS todayIncome
       FROM orders o
       INNER JOIN hotels h ON o.hotel_id = h.id
       WHERE h.user_id = ?
         AND DATE(o.created_at) = CURDATE()`,
      [userId]
    );

    const customerRows = await query(
      `SELECT COUNT(DISTINCT o.user_id) AS customerCount
       FROM orders o
       INNER JOIN hotels h ON o.hotel_id = h.id
       WHERE h.user_id = ?`,
      [userId]
    );

    const todayOrderCount = statsRows[0].todayOrderCount;
    const todayIncome     = parseFloat(statsRows[0].todayIncome);
    const customerCount   = customerRows[0].customerCount;

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        hotelCount,
        todayOrderCount,
        todayIncome,
        customerCount
      }
    });

  } catch (error) {
    console.error('获取控制台数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取控制台数据失败',
      error: error.message
    });
  }
});

/**
 * 日历视图接口
 * GET /api/controlPC/calendar
 *
 * 查询参数：
 * - user_id:   商户用户ID（必填）
 * - date:      查询日期，格式 YYYY-MM-DD（必填）
 * - hotel_id:  酒店ID（可选，不传则查该商户所有酒店）
 *
 * 返回字段：
 * - totalRooms:      总房间数（hotels 表 room_number 之和）
 * - freeRooms:       空闲房间数
 * - occupiedRooms:   已预订/已入住房间数
 * - occupancyRate:   入住率（%，保留一位小数）
 * - rooms:           房间列表（按房型下每个房间号拆分）
 *   - roomNo:          房间号（字符串）
 *   - roomType:        房型名称
 *   - basePrice:       基础价格（元/晚）
 *   - available:       是否可预订（true/false）
 */
router.get('/calendar', async (req, res) => {
  try {
    const { user_id, date, hotel_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: '商户用户ID（user_id）不能为空' });
    }
    if (!date) {
      return res.status(400).json({ success: false, message: '查询日期（date）不能为空' });
    }

    // ── 1. 构建酒店过滤条件 ────────────────────────────────────
    let hotelWhere = 'h.user_id = ? AND h.is_deleted = 0 AND h.status = 1';
    const hotelParams = [user_id];

    if (hotel_id) {
      hotelWhere += ' AND h.id = ?';
      hotelParams.push(hotel_id);
    }

    // ── 2. 查询总房间数（hotels.room_number 累加） ──────────────
    const totalSql = `
      SELECT IFNULL(SUM(h.room_number), 0) AS totalRooms
      FROM hotels h
      WHERE ${hotelWhere}
    `;
    const totalResult = await query(totalSql, hotelParams);
    const totalRooms = parseInt(totalResult[0].totalRooms) || 0;

    // ── 3. 查询所有符合条件的房型记录 ─────────────────────────
    const roomSql = `
      SELECT
        r.id            AS room_id,
        r.room_numbers,
        r.room_type,
        r.base_price
      FROM rooms r
      INNER JOIN hotels h ON r.hotel_id = h.id
      WHERE ${hotelWhere}
        AND r.is_deleted = 0
    `;
    const roomRows = await query(roomSql, hotelParams);

    // ── 4. 查询当天占用的具体房间号（通过 orders 表判断） ──────
    // 有效订单条件：
    //   status = 3：待入住（已确认并分配房间，正在占用中）
    //   assigned_room_no IS NOT NULL：已分配具体房间号
    //   check_in_date <= date < check_out_date：日期在入住区间内
    const occupiedRoomNos = new Set();

    let orderSql = `
      SELECT o.assigned_room_no
      FROM orders o
      INNER JOIN hotels h ON o.hotel_id = h.id
      WHERE h.user_id = ?
        AND o.status = 3
        AND o.assigned_room_no IS NOT NULL
        AND o.check_in_date <= ?
        AND o.check_out_date > ?
    `;
    const orderParams = [user_id, date, date];

    if (hotel_id) {
      orderSql += ' AND o.hotel_id = ?';
      orderParams.push(hotel_id);
    }

    const orderRows = await query(orderSql, orderParams);
    orderRows.forEach(row => occupiedRoomNos.add(String(row.assigned_room_no)));

    // ── 5. 将每个 room_numbers JSON 数组拆分成单个房间号 ──────
    // 命中 occupiedRoomNos 的房间号为不可预订
    const rooms = [];
    for (const row of roomRows) {
      let numbers = [];
      try {
        numbers = JSON.parse(row.room_numbers || '[]');
      } catch (e) {
        numbers = [];
      }

      for (const roomNo of numbers) {
        rooms.push({
          roomNo: String(roomNo),
          roomType: row.room_type,
          basePrice: parseFloat(row.base_price),
          available: !occupiedRoomNos.has(String(roomNo))
        });
      }
    }

    // ── 6. 统计汇总字段 ────────────────────────────────────────
    const occupiedRooms = rooms.filter(r => !r.available).length;
    const freeRooms     = rooms.length - occupiedRooms;
    const occupancyRate = rooms.length > 0
      ? parseFloat(((occupiedRooms / rooms.length) * 100).toFixed(1))
      : 0;

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        date,
        totalRooms,
        freeRooms,
        occupiedRooms,
        occupancyRate,
        rooms
      }
    });

  } catch (error) {
    console.error('获取日历视图失败:', error);
    res.status(500).json({
      success: false,
      message: '获取日历视图失败',
      error: error.message
    });
  }
});

module.exports = router;

