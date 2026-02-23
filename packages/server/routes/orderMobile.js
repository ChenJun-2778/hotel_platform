const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * 提交订单接口
 * POST /api/orderMobile/create
 *
 * 请求体参数：
 * - hotel_id:      酒店ID（必填）
 * - room_id:       房间ID（必填）
 * - user_id:       下单用户ID（必填）
 * - check_in_date: 入住日期，格式 YYYY-MM-DD（必填）
 * - check_out_date:离店日期，格式 YYYY-MM-DD（必填）
 * - guest_name:    住客姓名（必填）
 * - guest_phone:   住客手机号（必填）
 * - total_price:   订单总价（必填）
 *
 * 后端自动处理：
 * - order_no: 自动生成，格式 ORD + 时间戳 + 4位随机数
 * - nights:   根据 check_in_date 和 check_out_date 自动计算
 * - status:   默认 1（待付款）
 */
router.post('/create', async (req, res) => {
  try {
    const {
      hotel_id,
      room_id,
      user_id,
      check_in_date,
      check_out_date,
      guest_name,
      guest_phone,
      total_price
    } = req.body;

    // ── 参数校验 ──────────────────────────────────────────────
    if (!hotel_id)      return res.status(400).json({ success: false, message: '酒店ID不能为空' });
    if (!room_id)       return res.status(400).json({ success: false, message: '房间ID不能为空' });
    if (!user_id)       return res.status(400).json({ success: false, message: '用户ID不能为空' });
    if (!check_in_date) return res.status(400).json({ success: false, message: '入住日期不能为空' });
    if (!check_out_date)return res.status(400).json({ success: false, message: '离店日期不能为空' });
    if (!guest_name)    return res.status(400).json({ success: false, message: '住客姓名不能为空' });
    if (!guest_phone)   return res.status(400).json({ success: false, message: '住客手机号不能为空' });
    if (total_price === undefined || total_price === null) {
      return res.status(400).json({ success: false, message: '订单总价不能为空' });
    }

    // ── 日期校验 & 计算住宿天数 ───────────────────────────────
    const checkIn  = new Date(check_in_date);
    const checkOut = new Date(check_out_date);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
      return res.status(400).json({ success: false, message: '日期格式不正确，请使用 YYYY-MM-DD 格式' });
    }
    if (checkOut <= checkIn) {
      return res.status(400).json({ success: false, message: '离店日期必须晚于入住日期' });
    }

    const nights = Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    // ── 外键校验：酒店、房间、用户是否存在 ────────────────────
    const [hotelRows] = await Promise.all([
      query('SELECT id FROM hotels WHERE id = ? AND is_deleted = 0 AND status = 1', [hotel_id]),
    ]);
    if (hotelRows.length === 0) {
      return res.status(404).json({ success: false, message: '酒店不存在或已下架' });
    }

    const roomRows = await query('SELECT id FROM rooms WHERE id = ? AND hotel_id = ? AND is_deleted = 0', [room_id, hotel_id]);
    if (roomRows.length === 0) {
      return res.status(404).json({ success: false, message: '房间不存在或不属于该酒店' });
    }

    const userRows = await query('SELECT id FROM users WHERE id = ? AND is_deleted = 0', [user_id]);
    if (userRows.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在' });
    }

    // ── 生成订单号：ORD + 时间戳(毫秒) + 4位随机数 ────────────
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const order_no = `ORD${Date.now()}${randomSuffix}`;

    // ── 插入订单 ──────────────────────────────────────────────
    const insertSql = `
      INSERT INTO orders (
        order_no,
        user_id,
        hotel_id,
        room_id,
        check_in_date,
        check_out_date,
        nights,
        total_price,
        status,
        guest_name,
        guest_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
    `;

    const result = await query(insertSql, [
      order_no,
      user_id,
      hotel_id,
      room_id,
      check_in_date,
      check_out_date,
      nights,
      total_price,
      guest_name,
      guest_phone
    ]);

    res.status(201).json({
      success: true,
      message: '订单提交成功',
      data: {
        id: result.insertId,
        order_no,
        user_id,
        hotel_id,
        room_id,
        check_in_date,
        check_out_date,
        nights,
        total_price,
        status: 1,
        guest_name,
        guest_phone
      }
    });

  } catch (error) {
    console.error('提交订单失败:', error);
    res.status(500).json({
      success: false,
      message: '提交订单失败',
      error: error.message
    });
  }
});

