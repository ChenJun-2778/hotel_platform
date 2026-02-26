const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // 密码加密库
const { query } = require('../config/database');

/**
 * 生成随机账号
 * 格式：USER + 时间戳后6位 + 随机3位数字
 * 例如：USER123456789
 */
function generateAccount() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900); // 生成100-999的随机数
  return `USER${timestamp}${random}`;
}

/**
 * 用户注册接口
 * POST /api/loginPC/register
 * 
 * 请求体参数：
 * - role_type: 角色类型（必填，1-管理员，2-商户）
 * - username: 用户姓名（必填）
 * - email: 邮箱（必填）
 * - phone: 手机号（必填）
 * - password: 密码（必填）
 * 
 * 返回数据：
 * - account: 系统生成的账号
 * - username: 用户姓名
 * - email: 邮箱
 * - role_type: 角色类型
 */
router.post('/register', async (req, res) => {
  try {
    const {
      role_type,
      username,
      email,
      phone,
      password
    } = req.body;

    // ========== 检查重复 ==========
    
    // 检查邮箱是否已存在
    const emailCheckSql = 'SELECT id FROM users WHERE email = ? AND is_deleted = 0';
    const existingEmail = await query(emailCheckSql, [email]);
    
    if (existingEmail.length > 0) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册'
      });
    }

    // 检查手机号是否已存在
    const phoneCheckSql = 'SELECT id FROM users WHERE phone = ? AND is_deleted = 0';
    const existingPhone = await query(phoneCheckSql, [phone]);
    
    if (existingPhone.length > 0) {
      return res.status(400).json({
        success: false,
        message: '该手机号已被注册'
      });
    }

    // ========== 生成账号 ==========
    
    let account = '';
    let accountExists = true;
    let attempts = 0;
    const maxAttempts = 10;

    // 生成唯一账号（最多尝试10次）
    while (accountExists && attempts < maxAttempts) {
      account = generateAccount();
      const accountCheckSql = 'SELECT id FROM users WHERE account = ?';
      const existingAccount = await query(accountCheckSql, [account]);
      accountExists = existingAccount.length > 0;
      attempts++;
    }

    if (accountExists) {
      return res.status(500).json({
        success: false,
        message: '账号生成失败，请重试'
      });
    }

    // ========== 密码加密 ==========
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ========== 插入用户数据 ==========
    
    const insertSql = `
      INSERT INTO users (
        account,
        username,
        email,
        phone,
        password,
        role_type,
        status,
        is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, 1, 0)
    `;

    const params = [
      account,
      username.trim(),
      email.trim(),
      phone.trim(),
      hashedPassword,
      parseInt(role_type)
    ];

    const result = await query(insertSql, params);

    // ========== 返回结果 ==========
    
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        id: result.insertId,
        account: account,
        username: username.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role_type: parseInt(role_type),
        created_at: new Date()
      }
    });

  } catch (error) {
    console.error('用户注册失败:', error);
    res.status(500).json({
      success: false,
      message: '用户注册失败',
      error: error.message
    });
  }
});

/**
 * 用户登录接口
 * POST /api/loginPC/login
 * 
 * 支持两种登录方式：
 * 1. 账号+密码登录
 *    - login_type: 'account'
 *    - account: 登录凭证（账号 / 用户名 / 手机号 / 邮箱 均可）
 *    - password: 密码
 * 
 * 2. 手机号+验证码登录
 *    - login_type: 'phone'
 *    - phone: 手机号
 *    - code: 验证码（固定：246810）
 * 
 * 返回数据：用户完整信息（除密码外）
 */
