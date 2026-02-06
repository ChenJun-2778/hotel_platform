const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * 新增酒店接口
 * POST /api/hotels/create
 * 
 * 请求体参数：
 * - name: 酒店名称 (必填)
 * - english_name: 酒店英文名称 (可选)
 * - brand: 酒店品牌 (可选)
 * - star_rating: 酒店星级 1-5 (可选，默认3)
 * - room_number: 酒店房间数 (必填)
 * - location: 酒店地点/城市 (可选，默认'未知')
 * - address: 详细地址 (必填)
 * - hotel_phone: 酒店电话 (必填)
 * - contact: 联系人 (可选)
 * - contact_phone: 联系电话 (可选)
 * - description: 酒店备注/描述 (可选)
 * - hotel_facilities: 酒店设施 (可选)
 * - check_in_time: 入住时间 (必填，格式: YYYY-MM-DD HH:mm:ss)
 * - check_out_time: 退房时间 (必填，格式: YYYY-MM-DD HH:mm:ss)
 * - cover_image: 酒店首页图片URL (必填)
 * - images: 酒店图片列表，JSON数组 (可选)
 */
router.post('/create', async (req, res) => {
  try {
    const {
      name,
      english_name,
      brand,
      star_rating = 3,
      room_number,
      location = '未知',
      address,
      hotel_phone,
      contact,
      contact_phone,
      description,
      hotel_facilities,
      check_in_time,
      check_out_time,
      cover_image,
      images
    } = req.body;

    // 验证必填字段
    if (!name) {
      return res.status(400).json({
        success: false,
        message: '酒店名称不能为空'
      });
    }

    if (!room_number) {
      return res.status(400).json({
        success: false,
        message: '酒店房间数不能为空'
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

    if (!check_in_time) {
      return res.status(400).json({
        success: false,
        message: '入住时间不能为空'
      });
    }

    if (!check_out_time) {
      return res.status(400).json({
        success: false,
        message: '退房时间不能为空'
      });
    }

    if (!cover_image) {
      return res.status(400).json({
        success: false,
        message: '酒店首页图片不能为空'
      });
    }

    // 插入酒店数据
    const sql = `
      INSERT INTO hotels (
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
        status, 
        is_deleted
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 2, 0)
    `;

    const params = [
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
      images
    ];

    const result = await query(sql, params);

    res.status(201).json({
      success: true,
      message: '酒店创建成功，等待审批',
      data: {
        id: result.insertId,
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
 * - pageSize: 每页条数（可选，默认10）
 * 
 * 返回字段：
 * - name: 酒店名称
 * - location: 酒店地点/城市
 * - address: 详细地址
 * - room_number: 酒店房间数
 * - status: 状态（1-营业中，0-已下架，2-待审批，3-审批拒绝）
 * - star_rating: 酒店星级
 */
router.get('/list', async (req, res) => {
  try {
    // 获取分页参数，确保是整数
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const pageSize = Math.max(1, Math.min(100, parseInt(req.query.pageSize) || 10)); // 限制最大100条
    const offset = (page - 1) * pageSize;

    // 查询总数
    const countSql = `
      SELECT COUNT(*) as total 
      FROM hotels 
      WHERE is_deleted = 0
    `;
    const countResult = await query(countSql);
    const total = countResult[0].total;

    // 查询酒店列表 - 直接使用整数值而不是占位符，因为LIMIT子句在某些MySQL版本的预处理语句中有问题
    const sql = `
      SELECT 
        name,
        location,
        address,
        room_number,
        status,
        star_rating
      FROM hotels
      WHERE is_deleted = 0
      ORDER BY created_at DESC
      LIMIT ${offset}, ${pageSize}
    `;

    const hotels = await query(sql);

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
        check_in_time,
        check_out_time,
        cover_image,
        images,
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
 * - check_in_time: 入住时间
 * - check_out_time: 退房时间
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
    if (check_in_time !== undefined) {
      updateFields.push('check_in_time = ?');
      updateParams.push(check_in_time);
    }
    if (check_out_time !== undefined) {
      updateFields.push('check_out_time = ?');
      updateParams.push(check_out_time);
    }
    if (cover_image !== undefined) {
      updateFields.push('cover_image = ?');
      updateParams.push(cover_image);
    }
    if (images !== undefined) {
      updateFields.push('images = ?');
      updateParams.push(images);
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

module.exports = router;
