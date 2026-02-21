const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * 搜索酒店列表接口
 * GET /api/hotelsMobile/search
 *
 * 查询参数（全部可选）：
 * - destination:    目的地/城市（模糊匹配 hotels.location 和 hotels.address）
 * - check_in_date:  入住日期（格式 YYYY-MM-DD）
 * - check_out_date: 离店日期（格式 YYYY-MM-DD）
 *
 * 逻辑：
 *   - 三个参数都不传 → 返回所有营业中的酒店（不过滤日期库存）
 *   - 传了目的地 → 模糊过滤城市/地址
 *   - 传了入住/离店日期 → 通过 room_inventory 确保区间内每天有余量
 *   - 日期和目的地可任意组合
 */
router.get('/search', async (req, res) => {
  try {
    const { destination, check_in_date, check_out_date } = req.query;

    const hasDestination = destination && destination.trim() !== '';
    const hasDates = check_in_date && check_out_date;

    // ── 日期参数校验（只在传了日期时才校验）──────────────────
    let nights = null;
    if (hasDates) {
      const checkIn = new Date(check_in_date);
      const checkOut = new Date(check_out_date);

      if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        return res.status(400).json({
          success: false,
          message: '日期格式不正确，请使用 YYYY-MM-DD 格式'
        });
      }

      if (checkOut <= checkIn) {
        return res.status(400).json({
          success: false,
          message: '离店日期必须晚于入住日期'
        });
      }

      nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    }

    // ── 动态拼接 SQL ──────────────────────────────────────────
    let sql;
    const params = [];

    const baseSelect = `
      SELECT
        h.id,
        h.name,
        h.cover_image,
        h.brand,
        h.star_rating,
        h.location,
        h.address,
        h.description,
        h.hotel_facilities,
        MIN(r.base_price) AS min_price
      FROM hotels h
    `;

    const roomJoin = `
      INNER JOIN rooms r
        ON r.hotel_id = h.id
        AND r.is_deleted = 0
    `;

    if (hasDates) {
      // 传了日期：通过 room_inventory 过滤有库存的酒店
      sql = `
        ${baseSelect}
        INNER JOIN room_inventory ri
          ON ri.hotel_id = h.id
          AND ri.date >= ?
          AND ri.date < ?
          AND ri.available_rooms > 0
        ${roomJoin}
        WHERE h.is_deleted = 0 AND h.status = 1
      `;
      params.push(check_in_date, check_out_date);
    } else {
      // 不传日期：直接查所有营业中的酒店
      sql = `
        ${baseSelect}
        ${roomJoin}
        WHERE h.is_deleted = 0 AND h.status = 1
      `;
    }

    // 目的地过滤（可选）
    if (hasDestination) {
      sql += `
        AND (
          h.location LIKE CONCAT('%', ?, '%')
          OR h.address LIKE CONCAT('%', ?, '%')
        )
      `;
      params.push(destination.trim(), destination.trim());
    }

    sql += `
      GROUP BY
        h.id, h.name, h.cover_image, h.brand,
        h.star_rating, h.location, h.address,
        h.description, h.hotel_facilities
    `;

    // 传了日期：确保区间内每天都有余量
    if (hasDates) {
      sql += ` HAVING COUNT(DISTINCT ri.date) >= ?`;
      params.push(nights);
    }

    sql += ` ORDER BY h.star_rating DESC, min_price ASC`;

    const hotels = await query(sql, params);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        list: hotels,
        search_params: {
          destination: hasDestination ? destination.trim() : null,
          check_in_date: check_in_date || null,
          check_out_date: check_out_date || null,
          nights
        },
        total: hotels.length
      }
    });

  } catch (error) {
    console.error('搜索酒店失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索酒店失败',
      error: error.message
    });
  }
});

/**
 * 获取酒店详情接口
 * GET /api/hotelsMobile/:id
 *
 * 路径参数：
 * - id: 酒店ID
 *
 * 返回：
 * - 酒店基本信息（名称、星级、描述、设施、地点、地址等）
 * - 该酒店下所有未删除的房间列表（排除 created_at、updated_at、is_deleted）
 */
router.get('/:id', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);

    if (!hotelId || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的酒店ID'
      });
    }

    // 查询酒店基本信息
    const hotelSql = `
      SELECT
        id,
        name,
        star_rating,
        description,
        hotel_facilities,
        location,
        address,
        brand,
        english_name,
        hotel_phone,
        contact,
        contact_phone,
        cover_image,
        images,
        room_number
      FROM hotels
      WHERE id = ? AND is_deleted = 0 AND status = 1
    `;
    const hotelRows = await query(hotelSql, [hotelId]);

    if (hotelRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已下架'
      });
    }

    // 查询该酒店下所有未删除的房间（排除 created_at、updated_at、is_deleted）
    const roomsSql = `
      SELECT
        id,
        hotel_id,
        room_number,
        room_type,
        room_type_en,
        bed_type,
        area,
        floor,
        max_occupancy,
        base_price,
        total_rooms,
        available_rooms,
        facilities,
        description,
        images
      FROM rooms
      WHERE hotel_id = ? AND is_deleted = 0
      ORDER BY base_price ASC
    `;
    const rooms = await query(roomsSql, [hotelId]);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        ...hotelRows[0],
        rooms
      }
    });

  } catch (error) {
    console.error('获取酒店详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取酒店详情失败',
      error: error.message
    });
  }
});

module.exports = router;

