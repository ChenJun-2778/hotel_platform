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

module.exports = router;
