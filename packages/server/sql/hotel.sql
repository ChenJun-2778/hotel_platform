/*
 Navicat Premium Data Transfer

 Source Server         : root
 Source Server Type    : MySQL
 Source Server Version : 90300 (9.3.0)
 Source Host           : localhost:3306
 Source Schema         : hotel

 Target Server Type    : MySQL
 Target Server Version : 90300 (9.3.0)
 File Encoding         : 65001

 Date: 06/02/2026 15:10:30
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for hotels
-- ----------------------------
DROP TABLE IF EXISTS `hotels`;
CREATE TABLE `hotels`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '酒店ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '酒店名称',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '未知' COMMENT '酒店地点/城市',
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '详细地址',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '酒店首页图片URL',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '酒店图片列表（JSON数组）',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '酒店备注/描述',
  `tags` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '酒店标签（多个标签用逗号分隔）',
  `star_rating` tinyint NULL DEFAULT 3 COMMENT '酒店星级：1-5星',
  `price` decimal(10, 2) NOT NULL COMMENT '酒店价格（每晚）',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：1-营业中，0-已下架',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE,
  INDEX `idx_price`(`price` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_location`(`location` ASC) USING BTREE,
  INDEX `idx_star_rating`(`star_rating` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '酒店表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of hotels
-- ----------------------------
INSERT INTO `hotels` VALUES (1, '豪华海景酒店', '三亚', '海南省三亚市海棠湾海棠北路88号', 'https://example.com/hotel1.jpg', NULL, '位于海边的五星级酒店，拥有绝佳的海景视野和完善的设施。', '海景,五星级,豪华,游泳池', 5, 888.00, 1, '2026-02-04 15:59:59', '2026-02-04 16:08:52');
INSERT INTO `hotels` VALUES (2, '城市商务酒店', '上海', '上海市浦东新区陆家嘴环路1000号', 'https://example.com/hotel2.jpg', NULL, '位于市中心的商务型酒店，交通便利，适合商务出差。', '商务,交通便利,市中心,会议室', 4, 368.00, 1, '2026-02-04 15:59:59', '2026-02-04 16:08:52');
INSERT INTO `hotels` VALUES (3, '温馨家庭旅馆', '杭州', '浙江省杭州市西湖区南山路18号', 'https://example.com/hotel3.jpg', NULL, '温馨舒适的家庭式旅馆，价格实惠，服务周到。', '经济实惠,家庭旅馆,温馨,停车场', 3, 168.00, 1, '2026-02-04 15:59:59', '2026-02-04 16:08:52');

SET FOREIGN_KEY_CHECKS = 1;
