const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * 新增酒店接口
 * POST /api/hotels/create
 * 
 * 请求体参数：
 * - user_id: 创建酒店的用户ID (必填)
 * - name: 酒店名称 (必填)
 * - english_name: 酒店英文名称 (可选)
 * - brand: 酒店品牌 (可选)
 * - star_rating: 酒店星级 1-5 (可选，默认3)
 * - location: 酒店地点/城市 (可选，默认'未知')
 * - address: 详细地址 (必填)
 * - hotel_phone: 酒店电话 (必填)
 * - contact: 联系人 (可选)
 * - contact_phone: 联系电话 (可选)
 * - description: 酒店备注/描述 (可选)
 * - hotel_facilities: 酒店设施 (可选)
 * - hotel_type: 酒店类型 (可选，1=国内酒店 2=海外酒店 3=民宿酒店，默认1)
 * - cover_image: 酒店首页图片URL (必填)
 * - images: 酒店图片列表，JSON数组 (可选)
 */
router.post('/create', async (req, res) => {
  try {
    const {
      user_id,
      name,
      english_name,
      brand,
      star_rating = 3,
      location = '未知',
      address,
      hotel_phone,
      contact,
      contact_phone,
      description,
      hotel_facilities,
      cover_image,
      images,
      hotel_type = 1
    } = req.body;

    // 验证必填字段
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: '用户ID不能为空'
      });
    }

    // 验证 user_id 是否为有效数字
    const userIdNum = parseInt(user_id);
    if (!userIdNum || userIdNum <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的用户ID'
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: '酒店名称不能为空'
      });
    }

    if (!address) {
      return res.status(400).json({
        success: false,
        message: '酒店地址不能为空'
      });
    }

    if (!hotel_phone) {
      return res.status(400).json({
        success: false,
        message: '酒店电话不能为空'
      });
    }


    if (!cover_image) {
      return res.status(400).json({
        success: false,
        message: '酒店首页图片不能为空'
      });
    }

    // 随机生成模拟数据：评分（0.0-5.0）、点评数（50-5000）、收藏数（20-3000）
    const score = parseFloat((Math.random() * 5).toFixed(1));
    const review_count = Math.floor(Math.random() * (5000 - 50 + 1)) + 50;
    const favorite_count = Math.floor(Math.random() * (3000 - 20 + 1)) + 20;

    // 插入酒店数据
    const sql = `
      INSERT INTO hotels (
        user_id,
        name, 
        english_name, 
        brand, 
        star_rating, 
        location, 
        address, 
        hotel_phone, 
        contact, 
        contact_phone, 
        description, 
        hotel_facilities, 
        cover_image, 
        images,
        hotel_type,
        score,
        review_count,
        favorite_count,
        status, 
        is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 0)
    `;

    const params = [
      userIdNum,
      name,
      english_name,
      brand,
      star_rating,
      location,
      address,
      hotel_phone,
      contact,
      contact_phone,
      description,
      hotel_facilities,
      cover_image,
      images,
      hotel_type,
      score,
      review_count,
      favorite_count
    ];

    const result = await query(sql, params);

    res.status(201).json({
      success: true,
      message: '酒店创建成功，等待审批',
      data: {
        id: result.insertId,
        user_id: userIdNum,
        name,
        status: 2, // 待审批
        is_deleted: 0 // 未删除
      }
    });

  } catch (error) {
    console.error('创建酒店失败:', error);
    res.status(500).json({
      success: false,
      message: '创建酒店失败',
      error: error.message
    });
  }
});

/**
 * 查询酒店列表接口（分页）
 * GET /api/hotels/list
 * 
 * 查询参数：
 * - page: 页码（可选，默认1）
 * - pageSize: 每页条数（可选，默认10，最大100）
 * - keyword: 搜索关键词（可选，按酒店名称或地址模糊搜索）
 * - user_id: 用户ID（可选，只返回该用户创建的酒店）
 * - hotel_type: 酒店类型（可选，1-国内酒店，2-海外酒店，3-民宿酒店）
 * 
 * 返回字段：
 * - id: 酒店ID
 * - user_id: 创建酒店的用户ID
 * - name: 酒店名称
 * - location: 酒店地点/城市
 * - address: 详细地址
 * - room_number: 酒店房间数
 * - status: 状态（1-营业中，0-已下架，2-待审批，3-审批拒绝）
 * - star_rating: 酒店星级
 * - rejection_reason: 审批拒绝原因
 * - hotel_type: 酒店类型（1-国内酒店，2-海外酒店，3-民宿酒店）
 */
