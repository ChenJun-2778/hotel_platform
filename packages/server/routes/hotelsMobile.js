const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * 搜索酒店列表接口
 * GET /api/hotelsMobile/search
 *
 * 查询参数（全部可选）：
 * - destination:      目的地/城市（模糊匹配 location 和 address）
 * - check_in_date:    入住日期（YYYY-MM-DD）
 * - check_out_date:   离店日期（YYYY-MM-DD）
 * - price_min:        最低价格（必选，与 price_max 组成区间）
 * - price_max:        最高价格（可选）
 * - score_min:        最低评分 0.0-5.0（必选，与 score_max 组成区间）
 * - score_max:        最高评分（可选）
 * - star_min:         最低星级 1-5（必选，与 star_max 组成区间）
 * - star_max:         最高星级（可选）
 * - facilities:       酒店设施，逗号分隔，如 "停车场,游泳池"（全匹配）
 *
 * 价格区间作用于每家酒店的最低房价（min_price）
 * 设施筛选通过 FIND_IN_SET 逐项匹配 hotel_facilities 字段
 */
router.get('/search', async (req, res) => {
  try {
    const {
      destination, check_in_date, check_out_date,
      price_min, price_max,
      score_min, score_max,
      star_min,  star_max,
      facilities
    } = req.query;

    const hasDestination = destination && destination.trim() !== '';
    const hasDates       = check_in_date && check_out_date;

    // ── 价格 / 评分 / 星级 区间参数解析 ────────────────────────
    const priceMin = price_min !== undefined && price_min !== '' ? parseFloat(price_min) : null;
    const priceMax = price_max !== undefined && price_max !== '' ? parseFloat(price_max) : null;
    const scoreMin = score_min !== undefined && score_min !== '' ? parseFloat(score_min) : null;
    const scoreMax = score_max !== undefined && score_max !== '' ? parseFloat(score_max) : null;
    const starMin  = star_min  !== undefined && star_min  !== '' ? parseInt(star_min)   : null;
    const starMax  = star_max  !== undefined && star_max  !== '' ? parseInt(star_max)   : null;

    // ── 设施筛选参数解析（逗号分隔 → 数组）─────────────────────
    const facilityList = facilities && facilities.trim() !== ''
      ? facilities.split(',').map(f => f.trim()).filter(Boolean)
      : [];

    // ── 区间参数基础校验 ────────────────────────────────────────
    if (priceMin !== null && isNaN(priceMin)) {
      return res.status(400).json({ success: false, message: 'price_min 必须为有效数字' });
    }
    if (priceMax !== null && isNaN(priceMax)) {
      return res.status(400).json({ success: false, message: 'price_max 必须为有效数字' });
    }
    if (priceMin !== null && priceMax !== null && priceMax < priceMin) {
      return res.status(400).json({ success: false, message: 'price_max 不能小于 price_min' });
    }
    if (scoreMin !== null && (isNaN(scoreMin) || scoreMin < 0 || scoreMin > 5)) {
      return res.status(400).json({ success: false, message: 'score_min 取值范围 0-5' });
    }
    if (scoreMax !== null && (isNaN(scoreMax) || scoreMax < 0 || scoreMax > 5)) {
      return res.status(400).json({ success: false, message: 'score_max 取值范围 0-5' });
    }
    if (scoreMin !== null && scoreMax !== null && scoreMax < scoreMin) {
      return res.status(400).json({ success: false, message: 'score_max 不能小于 score_min' });
    }
    if (starMin !== null && (isNaN(starMin) || starMin < 1 || starMin > 5)) {
      return res.status(400).json({ success: false, message: 'star_min 取值范围 1-5' });
    }
    if (starMax !== null && (isNaN(starMax) || starMax < 1 || starMax > 5)) {
      return res.status(400).json({ success: false, message: 'star_max 取值范围 1-5' });
    }
    if (starMin !== null && starMax !== null && starMax < starMin) {
      return res.status(400).json({ success: false, message: 'star_max 不能小于 star_min' });
    }

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
        h.score,
        h.review_count,
        h.favorite_count,
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

    // 评分区间过滤（WHERE 阶段，直接作用于 h.score）
    if (scoreMin !== null) {
      sql += ` AND h.score >= ?`;
      params.push(scoreMin);
    }
    if (scoreMax !== null) {
      sql += ` AND h.score <= ?`;
      params.push(scoreMax);
    }

    // 星级区间过滤（WHERE 阶段）
    if (starMin !== null) {
      sql += ` AND h.star_rating >= ?`;
      params.push(starMin);
    }
    if (starMax !== null) {
      sql += ` AND h.star_rating <= ?`;
      params.push(starMax);
    }

    // 设施筛选（WHERE 阶段，每个设施用 LIKE 模糊匹配）
    for (const facility of facilityList) {
      sql += ` AND h.hotel_facilities LIKE CONCAT('%', ?, '%')`;
      params.push(facility);
    }

    sql += `
      GROUP BY
        h.id, h.name, h.cover_image, h.brand,
        h.star_rating, h.location, h.address,
        h.description, h.hotel_facilities,
        h.score, h.review_count, h.favorite_count
    `;

    // ── HAVING 阶段：日期覆盖校验 + 价格区间 ─────────────────────
    const havingClauses = [];
    if (hasDates) {
      havingClauses.push(`COUNT(DISTINCT ri.date) >= ?`);
      params.push(nights);
    }
    if (priceMin !== null) {
      havingClauses.push(`MIN(r.base_price) >= ?`);
      params.push(priceMin);
    }
    if (priceMax !== null) {
      havingClauses.push(`MIN(r.base_price) <= ?`);
      params.push(priceMax);
    }
    if (havingClauses.length > 0) {
      sql += ` HAVING ` + havingClauses.join(' AND ');
    }

    sql += ` ORDER BY h.star_rating DESC, min_price ASC`;

    const hotels = await query(sql, params);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        list: hotels,
        search_params: {
          destination:    hasDestination ? destination.trim() : null,
          check_in_date:  check_in_date  || null,
          check_out_date: check_out_date || null,
          nights,
          price_min:      priceMin,
          price_max:      priceMax,
          score_min:      scoreMin,
          score_max:      scoreMax,
          star_min:       starMin,
          star_max:       starMax,
          facilities:     facilityList.length > 0 ? facilityList : null
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

