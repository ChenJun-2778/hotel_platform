-- 用户表
CREATE TABLE IF NOT EXISTS users (
  -- 主键
  id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
  
  -- 账号信息
  account VARCHAR(50) UNIQUE NOT NULL COMMENT '用户账号（系统自动生成）',
  username VARCHAR(100) NOT NULL COMMENT '用户姓名',
  email VARCHAR(255) NOT NULL COMMENT '邮箱',
  phone VARCHAR(20) NOT NULL COMMENT '手机号',
  password VARCHAR(255) NOT NULL COMMENT '密码（加密存储）',
  
  -- 用户类型
  role_type TINYINT NOT NULL DEFAULT 2 COMMENT '角色类型：1-管理员，2-商户',
  
  -- 个人信息
  avatar_url VARCHAR(500) DEFAULT NULL COMMENT '用户头像URL',
  
  -- 时间戳
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  last_login_at TIMESTAMP NULL DEFAULT NULL COMMENT '最后登录时间',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 状态
  status TINYINT DEFAULT 1 COMMENT '账号状态：1-正常，0-禁用',
  is_deleted TINYINT DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  
  -- 索引
  INDEX idx_account (account),
  INDEX idx_email (email),
  INDEX idx_phone (phone),
  INDEX idx_role_type (role_type),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- 插入示例管理员用户
INSERT INTO users (account, username, email, phone, password, role_type, avatar_url) 
VALUES 
  ('ADMIN001', '系统管理员', 'admin@hotel.com', '13800138000', '$2b$10$example_hashed_password', 1, NULL),
  ('USER001', '测试商户', 'merchant@hotel.com', '13800138001', '$2b$10$example_hashed_password', 2, NULL);