router.post('/login', async (req, res) => {
  try {
    const { login_type, account, password, phone, code } = req.body;

    // ========== 验证登录类型 ==========
    
    if (!login_type) {
      return res.status(400).json({
        success: false,
        message: '请指定登录类型'
      });
    }

    if (!['account', 'phone'].includes(login_type)) {
      return res.status(400).json({
        success: false,
        message: '登录类型只能是 account 或 phone'
      });
    }

    let user = null;

    // ========== 账号密码登录 ==========
    // 登录凭证支持：系统账号 / 用户名 / 手机号 / 邮箱
    
    if (login_type === 'account') {

      if (!account || account.trim() === '') {
        return res.status(400).json({
          success: false,
          message: '登录凭证不能为空'
        });
      }

      if (!password || password.trim() === '') {
        return res.status(400).json({
          success: false,
          message: '密码不能为空'
        });
      }

      const credential = account.trim();

      // 用 OR 匹配四个字段：account / username / phone / email
      const userSql = `
        SELECT 
          id, account, username, email, phone, password,
          role_type, avatar_url, created_at, last_login_at,
          updated_at, status, is_deleted
        FROM users 
        WHERE is_deleted = 0
          AND (
            account  = ? OR
            username = ? OR
            phone    = ? OR
            email    = ?
          )
        LIMIT 1
      `;
      
      const users = await query(userSql, [credential, credential, credential, credential]);

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: '用户不存在，请检查账号/用户名/手机号/邮箱是否正确'
        });
      }

      user = users[0];

      // 检查账号状态
      if (user.status === 0) {
        return res.status(403).json({
          success: false,
          message: '账号已被禁用，请联系管理员'
        });
      }

      // 验证密码
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: '密码错误'
        });
      }
    }

    // ========== 手机验证码登录 ==========
    
    if (login_type === 'phone') {
      // 验证必填字段
      if (!phone || phone.trim() === '') {
        return res.status(400).json({
          success: false,
          message: '手机号不能为空'
        });
      }

      if (!code || code.trim() === '') {
        return res.status(400).json({
          success: false,
          message: '验证码不能为空'
        });
      }

      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({
          success: false,
          message: '手机号格式不正确'
        });
      }

      // 验证验证码（固定为246810）
      if (code.trim() !== '246810') {
        return res.status(401).json({
          success: false,
          message: '验证码错误'
        });
      }

      // 查询用户
      const userSql = `
        SELECT 
          id, account, username, email, phone, password,
          role_type, avatar_url, created_at, last_login_at,
          updated_at, status, is_deleted
        FROM users 
        WHERE phone = ? AND is_deleted = 0
      `;
      
      const users = await query(userSql, [phone.trim()]);

      if (users.length === 0) {
        return res.status(401).json({
          success: false,
          message: '该手机号未注册'
        });
      }

      user = users[0];

      // 检查账号状态
      if (user.status === 0) {
        return res.status(403).json({
          success: false,
          message: '账号已被禁用，请联系管理员'
        });
      }
    }

    // ========== 更新最后登录时间 ==========
    
    const updateLoginTimeSql = `
      UPDATE users 
      SET last_login_at = NOW() 
      WHERE id = ?
    `;
    await query(updateLoginTimeSql, [user.id]);

    // ========== 返回用户信息（排除密码） ==========
    
    // 删除密码字段
    delete user.password;
    
    // 更新 last_login_at 为当前时间
    user.last_login_at = new Date();

    res.status(200).json({
      success: true,
      message: '登录成功',
      data: user
    });

  } catch (error) {
    console.error('用户登录失败:', error);
    res.status(500).json({
      success: false,
      message: '用户登录失败',
      error: error.message
    });
  }
});

/**
 * 获取用户信息接口
 * GET /api/loginPC/profile/:id
 * 
 * 路径参数：
 * - id: 用户ID
 * 
 * 返回数据：用户完整信息（除密码外）
 */
router.get('/profile/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // 验证ID是否为有效数字
    if (!userId || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
    }

    // 查询用户信息
    const userSql = `
      SELECT 
        id, account, username, email, phone,
        role_type, avatar_url, created_at, last_login_at,
        updated_at, status, is_deleted
      FROM users 
      WHERE id = ? AND is_deleted = 0
    `;
    
    const users = await query(userSql, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在或已被删除'
      });
    }

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: users[0]
    });

  } catch (error) {
    console.error('获取用户信息失败:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message
    });
  }
});