router.get('/list', async (req, res) => {
  try {
    // 获取分页参数，确保是整数
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize) || 10)); // 限制最大100条
    const offset = (page - 1) * pageSize;

    // 获取查询参数
    const keyword = req.query.keyword ? req.query.keyword.trim() : '';
    const user_id = req.query.user_id ? parseInt(req.query.user_id) : null;
    const hotel_type = req.query['hotel_type'] ? parseInt(req.query['hotel_type']) : null;

    // 构建WHERE条件
    let whereCondition = 'is_deleted = 0';
    const queryParams = [];

    // user_id 过滤（只查询该用户的酒店）
    if (user_id) {
      whereCondition += ' AND user_id = ?';
      queryParams.push(user_id);
    }

    // hotel_type 过滤（按酒店类型精确匹配）
    if (hotel_type) {
      whereCondition += ' AND hotel_type = ?';
      queryParams.push(hotel_type);
    }

    if (keyword) {
      // 如果有关键词，按名称、城市（location）或详细地址（address）模糊搜索
      whereCondition += ' AND (name LIKE ? OR location LIKE ? OR address LIKE ?)';
      const searchPattern = `%${keyword}%`;
      queryParams.push(searchPattern, searchPattern, searchPattern);
    }

    // 查询总数
    const countSql = `
      SELECT COUNT(*) as total 
      FROM hotels 
      WHERE ${whereCondition}
    `;
    const countResult = await query(countSql, queryParams);
    const total = countResult[0].total;

    // 查询酒店列表
    const sql = `
      SELECT 
        id,
        user_id,
        name,
        location,
        address,
        room_number,
        status,
        star_rating,
        rejection_reason,
        hotel_type
      FROM hotels
      WHERE ${whereCondition}
      ORDER BY created_at DESC
      LIMIT ${offset}, ${pageSize}
    `;

    const hotels = await query(sql, queryParams);

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: {
        list: hotels,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize)
        }
      }
    });

  } catch (error) {
    console.error('查询酒店列表失败:', error);
    res.status(500).json({
      success: false,
      message: '查询酒店列表失败',
      error: error.message
    });
  }
});

/**
 * 根据ID查询酒店详细信息
 * GET /api/hotels/:id
 * 
 * 路径参数：
 * - id: 酒店ID
 * 
 * 返回字段：除了status和is_deleted之外的所有字段
 */
router.get('/:id', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);

    // 验证ID是否为有效数字
    if (!hotelId || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的酒店ID'
      });
    }

    // 查询酒店详细信息，排除status和is_deleted字段
    const sql = `
      SELECT 
        id,
        name,
        english_name,
        brand,
        star_rating,
        room_number,
        location,
        address,
        hotel_phone,
        contact,
        contact_phone,
        description,
        hotel_facilities,
        cover_image,
        images,
        hotel_type,
        created_at,
        updated_at
      FROM hotels
      WHERE id = ? AND is_deleted = 0
    `;

    const hotels = await query(sql, [hotelId]);

    // 检查酒店是否存在
    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已被删除'
      });
    }

    res.status(200).json({
      success: true,
      message: '查询成功',
      data: hotels[0]
    });

  } catch (error) {
    console.error('查询酒店详情失败:', error);
    res.status(500).json({
      success: false,
      message: '查询酒店详情失败',
      error: error.message
    });
  }
});

/**
 * 修改酒店信息
 * PUT /api/hotels/:id
 * 
 * 路径参数：
 * - id: 酒店ID
 * 
 * 请求体参数（所有字段均为可选）：
 * - name: 酒店名称
 * - english_name: 酒店英文名称
 * - brand: 酒店品牌
 * - star_rating: 酒店星级 1-5
 * - room_number: 酒店房间数
 * - location: 酒店地点/城市
 * - address: 详细地址
 * - hotel_phone: 酒店电话
 * - contact: 联系人
 * - contact_phone: 联系电话
 * - description: 酒店备注/描述
 * - hotel_facilities: 酒店设施
 * - hotel_type: 酒店类型 (1=国内酒店 2=海外酒店 3=民宿酒店)
 * - cover_image: 酒店首页图片URL
 * - images: 酒店图片列表
 * - status: 状态（1-营业中，0-已下架，2-待审批，3-审批拒绝）
 */
