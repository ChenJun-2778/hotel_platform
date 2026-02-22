/*
 Navicat Premium Data Transfer

 Source Server         : hotel
 Source Server Type    : MySQL
 Source Server Version : 80044 (8.0.44)
 Source Host           : 47.99.56.81:3306
 Source Schema         : hotel

 Target Server Type    : MySQL
 Target Server Version : 80044 (8.0.44)
 File Encoding         : 65001

 Date: 21/02/2026 20:51:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for hotels
-- ----------------------------
DROP TABLE IF EXISTS `hotels`;
CREATE TABLE `hotels`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '酒店ID',
  `user_id` int NOT NULL COMMENT '用户ID',
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '酒店名称',
  `english_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '酒店英文名称',
  `brand` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '酒店品牌',
  `star_rating` tinyint NOT NULL DEFAULT 3 COMMENT '酒店星级：1-5星',
  `room_number` int NOT NULL COMMENT '酒店房间数',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '未知' COMMENT '酒店地点/城市',
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `hotel_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '酒店电话',
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系人',
  `contact_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系电话',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '酒店备注/描述',
  `hotel_facilities` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '酒店设施',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '酒店首页图片URL',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '酒店图片列表（JSON数组）',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：1-营业中，0-已下架，2-待审批，3-审批拒绝',
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '拒绝原因（仅当status=3时有值）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` int NOT NULL COMMENT '是否删除：0代表未删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_location`(`location` ASC) USING BTREE,
  INDEX `idx_star_rating`(`star_rating` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `fk_hotels_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '酒店表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of hotels
-- ----------------------------
INSERT INTO `hotels` VALUES (4, 3, '上海外滩华尔道夫酒店', 'Waldorf Astoria Shanghai on the Bund', '华尔道夫', 5, 260, '上海', '上海市黄浦区中山东一路2号', '021-63229988', '张经理', '13800138000', '位于外滩黄浦江畔的奢华酒店，拥有绝佳江景和历史建筑。酒店提供米其林星级餐厅、豪华水疗中心和顶层酒吧。', '免费WiFi,健身房,游泳池,水疗中心,商务中心,餐厅,酒吧,停车场,礼宾服务', 'https://example.com/images/waldorf-shanghai-cover.jpg', '[\"https://example.com/images/waldorf-1.jpg\",\"https://example.com/images/waldorf-2.jpg\",\"https://example.com/images/waldorf-3.jpg\"]', 3, '酒店资质不符合要求，缺少营业执照', '2026-02-09 20:50:00', '2026-02-15 21:22:47', 0);
INSERT INTO `hotels` VALUES (5, 3, '好利来酒店', 'haolilai hotel', '好利来连锁', 3, 45, '河北省秦皇岛市北戴河区', '江南水岸', '05551234567', '唐经理', '18005552928', '请问请问', '停车场,游泳池,健身房', 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1770713883279-k0al35.png', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1770713889494-8kepb1.png\"]', 1, '', '2026-02-10 16:58:10', '2026-02-21 16:32:03', 0);

-- ----------------------------
-- Table structure for room_inventory
-- ----------------------------
DROP TABLE IF EXISTS `room_inventory`;
CREATE TABLE `room_inventory`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `room_id` int NOT NULL COMMENT '房间（房型）ID',
  `hotel_id` int NOT NULL COMMENT '酒店ID（冗余，便于按城市查询）',
  `date` date NOT NULL COMMENT '日期',
  `total_rooms` int NOT NULL COMMENT '该日期该房型总数',
  `available_rooms` int NOT NULL COMMENT '该日期该房型剩余可用数',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_room_date`(`room_id` ASC, `date` ASC) USING BTREE,
  INDEX `idx_hotel_date`(`hotel_id` ASC, `date` ASC) USING BTREE,
  CONSTRAINT `fk_inventory_hotel_id` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_inventory_room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 181 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '房间日历库存表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of room_inventory
-- ----------------------------
INSERT INTO `room_inventory` VALUES (1, 7, 5, '2026-02-21', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (2, 7, 5, '2026-02-22', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (3, 7, 5, '2026-02-23', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (4, 7, 5, '2026-02-24', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (5, 7, 5, '2026-02-25', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (6, 7, 5, '2026-02-26', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (7, 7, 5, '2026-02-27', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (8, 7, 5, '2026-02-28', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (9, 7, 5, '2026-03-01', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (10, 7, 5, '2026-03-02', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (11, 7, 5, '2026-03-03', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (12, 7, 5, '2026-03-04', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (13, 7, 5, '2026-03-05', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (14, 7, 5, '2026-03-06', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (15, 7, 5, '2026-03-07', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (16, 7, 5, '2026-03-08', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (17, 7, 5, '2026-03-09', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (18, 7, 5, '2026-03-10', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (19, 7, 5, '2026-03-11', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (20, 7, 5, '2026-03-12', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (21, 7, 5, '2026-03-13', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (22, 7, 5, '2026-03-14', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (23, 7, 5, '2026-03-15', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (24, 7, 5, '2026-03-16', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (25, 7, 5, '2026-03-17', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (26, 7, 5, '2026-03-18', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (27, 7, 5, '2026-03-19', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (28, 7, 5, '2026-03-20', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (29, 7, 5, '2026-03-21', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (30, 7, 5, '2026-03-22', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (31, 7, 5, '2026-03-23', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (32, 7, 5, '2026-03-24', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (33, 7, 5, '2026-03-25', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (34, 7, 5, '2026-03-26', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (35, 7, 5, '2026-03-27', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (36, 7, 5, '2026-03-28', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (37, 7, 5, '2026-03-29', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (38, 7, 5, '2026-03-30', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (39, 7, 5, '2026-03-31', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (40, 7, 5, '2026-04-01', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (41, 7, 5, '2026-04-02', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (42, 7, 5, '2026-04-03', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (43, 7, 5, '2026-04-04', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (44, 7, 5, '2026-04-05', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (45, 7, 5, '2026-04-06', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (46, 7, 5, '2026-04-07', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (47, 7, 5, '2026-04-08', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (48, 7, 5, '2026-04-09', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (49, 7, 5, '2026-04-10', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (50, 7, 5, '2026-04-11', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (51, 7, 5, '2026-04-12', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (52, 7, 5, '2026-04-13', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (53, 7, 5, '2026-04-14', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (54, 7, 5, '2026-04-15', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (55, 7, 5, '2026-04-16', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (56, 7, 5, '2026-04-17', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (57, 7, 5, '2026-04-18', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (58, 7, 5, '2026-04-19', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (59, 7, 5, '2026-04-20', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (60, 7, 5, '2026-04-21', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (61, 7, 5, '2026-04-22', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (62, 7, 5, '2026-04-23', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (63, 7, 5, '2026-04-24', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (64, 7, 5, '2026-04-25', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (65, 7, 5, '2026-04-26', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (66, 7, 5, '2026-04-27', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (67, 7, 5, '2026-04-28', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (68, 7, 5, '2026-04-29', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (69, 7, 5, '2026-04-30', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (70, 7, 5, '2026-05-01', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (71, 7, 5, '2026-05-02', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (72, 7, 5, '2026-05-03', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (73, 7, 5, '2026-05-04', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (74, 7, 5, '2026-05-05', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (75, 7, 5, '2026-05-06', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (76, 7, 5, '2026-05-07', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (77, 7, 5, '2026-05-08', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (78, 7, 5, '2026-05-09', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (79, 7, 5, '2026-05-10', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (80, 7, 5, '2026-05-11', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (81, 7, 5, '2026-05-12', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (82, 7, 5, '2026-05-13', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (83, 7, 5, '2026-05-14', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (84, 7, 5, '2026-05-15', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (85, 7, 5, '2026-05-16', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (86, 7, 5, '2026-05-17', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (87, 7, 5, '2026-05-18', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (88, 7, 5, '2026-05-19', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (89, 7, 5, '2026-05-20', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (90, 7, 5, '2026-05-21', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (91, 7, 5, '2026-05-22', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (92, 7, 5, '2026-05-23', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (93, 7, 5, '2026-05-24', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (94, 7, 5, '2026-05-25', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (95, 7, 5, '2026-05-26', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (96, 7, 5, '2026-05-27', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (97, 7, 5, '2026-05-28', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (98, 7, 5, '2026-05-29', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (99, 7, 5, '2026-05-30', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (100, 7, 5, '2026-05-31', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (101, 7, 5, '2026-06-01', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (102, 7, 5, '2026-06-02', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (103, 7, 5, '2026-06-03', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (104, 7, 5, '2026-06-04', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (105, 7, 5, '2026-06-05', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (106, 7, 5, '2026-06-06', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (107, 7, 5, '2026-06-07', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (108, 7, 5, '2026-06-08', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (109, 7, 5, '2026-06-09', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (110, 7, 5, '2026-06-10', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (111, 7, 5, '2026-06-11', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (112, 7, 5, '2026-06-12', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (113, 7, 5, '2026-06-13', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (114, 7, 5, '2026-06-14', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (115, 7, 5, '2026-06-15', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (116, 7, 5, '2026-06-16', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (117, 7, 5, '2026-06-17', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (118, 7, 5, '2026-06-18', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (119, 7, 5, '2026-06-19', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (120, 7, 5, '2026-06-20', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (121, 7, 5, '2026-06-21', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (122, 7, 5, '2026-06-22', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (123, 7, 5, '2026-06-23', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (124, 7, 5, '2026-06-24', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (125, 7, 5, '2026-06-25', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (126, 7, 5, '2026-06-26', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (127, 7, 5, '2026-06-27', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (128, 7, 5, '2026-06-28', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (129, 7, 5, '2026-06-29', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (130, 7, 5, '2026-06-30', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (131, 7, 5, '2026-07-01', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (132, 7, 5, '2026-07-02', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (133, 7, 5, '2026-07-03', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (134, 7, 5, '2026-07-04', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (135, 7, 5, '2026-07-05', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (136, 7, 5, '2026-07-06', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (137, 7, 5, '2026-07-07', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (138, 7, 5, '2026-07-08', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (139, 7, 5, '2026-07-09', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (140, 7, 5, '2026-07-10', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (141, 7, 5, '2026-07-11', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (142, 7, 5, '2026-07-12', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (143, 7, 5, '2026-07-13', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (144, 7, 5, '2026-07-14', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (145, 7, 5, '2026-07-15', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (146, 7, 5, '2026-07-16', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (147, 7, 5, '2026-07-17', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (148, 7, 5, '2026-07-18', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (149, 7, 5, '2026-07-19', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (150, 7, 5, '2026-07-20', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (151, 7, 5, '2026-07-21', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (152, 7, 5, '2026-07-22', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (153, 7, 5, '2026-07-23', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (154, 7, 5, '2026-07-24', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (155, 7, 5, '2026-07-25', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (156, 7, 5, '2026-07-26', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (157, 7, 5, '2026-07-27', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (158, 7, 5, '2026-07-28', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (159, 7, 5, '2026-07-29', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (160, 7, 5, '2026-07-30', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (161, 7, 5, '2026-07-31', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (162, 7, 5, '2026-08-01', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (163, 7, 5, '2026-08-02', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (164, 7, 5, '2026-08-03', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (165, 7, 5, '2026-08-04', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (166, 7, 5, '2026-08-05', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (167, 7, 5, '2026-08-06', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (168, 7, 5, '2026-08-07', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (169, 7, 5, '2026-08-08', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (170, 7, 5, '2026-08-09', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (171, 7, 5, '2026-08-10', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (172, 7, 5, '2026-08-11', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (173, 7, 5, '2026-08-12', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (174, 7, 5, '2026-08-13', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (175, 7, 5, '2026-08-14', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (176, 7, 5, '2026-08-15', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (177, 7, 5, '2026-08-16', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (178, 7, 5, '2026-08-17', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (179, 7, 5, '2026-08-18', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');
INSERT INTO `room_inventory` VALUES (180, 7, 5, '2026-08-19', 23, 9, '2026-02-21 16:32:03', '2026-02-21 16:32:03');

-- ----------------------------
-- Table structure for rooms
-- ----------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `hotel_id` int NOT NULL COMMENT '所属酒店ID',
  `room_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房间号',
  `room_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房型',
  `room_type_en` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '英文房型',
  `bed_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '大床' COMMENT '床型：大床/双床/三床/榻榻米',
  `area` decimal(6, 2) NULL DEFAULT NULL COMMENT '面积(㎡)',
  `floor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '楼层',
  `max_occupancy` int NOT NULL DEFAULT 2 COMMENT '最多入住人数',
  `base_price` decimal(10, 2) NOT NULL COMMENT '基础价格(元/晚)',
  `total_rooms` int NOT NULL COMMENT '此类型房间总数',
  `available_rooms` int NOT NULL COMMENT '可用房间数',
  `facilities` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '房间设施（JSON数组）',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '房间描述',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '房间图片列表（JSON数组）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除：0代表未删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_hotel_id`(`hotel_id` ASC) USING BTREE,
  INDEX `idx_room_type`(`room_type` ASC) USING BTREE,
  INDEX `idx_base_price`(`base_price` ASC) USING BTREE,
  CONSTRAINT `fk_rooms_hotel_id` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '房间表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of rooms
-- ----------------------------
INSERT INTO `rooms` VALUES (3, 4, '2808', '行政豪华大床房', 'Executive Deluxe King Room', '大床', 45.50, '28层', 2, 888.00, 15, 15, '[]', '位于酒店高层的行政豪华大床房，配备落地窗，可俯瞰城市全景。房间宽敞明亮，配有独立办公区域和舒适的休息空间，是商务出行的理想选择。', '\"[\\\"https://example.com/images/room1.jpg\\\",\\\"https://example.com/images/room2.jpg\\\",\\\"https://example.com/images/room3.jpg\\\"]\"', '2026-02-10 10:23:08', '2026-02-11 19:42:00', 1);
INSERT INTO `rooms` VALUES (4, 4, '3001', '总统套房', 'Presidential Suite', '特大床', 120.00, '30层', 4, 3888.00, 15, 12, '[\"WiFi\",\"空调\",\"电视\",\"独立卫浴\",\"吹风机\",\"热水壶\",\"冰箱\",\"保险箱\",\"浴缸\",\"阳台\",\"书桌\",\"沙发\"]', '位于酒店高层的行政豪华大床房，配备落地窗，可俯瞰城市全景。房间宽敞明亮，配有独立办公区域和舒适的休息空间，是商务出行的理想选择。', '[\"https://example.com/images/room1.jpg\",\"https://example.com/images/room2.jpg\",\"https://example.com/images/room3.jpg\"]', '2026-02-10 10:41:44', '2026-02-11 18:18:52', 1);
INSERT INTO `rooms` VALUES (5, 4, '101', '豪华大床房', 'trtrt', '大床', 23.00, '10-15', 2, 123.00, 23, 23, '[\"空调\",\"吹风机\",\"独立卫浴\",\"电视\"]', '232323', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1770796265465-9af5cs.png\"]', '2026-02-11 15:51:06', '2026-02-11 19:23:27', 0);
INSERT INTO `rooms` VALUES (6, 4, '102', '双床房', 'sdsdsd', '双床', 34.00, '10-12', 2, 234.00, 23, 12, '[\"电视\",\"WiFi\",\"热水壶\",\"冰箱\"]', '二二二', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1770810188347-7ss4me.png\"]', '2026-02-11 19:43:08', '2026-02-11 19:43:08', 0);
INSERT INTO `rooms` VALUES (7, 5, '102', '双床房', '233232', '双床', 23.00, '10-15', 2, 2323.00, 23, 9, '[]', '232323', '\"[\\\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1770972516076-lkpe67.png\\\"]\"', '2026-02-13 16:48:36', '2026-02-13 16:48:59', 0);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of sys_user
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `account` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户账号（系统自动生成）',
  `username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '用户姓名',
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '邮箱',
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '手机号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '密码（加密存储）',
  `role_type` tinyint NOT NULL DEFAULT 2 COMMENT '角色类型：1-管理员，2-商户',
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '用户头像URL',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `last_login_at` timestamp NULL DEFAULT NULL COMMENT '最后登录时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `status` tinyint NULL DEFAULT 1 COMMENT '账号状态：1-正常，0-禁用',
  `is_deleted` tinyint NULL DEFAULT 0 COMMENT '是否删除：0-未删除，1-已删除',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `account`(`account` ASC) USING BTREE,
  INDEX `idx_account`(`account` ASC) USING BTREE,
  INDEX `idx_email`(`email` ASC) USING BTREE,
  INDEX `idx_phone`(`phone` ASC) USING BTREE,
  INDEX `idx_role_type`(`role_type` ASC) USING BTREE,
  INDEX `idx_created_at`(`created_at` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (3, 'USER982533880', '张三丰', 'zhangsan_new@hotel.com', '13900139001', '$2b$10$1UhoHBBGHp6j/1eZREXtSe2SvQ8ZD8n02fFnCVPIvpTj7yTXQ7aAe', 2, 'https://example.com/new-avatar.jpg', '2026-02-14 21:49:44', '2026-02-14 22:23:55', '2026-02-15 19:56:08', 1, 0);
INSERT INTO `users` VALUES (4, 'MOB307988854', 'Apifox测试员', '', '13812345678', '$2b$10$mbQY9l4MfznSgtJolSkH0OqaUTAZfEcKDC6MeezO3NBxH9ZPGjvmS', 3, NULL, '2026-02-19 17:45:08', NULL, '2026-02-19 18:05:06', 1, 1);
INSERT INTO `users` VALUES (5, 'MOB989870339', 'Cj', '', '18383919236', '$2b$10$3lGjql90C0iZRvcNyuS2seNR9vSy7qpAHNaqFsWldJEian5Akw9JW', 3, 'https://www.google.com/imgres?q=%E7%A9%BA%E7%99%BD%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F&imgurl=https%3A%2F%2Fimg.ixintu.com%2Fdownload%2Fjpg%2F202001%2Fb319c1054eb817a437fb518f92597b0a.jpg!ys&imgrefurl=https%3A%2F%2Fixintu.com%2Fall%2Fkongbaitouxiang.html&docid=qq4EQ9tfpcLRcM&tbnid=WbKoJNICOlQYwM&vet=12ahUKEwiNo72m6-eSAxUniq8BHdIqL0gQM3oECBkQAA..i&w=250&h=250&hcb=2&ved=2ahUKEwiNo72m6-eSAxUniq8BHdIqL0gQM3oECBkQAA', '2026-02-19 21:16:29', '2026-02-21 20:37:24', '2026-02-21 20:37:24', 1, 0);
INSERT INTO `users` VALUES (8, 'USER701815184', 'tc0522', '1527664608@qq.com', '18005552928', '$2b$10$hGN2axzWNvnwfS6iF/4os.4OKMY1J4SnhNzyIXxnKBDoW88FqdblK', 2, NULL, '2026-02-21 20:25:01', '2026-02-21 20:48:15', '2026-02-21 20:48:15', 1, 0);
INSERT INTO `users` VALUES (9, 'USER259796560', 'TC0522', '12345678@gmail.com', '18005552920', '$2b$10$5XgrZtMQU7ew1pzxZv.1texXhUV.A5cbYrxWesMNvXn.gNzzDfP.O', 2, NULL, '2026-02-21 20:34:19', '2026-02-21 20:46:09', '2026-02-21 20:46:09', 1, 0);

-- ----------------------------
-- Table structure for orders
-- ----------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '订单号（唯一）',
  `user_id` int NOT NULL COMMENT '下单用户ID（mobile端用户）',
  `hotel_id` int NOT NULL COMMENT '酒店ID',
  `room_id` int NOT NULL COMMENT '房间ID',
  `check_in_date` date NOT NULL COMMENT '入住日期',
  `check_out_date` date NOT NULL COMMENT '退房日期',
  `nights` int NOT NULL COMMENT '住宿天数',
  `total_price` decimal(10, 2) NOT NULL COMMENT '订单总价',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '订单状态：1-待付款，2-待确定，3-待入住，4-已完成',
  `guest_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '入住人姓名',
  `guest_phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '入住人手机号',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_hotel_id`(`hotel_id` ASC) USING BTREE,
  INDEX `idx_room_id`(`room_id` ASC) USING BTREE,
  INDEX `idx_check_in_date`(`check_in_date` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_orders_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_hotel_id` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of orders
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
