const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

async function migrateDatabase() {
  let connection;
  
  try {
    console.log('🔄 开始数据库迁移...\n');
    
    // 连接到数据库
    connection = await mysql.createConnection(dbConfig);
    await connection.query(`USE \`${dbConfig.database}\``);
    
    console.log('✅ 已连接到数据库\n');
    
    // 检查表是否存在
    const [tables] = await connection.query("SHOW TABLES LIKE 'hotels'");
    
    if (tables.length === 0) {
      console.log('⚠️  hotels 表不存在，请先运行: npm run db:init');
      return;
    }
    
    console.log('📊 检查并添加缺失的字段...\n');
    
    // 获取当前表结构
    const [columns] = await connection.query('DESCRIBE hotels');
    const existingColumns = columns.map(col => col.Field);
    
    // 添加 location 字段
    if (!existingColumns.includes('location')) {
      console.log('  ➕ 添加 location 字段...');
      await connection.query(`
        ALTER TABLE hotels 
        ADD COLUMN location VARCHAR(255) NOT NULL DEFAULT '未知' COMMENT '酒店地点/城市' AFTER name
      `);
      await connection.query('CREATE INDEX idx_location ON hotels(location)');
      console.log('  ✅ location 字段添加成功');
    } else {
      console.log('  ⏭️  location 字段已存在，跳过');
    }
    
    // 添加 address 字段
    if (!existingColumns.includes('address')) {
      console.log('  ➕ 添加 address 字段...');
      await connection.query(`
        ALTER TABLE hotels 
        ADD COLUMN address VARCHAR(500) COMMENT '详细地址' AFTER location
      `);
      console.log('  ✅ address 字段添加成功');
    } else {
      console.log('  ⏭️  address 字段已存在，跳过');
    }
    
    // 添加 images 字段
    if (!existingColumns.includes('images')) {
      console.log('  ➕ 添加 images 字段...');
      await connection.query(`
        ALTER TABLE hotels 
        ADD COLUMN images TEXT COMMENT '酒店图片列表（JSON数组）' AFTER cover_image
      `);
      console.log('  ✅ images 字段添加成功');
    } else {
      console.log('  ⏭️  images 字段已存在，跳过');
    }
    
    // 添加 star_rating 字段
    if (!existingColumns.includes('star_rating')) {
      console.log('  ➕ 添加 star_rating 字段...');
      await connection.query(`
        ALTER TABLE hotels 
        ADD COLUMN star_rating TINYINT DEFAULT 3 COMMENT '酒店星级：1-5星' AFTER tags
      `);
      await connection.query('CREATE INDEX idx_star_rating ON hotels(star_rating)');
      console.log('  ✅ star_rating 字段添加成功');
    } else {
      console.log('  ⏭️  star_rating 字段已存在，跳过');
    }
    
    console.log('\n🔄 更新现有数据...\n');
    
    // 更新现有数据的示例值
    const updateData = [
      { id: 1, location: '三亚', address: '海南省三亚市海棠湾海棠北路88号', star_rating: 5 },
      { id: 2, location: '上海', address: '上海市浦东新区陆家嘴环路1000号', star_rating: 4 },
      { id: 3, location: '杭州', address: '浙江省杭州市西湖区南山路18号', star_rating: 3 }
    ];
    
    for (const data of updateData) {
      const [existing] = await connection.query('SELECT id FROM hotels WHERE id = ?', [data.id]);
      if (existing.length > 0) {
        await connection.query(
          'UPDATE hotels SET location = ?, address = ?, star_rating = ? WHERE id = ?',
          [data.location, data.address, data.star_rating, data.id]
        );
        console.log(`  ✅ 更新酒店 ID ${data.id} 的数据`);
      }
    }
    
    console.log('\n🎉 数据库迁移完成！');
    console.log('=' .repeat(50));
    
    // 显示更新后的表结构
    const [newColumns] = await connection.query('DESCRIBE hotels');
    console.log('\n📋 当前表结构:');
    newColumns.forEach(col => {
      console.log(`  - ${col.Field} (${col.Type}) ${col.Comment || ''}`);
    });
    
  } catch (error) {
    console.error('\n❌ 数据库迁移失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行迁移
migrateDatabase();