/**
 * 修改用户资料接口
 * PUT /api/loginPC/profile/:id
 * 
 * 路径参数：
 * - id: 用户ID
 * 
 * 请求体参数（所有字段均为可选）：
 * - username: 用户姓名/真实姓名
 * - email: 邮箱
 * - phone: 手机号
 * - avatar_url: 用户头像URL
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
    const { username, email, phone, avatar_url } = req.body;

    // 构建动态更新SQL
    const updateFields = [];
    const updateParams = [];

    if (username !== undefined && username.trim() !== '') {
      updateFields.push('username = ?');
      updateParams.push(username.trim());
    }

    if (email !== undefined && email.trim() !== '') {
      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        return res.status(400).json({
          success: false,
          message: '邮箱格式不正确'
        });
      }

      // 检查邮箱是否已被其他用户使用
      const emailCheckSql = 'SELECT id FROM users WHERE email = ? AND id != ? AND is_deleted = 0';
      const existingEmail = await query(emailCheckSql, [email.trim(), userId]);
      
      if (existingEmail.length > 0) {
        return res.status(400).json({
          success: false,
          message: '该邮箱已被其他用户使用'
        });
      }

      updateFields.push('email = ?');
      updateParams.push(email.trim());
    }

    if (phone !== undefined && phone.trim() !== '') {
      // 验证手机号格式
      const phoneRegex = /^1[3-9]\d{9}$/;
      if (!phoneRegex.test(phone.trim())) {
        return res.status(400).json({
          success: false,
          message: '手机号格式不正确'
        });
      }

      // 检查手机号是否已被其他用户使用
      const phoneCheckSql = 'SELECT id FROM users WHERE phone = ? AND id != ? AND is_deleted = 0';
      const existingPhone = await query(phoneCheckSql, [phone.trim(), userId]);
      
      if (existingPhone.length > 0) {
        return res.status(400).json({
          success: false,
          message: '该手机号已被其他用户使用'
        });
      }

      updateFields.push('phone = ?');
      updateParams.push(phone.trim());
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
        id, account, username, email, phone,
        role_type, avatar_url, created_at, last_login_at,
        updated_at, status, is_deleted
      FROM users 
      WHERE id = ?
    `;
    
    const updatedUsers = await query(userSql, [userId]);

    res.status(200).json({
      success: true,
      message: '用户资料更新成功',
      data: updatedUsers[0]
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

/**
 * 修改密码接口
 * PUT /api/loginPC/change-password/:id
 * 
 * 路径参数：
 * - id: 用户ID
 * 
 * 请求体参数：
 * - old_password: 原密码（必填）
 * - new_password: 新密码（必填）
 * 
 * 返回数据：成功消息
 */
router.put('/change-password/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    // 验证ID是否为有效数字
    if (!userId || userId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
    }

    const { old_password, new_password } = req.body;

    // ========== 验证必填字段 ==========
    
    if (!old_password || old_password.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '原密码不能为空'
      });
    }

    if (!new_password || new_password.trim() === '') {
      return res.status(400).json({
        success: false,
        message: '新密码不能为空'
      });
    }

    // 验证新密码长度（建议至少6位）
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: '新密码长度不能少于6位'
      });
    }

    // 验证新密码和原密码不能相同
    if (old_password === new_password) {
      return res.status(400).json({
        success: false,
        message: '新密码不能与原密码相同'
      });
    }

    // ========== 查询用户并获取原密码 ==========
    
    const userSql = `
      SELECT id, password, status, is_deleted
      FROM users 
      WHERE id = ? AND is_deleted = 0
    `;
    
    const users = await query(userSql, [userId]);

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: '用户不存在或已被删除'
      });
    }

    const user = users[0];

    // 检查账号状态
    if (user.status === 0) {
      return res.status(403).json({
        success: false,
        message: '账号已被禁用，无法修改密码'
      });
    }

    // ========== 验证原密码是否正确 ==========
    
    const isPasswordValid = await bcrypt.compare(old_password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '原密码错误'
      });
    }

    // ========== 加密新密码 ==========
    
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(new_password, saltRounds);

    // ========== 更新密码 ==========
    
    const updateSql = `
      UPDATE users 
      SET password = ?, updated_at = NOW()
      WHERE id = ? AND is_deleted = 0
    `;

    await query(updateSql, [hashedNewPassword, userId]);

    // ========== 返回成功消息 ==========
    
    res.status(200).json({
      success: true,
      message: '密码修改成功'
    });

  } catch (error) {
    console.error('修改密码失败:', error);
    res.status(500).json({
      success: false,
      message: '修改密码失败',
      error: error.message
    });
  }
});

module.exports = router;