/**
 * 付款成功接口
 * PUT /api/orderMobile/pay/:order_no
 *
 * 路径参数：
 * - order_no: 订单号（必填，如 ORD17403267712345）
 *
 * 说明：将 status 从 1（待付款）改为 2（待确定），updated_at 自动更新
 */
router.put('/pay/:order_no', async (req, res) => {
  try {
    const { order_no } = req.params;

    if (!order_no) {
      return res.status(400).json({ success: false, message: '订单号不能为空' });
    }

    // 查询订单是否存在
    const orderRows = await query('SELECT * FROM orders WHERE order_no = ?', [order_no]);
    if (orderRows.length === 0) {
      return res.status(404).json({ success: false, message: '订单不存在' });
    }

    const order = orderRows[0];

    // 只有待付款（status=1）的订单才能付款
    if (order.status !== 1) {
      const statusMap = { 2: '待确定', 3: '待入住', 4: '已完成' };
      return res.status(400).json({
        success: false,
        message: `该订单当前状态为「${statusMap[order.status] || '未知'}」，无法重复付款`
      });
    }

    // 将 status 改为 2（待确定），updated_at 由数据库 ON UPDATE CURRENT_TIMESTAMP 自动更新
    await query('UPDATE orders SET status = 2 WHERE order_no = ?', [order_no]);

    // 返回更新后的订单
    const updatedRows = await query('SELECT * FROM orders WHERE order_no = ?', [order_no]);

    res.status(200).json({
      success: true,
      message: '付款成功',
      data: updatedRows[0]
    });

  } catch (error) {
    console.error('付款失败:', error);
    res.status(500).json({
      success: false,
      message: '付款失败',
      error: error.message
    });
  }
});

/**
 * 获取订单列表接口
 * GET /api/orderMobile/list
 *
 * 查询参数：
 * - user_id: 用户ID（必填）
 * - status:  订单状态（可选，1-待付款 2-待确定 3-待入住 4-已完成，不传则返回全部）
 *
 * 返回字段包含 rooms 表的 images 字段，不返回 created_at / updated_at
 */
router.get('/list', async (req, res) => {
  try {
    const { user_id, status } = req.query;

    if (!user_id) {
      return res.status(400).json({ success: false, message: '用户ID不能为空' });
    }

    // 校验 status 合法性
    const validStatuses = [1, 2, 3, 4];
    if (status !== undefined && !validStatuses.includes(Number(status))) {
      return res.status(400).json({ success: false, message: 'status 不合法，仅支持 1、2、3、4' });
    }

    // 动态构建 WHERE 条件
    let where = 'o.user_id = ?';
    const params = [user_id];

    if (status !== undefined) {
      where += ' AND o.status = ?';
      params.push(Number(status));
    }

    const sql = `
      SELECT
        o.id,
        o.order_no,
        o.user_id,
        o.hotel_id,
        o.room_id,
        o.check_in_date,
        o.check_out_date,
        o.nights,
        o.total_price,
        o.status,
        o.guest_name,
        o.guest_phone,
        h.cover_image AS hotel_cover_image,
        h.name AS hotel_name,
        r.room_type,
        r.images AS room_images
      FROM orders o
      LEFT JOIN hotels h ON o.hotel_id = h.id
      LEFT JOIN rooms r ON o.room_id = r.id
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
    console.error('获取订单列表失败:', error);
    res.status(500).json({
      success: false,
      message: '获取订单列表失败',
      error: error.message
    });
  }
});

module.exports = router;


