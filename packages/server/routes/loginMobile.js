const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { query } = require('../config/database');
// jwt库生成token
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'my_hotel_super_secret_key_2026';

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
    // 3. 新增：生成真正的 Token
    // 第一个参数是“载荷”(Payload)：你想在手环里存什么公开信息（绝对不要存密码！）
    // 第二个参数是刚才定义的秘钥
    // 第三个参数是过期时间（比如 24 小时）
    const token = jwt.sign(
      {
        id: user.id,
        account: user.account,
        role_type: user.role_type
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    delete user.password; // 绝不能把密码返回给前端！
    user.last_login_at = new Date();
    res.status(200).json({
      success: true,
      message: '登录成功',
      data: {
        token: token,       // <--- 这里！真正的 Token 发出去了！
        userInfo: {
          ...user,
          avatar: user.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
        }      // 把用户信息包在 userInfo 里，迎合前端的格式
      }
    });

  } catch (error) {
    console.error('移动端登录失败:', error);
    res.status(500).json({ success: false, message: '登录失败', error: error.message });
  }
});

/**
 * 移动端：更新用户信息接口
 * PUT /api/loginMobile/profile/:id
 * 
 * 路径参数：
 * - id: 用户ID
 * 
 * 请求体参数：
 * - username: 用户名（可选）
 * - avatar_url: 头像URL（可选）
 * 
 * 返回数据：更新后的用户信息
 */
router.put('/profile/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // 验证ID是否为有效数字
    if (!userId || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
    }

    // 检查用户是否存在
    const checkSql = 'SELECT id FROM users WHERE id = ? AND is_deleted = 0';
    const existingUsers = await query(checkSql, [userId]);
    
    if (existingUsers.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在或已被删除'
      });
    }

    // 获取要更新的字段
    const { username, avatar_url } = req.body;

    // 构建动态更新SQL
    const updateFields = [];
    const updateParams = [];

    if (username !== undefined && username.trim() !== '') {
      updateFields.push('username = ?');
      updateParams.push(username.trim());
    }

    if (avatar_url !== undefined) {
      updateFields.push('avatar_url = ?');
      updateParams.push(avatar_url);
    }

    // 如果没有要更新的字段
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有提供要更新的字段'
      });
    }

    // 添加更新时间
    updateFields.push('updated_at = NOW()');

    // 添加用户ID到参数列表
    updateParams.push(userId);

    // 执行更新
    const updateSql = `
      UPDATE users 
      SET ${updateFields.join(', ')}
      WHERE id = ? AND is_deleted = 0
    `;

    await query(updateSql, updateParams);

    // 查询更新后的用户信息
    const userSql = `
      SELECT 
        id, account, username, phone, email,
        role_type, avatar_url, created_at, last_login_at,
        updated_at, status
      FROM users 
      WHERE id = ?
    `;
    
    const updatedUsers = await query(userSql, [userId]);
    const updatedUser = updatedUsers[0];

    res.status(200).json({
      success: true,
      message: '用户资料更新成功',
      data: {
        ...updatedUser,
        avatar: updatedUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
      }
    });

  } catch (error) {
    console.error('更新用户资料失败:', error);
    res.status(500).json({
      success: false,
      message: '更新用户资料失败',
      error: error.message
    });
  }
});

module.exports = router;