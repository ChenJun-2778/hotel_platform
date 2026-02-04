const mysql = require('mysql2/promise');
const dbConfig = require('../config/db.config');

async function testConnection() {
  console.log('🔍 测试数据库连接...\n');
  console.log('配置信息:');
  console.log(`  主机: ${dbConfig.host}`);
  console.log(`  端口: ${dbConfig.port}`);
  console.log(`  用户: ${dbConfig.user}`);
  console.log(`  密码: ${'*'.repeat(dbConfig.password.length)}`);
  console.log(`  数据库: ${dbConfig.database}\n`);
  
  try {
    // 尝试连接（不指定数据库）
    const { database, ...configWithoutDB } = dbConfig;
    const connection = await mysql.createConnection(configWithoutDB);
    
    console.log('✅ MySQL 连接成功！\n');
    
    // 检查数据库是否存在
    const [databases] = await connection.query('SHOW DATABASES LIKE ?', [database]);
    
    if (databases.length > 0) {
      console.log(`✅ 数据库 "${database}" 已存在`);
      
      // 检查表是否存在
      await connection.query(`USE \`${database}\``);
      const [tables] = await connection.query('SHOW TABLES');
      
      if (tables.length > 0) {
        console.log(`\n📊 数据库中的表 (${tables.length}):`);
        tables.forEach(table => {
          console.log(`  - ${Object.values(table)[0]}`);
        });
      } else {
        console.log('\n⚠️  数据库中还没有表，请运行: npm run db:init');
      }
    } else {
      console.log(`⚠️  数据库 "${database}" 不存在，请运行: npm run db:init`);
    }
    
    await connection.end();
    console.log('\n✅ 数据库连接测试完成！');
    
  } catch (error) {
    console.error('\n❌ 连接失败:', error.message);
    console.error('\n请检查:');
    console.error('  1. MySQL 服务是否已启动');
    console.error('  2. 用户名和密码是否正确');
    console.error('  3. config/db.config.js 中的配置是否正确');
    process.exit(1);
  }
}

testConnection();