router.put('/:id', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);

    // 验证ID是否为有效数字
    if (!hotelId || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的酒店ID'
      });
    }

    // 检查酒店是否存在
    const checkSql = 'SELECT id FROM hotels WHERE id = ? AND is_deleted = 0';
    const existingHotels = await query(checkSql, [hotelId]);
    
    if (existingHotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已被删除'
      });
    }

    // 从请求体获取要更新的字段
    const {
      name,
      english_name,
      brand,
      star_rating,
      room_number,
      location,
      address,
      hotel_phone,
      contact,
      contact_phone,
      description,
      hotel_facilities,
      check_in_time,
      check_out_time,
      cover_image,
      images,
      hotel_type,
      status
    } = req.body;

    // 构建动态更新SQL
    const updateFields = [];
    const updateParams = [];

    if (name !== undefined) {
      updateFields.push('name = ?');
      updateParams.push(name);
    }
    if (english_name !== undefined) {
      updateFields.push('english_name = ?');
      updateParams.push(english_name);
    }
    if (brand !== undefined) {
      updateFields.push('brand = ?');
      updateParams.push(brand);
    }
    if (star_rating !== undefined) {
      updateFields.push('star_rating = ?');
      updateParams.push(star_rating);
    }
    if (room_number !== undefined) {
      updateFields.push('room_number = ?');
      updateParams.push(room_number);
    }
    if (location !== undefined) {
      updateFields.push('location = ?');
      updateParams.push(location);
    }
    if (address !== undefined) {
      updateFields.push('address = ?');
      updateParams.push(address);
    }
    if (hotel_phone !== undefined) {
      updateFields.push('hotel_phone = ?');
      updateParams.push(hotel_phone);
    }
    if (contact !== undefined) {
      updateFields.push('contact = ?');
      updateParams.push(contact);
    }
    if (contact_phone !== undefined) {
      updateFields.push('contact_phone = ?');
      updateParams.push(contact_phone);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateParams.push(description);
    }
    if (hotel_facilities !== undefined) {
      updateFields.push('hotel_facilities = ?');
      updateParams.push(hotel_facilities);
    }
    if (cover_image !== undefined) {
      updateFields.push('cover_image = ?');
      updateParams.push(cover_image);
    }
    if (images !== undefined) {
      updateFields.push('images = ?');
      updateParams.push(images);
    }
    if (hotel_type !== undefined) {
      updateFields.push('hotel_type = ?');
      updateParams.push(hotel_type);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateParams.push(status);
    }

    // 如果没有要更新的字段
    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: '没有提供要更新的字段'
      });
    }

    // 添加酒店ID到参数列表
    updateParams.push(hotelId);

    // 执行更新
    const updateSql = `
      UPDATE hotels 
      SET ${updateFields.join(', ')}
      WHERE id = ? AND is_deleted = 0
    `;

    await query(updateSql, updateParams);

    res.status(200).json({
      success: true,
      message: '酒店信息更新成功',
      data: {
        id: hotelId
      }
    });

  } catch (error) {
    console.error('更新酒店信息失败:', error);
    res.status(500).json({
      success: false,
      message: '更新酒店信息失败',
      error: error.message
    });
  }
});

/**
 * 酒店下架接口
 * PUT /api/hotels/:id/takedown
 *
 * 路径参数：
 * - id: 酒店ID
 *
 * 操作：将对应酒店的 status 改为 0（已下架）
 */
router.put('/:id/takedown', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);

    // 验证ID是否为有效数字
    if (!hotelId || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的酒店ID'
      });
    }

    // 检查酒店是否存在
    const checkSql = 'SELECT id, status FROM hotels WHERE id = ? AND is_deleted = 0';
    const existingHotels = await query(checkSql, [hotelId]);

    if (existingHotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已被删除'
      });
    }

    if (existingHotels[0].status === 0) {
      return res.status(400).json({
        success: false,
        message: '该酒店已处于下架状态'
      });
    }

    // 将酒店状态更新为 0（已下架）
    const updateSql = 'UPDATE hotels SET status = 0 WHERE id = ? AND is_deleted = 0';
    await query(updateSql, [hotelId]);

    res.status(200).json({
      success: true,
      message: '酒店下架成功',
      data: {
        id: hotelId,
        status: 0
      }
    });

  } catch (error) {
    console.error('酒店下架失败:', error);
    res.status(500).json({
      success: false,
      message: '酒店下架失败',
      error: error.message
    });
  }
});

/**
 * 酒店上架接口
 * PUT /api/hotels/:id/putup
 *
 * 路径参数：
 * - id: 酒店ID
 *
 * 操作：将对应酒店的 status 改为 2（待审批/上架）
 */
router.put('/:id/putup', async (req, res) => {
  try {
    const hotelId = parseInt(req.params.id);

    // 验证ID是否为有效数字
    if (!hotelId || hotelId <= 0) {
      return res.status(400).json({
        success: false,
        message: '无效的酒店ID'
      });
    }

    // 检查酒店是否存在
    const checkSql = 'SELECT id, status FROM hotels WHERE id = ? AND is_deleted = 0';
    const existingHotels = await query(checkSql, [hotelId]);

    if (existingHotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已被删除'
      });
    }

    if (existingHotels[0].status === 2) {
      return res.status(400).json({
        success: false,
        message: '该酒店已处于上架（待审批）状态'
      });
    }

    // 将酒店状态更新为 2（上架/待审批）
    const updateSql = 'UPDATE hotels SET status = 2 WHERE id = ? AND is_deleted = 0';
    await query(updateSql, [hotelId]);

    res.status(200).json({
      success: true,
      message: '酒店上架成功',
      data: {
        id: hotelId,
        status: 2
      }
    });

  } catch (error) {
    console.error('酒店上架失败:', error);
    res.status(500).json({
      success: false,
      message: '酒店上架失败',
      error: error.message
    });
  }
});

module.exports = router;


