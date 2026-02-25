const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * 管理员控制台信息接口
 * GET /api/controlManage/dashboard
 *
 * 返回字段：
 * - totalUsers:       总用户数（role_type IN(1,2)，is_deleted=0，status=1 的用户）
 * - totalHotels:      酒店总数（is_deleted=0，status IN(0,1,2) 的酒店）
 * - pendingHotels:    待审核酒店数（is_deleted=0，status=2 的酒店）
 * - totalIncome:      平台总收入（orders 表 total_price 累加，保留两位小数）
 */
router.get('/dashboard', async (req, res) => {
  try {
    const [userResult, hotelResult, pendingResult, incomeResult] = await Promise.all([
      // 总用户数：管理员 + 商户，正常状态，未删除
      query(`
        SELECT COUNT(*) AS total
        FROM users
        WHERE role_type IN (1, 2)
          AND is_deleted = 0
          AND status = 1
      `),

      // 酒店总数：营业中(1)、已下架(0)、待审批(2)，未删除
      query(`
        SELECT COUNT(*) AS total
        FROM hotels
        WHERE is_deleted = 0
          AND status IN (0, 1, 2)
      `),

      // 待审核酒店数：status=2
      query(`
        SELECT COUNT(*) AS total
        FROM hotels
        WHERE is_deleted = 0
          AND status = 2
      `),

      // 平台总收入：所有订单 total_price 累加
      query(`
        SELECT IFNULL(SUM(total_price), 0) AS total
        FROM orders
      `)
    ]);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        totalUsers:    parseInt(userResult[0].total),
        totalHotels:   parseInt(hotelResult[0].total),
        pendingHotels: parseInt(pendingResult[0].total),
        totalIncome:   parseFloat(parseFloat(incomeResult[0].total).toFixed(2))
      }
    });

  } catch (error) {
    console.error('获取管理员控制台信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取管理员控制台信息失败',
      error: error.message
    });
  }
});

module.exports = router;
