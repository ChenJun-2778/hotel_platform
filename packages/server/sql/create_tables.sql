-- 创建酒店表（更新版）
CREATE TABLE IF NOT EXISTS `hotels` (
  `id` INT PRIMARY KEY AUTO_INCREMENT COMMENT '酒店ID',
  `name` VARCHAR(255) NOT NULL COMMENT '酒店名称',
  `location` VARCHAR(255) NOT NULL COMMENT '酒店地点/城市',
  `address` VARCHAR(500) COMMENT '详细地址',
  `cover_image` VARCHAR(500) NOT NULL COMMENT '酒店首页图片URL',
  `images` TEXT COMMENT '酒店图片列表（JSON数组）',
  `description` TEXT COMMENT '酒店备注/描述',
  `tags` VARCHAR(500) COMMENT '酒店标签（多个标签用逗号分隔）',
  `star_rating` TINYINT DEFAULT 3 COMMENT '酒店星级：1-5星',
  `price` DECIMAL(10, 2) NOT NULL COMMENT '酒店价格（每晚起价）',
  `status` TINYINT DEFAULT 1 COMMENT '状态：1-营业中，0-已下架',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  INDEX `idx_name` (`name`),
  INDEX `idx_location` (`location`),
  INDEX `idx_star_rating` (`star_rating`),
  INDEX `idx_price` (`price`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='酒店表';

-- 插入示例数据
INSERT INTO `hotels` (`name`, `location`, `address`, `cover_image`, `description`, `tags`, `star_rating`, `price`) VALUES
('豪华海景酒店', '三亚', '海南省三亚市海棠湾海棠北路88号', 'https://images.unsplash.com/photo-1566073771259-6a8506099945', '位于海边的五星级酒店，拥有绝佳的海景视野和完善的设施。提供私人沙滩、无边泳池、SPA中心等高端服务。', '海景,豪华,游泳池,私人沙滩,SPA', 5, 888.00),
('城市商务酒店', '上海', '上海市浦东新区陆家嘴环路1000号', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb', '位于市中心的商务型酒店，交通便利，适合商务出差。步行可达地铁站，周边配套齐全。', '商务,交通便利,市中心,会议室,健身房', 4, 368.00),
('温馨家庭旅馆', '杭州', '浙江省杭州市西湖区南山路18号', 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa', '温馨舒适的家庭式旅馆，价格实惠，服务周到。邻近西湖景区，环境优美。', '经济实惠,家庭旅馆,温馨,停车场,近景区', 3, 168.00),
('湖畔度假酒店', '杭州', '浙江省杭州市西湖区杨公堤28号', 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4', '坐落于西湖湖畔的度假酒店，环境清幽，设施完善。提供湖景房、中西餐厅、茶室等。', '度假,湖景,休闲,餐厅,茶室', 4, 588.00),
('现代精品酒店', '北京', '北京市朝阳区建国门外大街1号', 'https://images.unsplash.com/photo-1571896349842-33c89424de2d', '位于CBD核心区域的精品酒店，设计现代简约，服务一流。配备智能化设施。', '精品,现代,智能,商务,CBD', 5, 799.00),
('经济连锁酒店', '广州', '广州市天河区天河路208号', 'https://images.unsplash.com/photo-1590490360182-c33d57733427', '连锁品牌经济型酒店，性价比高，干净整洁。适合短期商务或旅游住宿。', '经济,连锁,性价比,干净,便捷', 3, 198.00),
('山间民宿', '成都', '四川省成都市青城山镇云雾街88号', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b', '位于青城山脚下的特色民宿，空气清新，视野开阔。提供地道川菜和户外活动。', '民宿,山景,特色,川菜,户外', 3, 288.00),
('滨江豪华酒店', '重庆', '重庆市渝中区滨江路100号', 'https://images.unsplash.com/photo-1549294413-26f195200c16', '面朝长江的豪华酒店，夜景绝佳。提供江景餐厅、酒吧、健身中心等设施。', '豪华,江景,夜景,餐厅,酒吧', 5, 658.00);
