const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

/**
 * 酒店搜索接口
 * GET /api/hotels/search
 * 
 * 查询参数：
 * - location: 地点/城市 (支持模糊查询)
 * - keyword: 酒店关键字 (搜索名称、描述、标签)
 * - checkInDate: 入住日期 (格式: YYYY-MM-DD) - 预留字段
 * - starRating: 酒店星级 (1-5)
 * - minPrice: 最低价格
 * - maxPrice: 最高价格
 * - page: 页码 (默认1)
 * - pageSize: 每页数量 (默认10)
 */
router.get('/search', async (req, res) => {
  try {
    const {
      location,
      keyword,
      checkInDate,
      starRating,
      minPrice,
      maxPrice,
      page = 1,
      pageSize = 10
    } = req.query;

    // 构建查询条件
    let sql = 'SELECT * FROM hotels WHERE status = 1';
    const params = [];

    // 地点筛选（模糊查询）
    if (location) {
      sql += ' AND (location LIKE ? OR address LIKE ?)';
      params.push(`%${location}%`, `%${location}%`);
    }

    // 关键字搜索（在名称、描述、标签中搜索）
    if (keyword) {
      sql += ' AND (name LIKE ? OR description LIKE ? OR tags LIKE ?)';
      params.push(`%${keyword}%`, `%${keyword}%`, `%${keyword}%`);
    }

    // 星级筛选
    if (starRating) {
      sql += ' AND star_rating = ?';
      params.push(parseInt(starRating));
    }

    // 价格区间筛选
    if (minPrice) {
      sql += ' AND price >= ?';
      params.push(parseFloat(minPrice));
    }
    if (maxPrice) {
      sql += ' AND price <= ?';
      params.push(parseFloat(maxPrice));
    }

    // 获取总数（用于分页）
    const countSql = sql.replace('SELECT *', 'SELECT COUNT(*) as total');
    const countResult = await query(countSql, params);
    const total = countResult[0].total;

    // 确保分页参数是有效的数字
    const currentPage = parseInt(page) || 1;
    const currentPageSize = parseInt(pageSize) || 10;
    const offset = (currentPage - 1) * currentPageSize;
    
    // 添加排序和分页（直接拼接，避免 prepared statement 的问题）
    sql += ' ORDER BY price ASC';
    sql += ` LIMIT ${currentPageSize} OFFSET ${offset}`;

    // 执行查询
    const hotels = await query(sql, params);

    res.json({
      success: true,
      data: {
        hotels,
        pagination: {
          total,
          page: currentPage,
          pageSize: currentPageSize,
          totalPages: Math.ceil(total / currentPageSize)
        },
        filters: {
          location,
          keyword,
          checkInDate,
          starRating,
          minPrice,
          maxPrice
        }
      }
    });
  } catch (error) {
    console.error('搜索酒店失败:', error);
    res.status(500).json({
      success: false,
      message: '搜索酒店失败',
      error: error.message
    });
  }
});

/**
 * 获取酒店详情
 * GET /api/hotels/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hotels = await query('SELECT * FROM hotels WHERE id = ? AND status = 1', [id]);

    if (hotels.length === 0) {
      return res.status(404).json({
        success: false,
        message: '酒店不存在或已下架'
      });
    }

    res.json({
      success: true,
      data: hotels[0]
    });
  } catch (error) {
    console.error('获取酒店详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取酒店详情失败',
      error: error.message
    });
  }
});

/**
 * 获取热门城市列表
 * GET /api/hotels/cities/popular
 */
router.get('/cities/popular', async (req, res) => {
  try {
    const sql = `
      SELECT location, COUNT(*) as hotel_count 
      FROM hotels 
      WHERE status = 1 
      GROUP BY location 
      ORDER BY hotel_count DESC 
      LIMIT 10
    `;
    const cities = await query(sql);

    res.json({
      success: true,
      data: cities
    });
  } catch (error) {
    console.error('获取热门城市失败:', error);
    res.status(500).json({
      success: false,
      message: '获取热门城市失败',
      error: error.message
    });
  }
});

module.exports = router;
