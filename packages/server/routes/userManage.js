const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * 获取用户列表接口（分页）
 * GET /api/userManage/list
 *
 * 查询参数：
 * - page:     页码（可选，默认1）
 * - pageSize: 每页条数（可选，默认10，最大100）
 * - keyword:  搜索关键词（可选，同时模糊匹配用户名 username 和邮箱 email）
 *
 * 返回字段：
 * - id:         用户ID
 * - username:   用户名
 * - role_type:  角色类型（1-管理员，2-商户）
 * - email:      邮箱
 * - phone:      手机号
 * - status:     账号状态（1-正常，0-禁用）
 * - created_at: 注册时间
 */
router.get('/list', async (req, res) => {
  try {
    // 分页参数
    const page     = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize) || 10));
    const offset   = (page - 1) * pageSize;

    // 关键词参数
    const keyword = req.query.keyword ? req.query.keyword.trim() : '';

    // 构建 WHERE 条件：只查 role_type IN (1,2)，且未被软删除
    let whereCondition = 'is_deleted = 0 AND role_type IN (1, 2)';
    const queryParams  = [];

    // 关键词搜索：用户名 OR 邮箱
    if (keyword) {
      whereCondition += ' AND (username LIKE ? OR email LIKE ?)';
      const searchPattern = `%${keyword}%`;
      queryParams.push(searchPattern, searchPattern);
    }

    // 查询总数
    const countSql = `
      SELECT COUNT(*) AS total
      FROM users
      WHERE ${whereCondition}
    `;
    const countResult = await query(countSql, queryParams);
    const total = countResult[0].total;

    // 查询用户列表
    const sql = `
      SELECT
        id,
        username,
        role_type,
        email,
        phone,
        status,
        created_at
      FROM users
      WHERE ${whereCondition}
      ORDER BY created_at DESC
      LIMIT ${offset}, ${pageSize}
    `;
    const users = await query(sql, queryParams);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        list: users,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });

  } catch (error) {
    console.error('查询用户列表失败:', error);
    res.status(500).json({
      success: false,
      message: '查询用户列表失败',
      error: error.message
    });
  }
});

/**
 * 删除用户接口（软删除）
 * DELETE /api/userManage/:id
 *
 * 路径参数：
 * - id: 用户ID
 *
 * 功能：将对应用户的 is_deleted 字段置为 1
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (!userId || userId <= 0) {
      return res.status(400).json({ success: false, message: '无效的用户ID' });
    }

    // 检查用户是否存在且未删除
    const checkRows = await query(
      'SELECT id FROM users WHERE id = ? AND is_deleted = 0',
      [userId]
    );
    if (checkRows.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在或已被删除' });
    }

    // 软删除
    await query(
      'UPDATE users SET is_deleted = 1, updated_at = NOW() WHERE id = ?',
      [userId]
    );

    res.status(200).json({
      success: true,
      message: '用户已删除',
      data: { id: userId }
    });

  } catch (error) {
    console.error('删除用户失败:', error);
    res.status(500).json({
      success: false,
      message: '删除用户失败',
      error: error.message
    });
  }
});

/**
 * 编辑用户信息接口
 * PUT /api/userManage/:id
 *
 * 路径参数：
 * - id: 用户ID
 *
 * 请求体（至少传一个字段）：
 * - email:     邮箱（可选）
 * - phone:     手机号（可选）
 * - role_type: 角色类型（可选，1-管理员，2-商户）
 * - status:    账号状态（可选，1-正常，0-禁用）
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    if (!userId || userId <= 0) {
      return res.status(400).json({ success: false, message: '无效的用户ID' });
    }

    const { email, phone, role_type, status } = req.body;

    // 至少需要一个可编辑字段
    if (email === undefined && phone === undefined && role_type === undefined && status === undefined) {
      return res.status(400).json({ success: false, message: '请至少提供一个要修改的字段' });
    }

    // 校验 role_type 合法值
    if (role_type !== undefined && ![1, 2].includes(parseInt(role_type))) {
      return res.status(400).json({ success: false, message: 'role_type 只能为 1（管理员）或 2（商户）' });
    }

    // 校验 status 合法值
    if (status !== undefined && ![0, 1].includes(parseInt(status))) {
      return res.status(400).json({ success: false, message: 'status 只能为 0（禁用）或 1（正常）' });
    }

    // 检查用户是否存在
    const checkRows = await query(
      'SELECT id FROM users WHERE id = ? AND is_deleted = 0',
      [userId]
    );
    if (checkRows.length === 0) {
      return res.status(404).json({ success: false, message: '用户不存在或已被删除' });
    }

    // 动态构建 SET 子句
    const setClauses = [];
    const updateParams = [];

    if (email !== undefined)     { setClauses.push('email = ?');     updateParams.push(email); }
    if (phone !== undefined)     { setClauses.push('phone = ?');     updateParams.push(phone); }
    if (role_type !== undefined) { setClauses.push('role_type = ?'); updateParams.push(parseInt(role_type)); }
    if (status !== undefined)    { setClauses.push('status = ?');    updateParams.push(parseInt(status)); }

    setClauses.push('updated_at = NOW()');
    updateParams.push(userId);

    await query(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`,
      updateParams
    );

    res.status(200).json({
      success: true,
      message: '用户信息已更新',
      data: { id: userId }
    });

  } catch (error) {
    console.error('编辑用户失败:', error);
    res.status(500).json({
      success: false,
      message: '编辑用户失败',
      error: error.message
    });
  }
});

module.exports = router;
