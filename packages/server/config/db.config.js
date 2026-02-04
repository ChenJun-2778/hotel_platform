// 数据库配置
module.exports = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234',
  database: 'hotel',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // 字符集设置
  charset: 'utf8mb4'
};
