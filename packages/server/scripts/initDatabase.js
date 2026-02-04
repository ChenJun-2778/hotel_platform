const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

async function initDatabase() {
  let connection;
  
  try {
    console.log('🔄 开始初始化数据库...\n');
    
    // 连接到 MySQL（不指定数据库）
    const { database, ...configWithoutDB } = dbConfig;
    connection = await mysql.createConnection(configWithoutDB);
    
    // 创建数据库（如果不存在）
    console.log(`📦 检查数据库 "${database}" 是否存在...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅ 数据库 "${database}" 准备就绪\n`);
    
    // 选择数据库
    await connection.query(`USE \`${database}\``);
    
    // 读取并执行 SQL 文件
    const sqlFilePath = path.join(__dirname, '../sql/create_tables.sql');
    console.log('📄 读取 SQL 文件:', sqlFilePath);
    
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // 按分号分割 SQL 语句
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`🔧 执行 ${statements.length} 条 SQL 语句...\n`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await connection.query(statement);
          const preview = statement.substring(0, 50).replace(/\n/g, ' ');
          console.log(`  ✓ 语句 ${i + 1}/${statements.length}: ${preview}...`);
        } catch (error) {
          console.error(`  ✗ 语句 ${i + 1} 执行失败:`, error.message);
        }
      }
    }
    
    console.log('\n🎉 数据库初始化完成！');
    console.log('=' .repeat(50));
    
    // 查询并显示酒店数据
    const [hotels] = await connection.query('SELECT * FROM hotels');
    console.log(`\n📊 当前酒店数量: ${hotels.length}`);
    if (hotels.length > 0) {
      console.log('\n酒店列表:');
      hotels.forEach(hotel => {
        console.log(`  - ${hotel.name} (¥${hotel.price}/晚) [${hotel.tags}]`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ 数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 执行初始化
initDatabase();
