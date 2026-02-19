const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); 
const { query } = require('../config/database');

/**
 * 生成随机账号 (移动端用户)
 */
function generateAccount() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `MOB${timestamp}${random}`; // 改用 MOB 开头，区分 PC 端账号
}

/**
 * 移动端：用户注册接口 (默认注册为普通顾客)
 * POST /api/loginMobile/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, phone, password } = req.body; // 移动端注册通常不需要填邮箱，尽量简化

    // 1. 简单校验
    if (!phone || !password || !username) {
      return res.status(400).json({ success: false, message: '请填写完整信息（姓名、手机号、密码）' });
    }

    // 2. 检查手机号是否已存在
    const phoneCheckSql = 'SELECT id FROM users WHERE phone = ? AND is_deleted = 0';
    const existingPhone = await query(phoneCheckSql, [phone.trim()]);
    if (existingPhone.length > 0) {
      return res.status(400).json({ success: false, message: '该手机号已注册，请直接登录' });
    }

    // 3. 生成账号并加密密码
    const account = generateAccount();
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. 插入数据 (强制 role_type = 3，代表普通顾客)
    // 4. 插入数据 (加入了 email 字段来满足数据库的必填要求)
    const insertSql = `
      INSERT INTO users (
        account, username, phone, email, password, role_type, status, is_deleted
      ) VALUES (?, ?, ?, ?, ?, 3, 1, 0)
    `;
    // params 数组里多加了一个 '' (空字符串) 对应 email
    const params = [account, username.trim(), phone.trim(), '', hashedPassword];
    const result = await query(insertSql, params);

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: { id: result.insertId, account, username, phone, role_type: 3 }
    });

  } catch (error) {
    console.error('移动端注册失败:', error);
    res.status(500).json({ success: false, message: '注册失败', error: error.message });
  }
});

/**
 * 移动端：用户登录接口 (主推手机号+验证码登录)
 * POST /api/loginMobile/login
 */
router.post('/login', async (req, res) => {
  try {
    const { login_type, phone, code, account, password } = req.body;

    let user = null;

    // --- 方式 A：手机号快捷登录 (移动端最常用) ---
    if (login_type === 'phone') {
      if (!phone || !code) {
        return res.status(400).json({ success: false, message: '手机号和验证码不能为空' });
      }
      if (code.trim() !== '246810') { // 测试阶段固定验证码
        return res.status(401).json({ success: false, message: '验证码错误' });
      }

      const users = await query('SELECT * FROM users WHERE phone = ? AND is_deleted = 0', [phone.trim()]);
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: '该手机号未注册' });
      }
      user = users[0];
    } 
    // --- 方式 B：账号密码登录 (备用) ---
    else if (login_type === 'account') {
      if (!account || !password) {
        return res.status(400).json({ success: false, message: '账号和密码不能为空' });
      }
      
      const users = await query('SELECT * FROM users WHERE account = ? AND is_deleted = 0', [account.trim()]);
      if (users.length === 0) {
        return res.status(401).json({ success: false, message: '账号不存在' });
      }
      user = users[0];

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ success: false, message: '密码错误' });
      }
    } else {
      return res.status(400).json({ success: false, message: '请指定正确的登录类型(phone或account)' });
    }

    // 检查状态并限制角色（不让管理员在顾客端登录）
    if (user.status === 0) {
      return res.status(403).json({ success: false, message: '账号已被禁用' });
    }
    if (user.role_type === 1 || user.role_type === 2) {
      return res.status(403).json({ success: false, message: '管理员/商家请使用后台系统登录' });
    }

    // 更新登录时间并返回数据
    await query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id]);
    delete user.password; // 绝不能把密码返回给前端！

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: user
    });

  } catch (error) {
    console.error('移动端登录失败:', error);
    res.status(500).json({ success: false, message: '登录失败', error: error.message });
  }
});

module.exports = router;