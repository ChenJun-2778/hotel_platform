-- 更新现有 hotels 表，添加新字段
-- 如果表已存在，执行此脚本来添加缺失的字段

-- 添加 location 字段
ALTER TABLE `hotels` 
ADD COLUMN IF NOT EXISTS `location` VARCHAR(255) NOT NULL DEFAULT '未知' COMMENT '酒店地点/城市' AFTER `name`,
ADD INDEX IF NOT EXISTS `idx_location` (`location`);

-- 添加 address 字段
ALTER TABLE `hotels` 
ADD COLUMN IF NOT EXISTS `address` VARCHAR(500) COMMENT '详细地址' AFTER `location`;

-- 添加 images 字段
ALTER TABLE `hotels` 
ADD COLUMN IF NOT EXISTS `images` TEXT COMMENT '酒店图片列表（JSON数组）' AFTER `cover_image`;

-- 添加 star_rating 字段
ALTER TABLE `hotels` 
ADD COLUMN IF NOT EXISTS `star_rating` TINYINT DEFAULT 3 COMMENT '酒店星级：1-5星' AFTER `tags`,
ADD INDEX IF NOT EXISTS `idx_star_rating` (`star_rating`);

-- 更新现有数据的默认值
UPDATE `hotels` SET `location` = '上海' WHERE `location` = '未知';
