const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * PC端获取订单列表接口
 * GET /api/orderPC/list
 *
 * 查询参数：
 * - userId:      商家用户ID（必填）—— 用于过滤只属于该商家酒店的订单
 * - order_no:    订单号（可选，模糊搜索）
 * - guest_name:  预订客户姓名（可选，模糊搜索）
 *
 * 返回字段：
 * - order_no:       订单号
 * - hotel_name:     酒店名称（来自 hotels 表）
 * - room_type:      房间类型（来自 rooms 表）
 * - guest_name:     客户姓名（来自 orders 表）
 * - check_in_date:  入住日期
 * - check_out_date: 退房日期
 * - nights:         住宿天数
 * - total_price:    订单金额
 * - status:         订单状态（1-待付款 2-待确定 3-待入住 4-已完成）
 */
router.get('/list', async (req, res) => {
  try {
    const { userId, order_no, guest_name } = req.query;

    // 参数校验：商家userId必填
    if (!userId) {
      return res.status(400).json({ success: false, message: '商家用户ID（userId）不能为空' });
    }

    // 动态构建 WHERE 条件
    // 通过 hotels.user_id = userId 限定只查属于该商家的酒店订单
    let where = 'h.user_id = ?';
    const params = [userId];

    if (order_no) {
      where += ' AND o.order_no LIKE ?';
      params.push(`%${order_no}%`);
    }

    if (guest_name) {
      where += ' AND o.guest_name LIKE ?';
      params.push(`%${guest_name}%`);
    }

    const sql = `
      SELECT
        o.order_no,
        h.name        AS hotel_name,
        r.room_type,
        o.guest_name,
        o.check_in_date,
        o.check_out_date,
        o.nights,
        o.total_price,
        o.status
      FROM orders o
      INNER JOIN hotels h ON o.hotel_id = h.id
      INNER JOIN rooms  r ON o.room_id  = r.id
      WHERE ${where}
      ORDER BY o.id DESC
    `;

    const orders = await query(sql, params);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        total: orders.length,
        orders
      }
    });

  } catch (error) {
    console.error('PC端获取订单列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订单列表失败',
      error: error.message
    });
  }
});

/**
 * PC端确定订单接口
 * PUT /api/orderPC/confirm/:order_no
 *
 * 路径参数：
 * - order_no:          订单号（必填）
 *
 * 请求体参数：
 * - assigned_room_no:  商家分配的具体房间号（必填）
 *
 * 说明：将 status 从 2（待确定）改为 3（待入住），同时记录分配的房间号
 */
router.put('/confirm/:order_no', async (req, res) => {
  try {
    const { order_no } = req.params;
    const { assigned_room_no } = req.body;

    if (!order_no) {
      return res.status(400).json({ success: false, message: '订单号不能为空' });
    }
    if (!assigned_room_no) {
      return res.status(400).json({ success: false, message: '分配的房间号不能为空' });
    }

    // 查询订单：同时取 room_id / check_in_date / check_out_date 用于扣库存
    const orderRows = await query(
      'SELECT id, status, room_id, check_in_date, check_out_date FROM orders WHERE order_no = ?',
      [order_no]
    );
    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    const order = orderRows[0];

    // 只有待确定（status=2）的订单才能被确定
    if (order.status !== 2) {
      const statusMap = { 1: '待付款', 3: '待入住', 4: '已完成' };
      return res.status(400).json({
        success: false,
        message: `该订单当前状态为「${statusMap[order.status] || '未知'}」，无法执行确定操作`
      });
    }

    // 将 status 改为 3（待入住），同时保存分配的房间号和确认时间
    await query(
      'UPDATE orders SET status = 3, assigned_room_no = ?, confirmed_at = CURRENT_TIMESTAMP WHERE order_no = ?',
      [assigned_room_no, order_no]
    );

    // -------------------------------------------------------
    // 扣减 room_inventory 库存（check_in_date 至 check_out_date 前一天）
    // 酒店惯例：退房当天不占用库存
    // -------------------------------------------------------
    await query(
      `UPDATE room_inventory
       SET available_rooms = GREATEST(available_rooms - 1, 0)
       WHERE room_id = ?
         AND date >= ?
         AND date < ?`,
      [order.room_id, order.check_in_date, order.check_out_date]
    );

    // 查询确认时间
    const confirmedRow = await query('SELECT confirmed_at FROM orders WHERE order_no = ?', [order_no]);
    const confirmed_at = confirmedRow[0]?.confirmed_at ?? null;

    res.status(200).json({
      success: true,
      message: '订单已确定，状态更新为待入住',
      data: { order_no, status: 3, assigned_room_no, confirmed_at }
    });

  } catch (error) {
    console.error('确定订单失败:', error);
    res.status(500).json({
      success: false,
      message: '确定订单失败',
      error: error.message
    });
  }
});

/**
 * PC端查看订单详情接口
 * GET /api/orderPC/detail
 *
 * 查询参数：
 * - order_no: 订单号（必填）
 *
 * 返回字段说明：
 * - 始终不返回 updated_at
 * - status 为 1（待付款）或 2（待确定）时，不返回 assigned_room_no
 * - status 不为 1、2 时，额外返回 confirmed_at
 */
router.get('/detail', async (req, res) => {
  try {
    const { order_no } = req.query;

    if (!order_no) {
      return res.status(400).json({ success: false, message: '订单号不能为空' });
    }

    // 查询订单，JOIN hotels 和 rooms 取名称，排除 hotel_id、room_id 和 updated_at
    const sql = `
      SELECT
        o.id,
        o.order_no,
        o.user_id,
        h.name        AS hotel_name,
        r.room_type,
        o.check_in_date,
        o.check_out_date,
        o.nights,
        o.total_price,
        o.status,
        o.guest_name,
        o.guest_phone,
        o.assigned_room_no,
        o.confirmed_at,
        o.created_at
      FROM orders o
      INNER JOIN hotels h ON o.hotel_id = h.id
      INNER JOIN rooms  r ON o.room_id  = r.id
      WHERE o.order_no = ?
    `;

    const rows = await query(sql, [order_no]);

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    const order = rows[0];

    // 根据状态动态裁剪返回字段
    if (order.status === 1 || order.status === 2) {
      // 待付款 / 待确定：隐藏 assigned_room_no 和 confirmed_at
      delete order.assigned_room_no;
      delete order.confirmed_at;
    }
    // 状态 3（待入住）/ 4（已完成）：保留 assigned_room_no 和 confirmed_at，不做任何删除

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: order
    });

  } catch (error) {
    console.error('查询订单详情失败:', error);
    res.status(500).json({
      success: false,
      message: '查询订单详情失败',
      error: error.message
    });
  }
});

module.exports = router;


