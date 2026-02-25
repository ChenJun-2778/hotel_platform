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

 Date: 25/02/2026 15:48:57
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
  `room_number` int NULL DEFAULT NULL COMMENT '酒店房间数',
  `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '未知' COMMENT '酒店地点/城市',
  `address` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '详细地址',
  `hotel_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '酒店电话',
  `contact` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系人',
  `contact_phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '联系电话',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '酒店备注/描述',
  `hotel_facilities` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '酒店设施',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '酒店首页图片URL',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '酒店图片列表（JSON数组）',
  `hotel_type` tinyint NOT NULL DEFAULT 1 COMMENT '酒店类型：1-国内酒店，2-海外酒店，3-民宿酒店',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：1-营业中，0-已下架，2-待审批，3-审批拒绝',
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '拒绝原因（仅当status=3时有值）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `score` decimal(2, 1) NULL DEFAULT NULL COMMENT '酒店评分（0.0-5.0，模拟数据）',
  `review_count` int NULL DEFAULT 0 COMMENT '点评数量（模拟数据）',
  `favorite_count` int NULL DEFAULT 0 COMMENT '收藏数量（模拟数据）',
  `is_deleted` int NOT NULL COMMENT '是否删除：0代表未删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_name`(`name` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_location`(`location` ASC) USING BTREE,
  INDEX `idx_star_rating`(`star_rating` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `fk_hotels_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '酒店表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of hotels
-- ----------------------------
INSERT INTO `hotels` VALUES (16, 12, '格林豪泰', 'gelinhaotai', '格林豪泰', 3, NULL, '重庆市市辖区涪陵区', '江南水岸', '05551234567', '唐经理', '123000000', '123123', '停车场,餐厅,免费WiFi,游泳池', 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771949438104-ks76qg.png', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771949438541-7q0140.png\",\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771949438616-pzicbz.png\",\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771949438689-dtdp8v.png\"]', 1, 1, NULL, '2026-02-25 00:10:39', '2026-02-25 00:19:35', 4.4, 2276, 174, 0);
INSERT INTO `hotels` VALUES (17, 12, '如家', 'rujia', '如家', 4, 3, '重庆市市辖区渝中区', '江南水岸', '05551234567', '唐经理', '123000000', '撒大苏打', '停车场,餐厅,游泳池,水疗中心', 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771949851802-ivit86.png', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771949852175-hz3b17.png\",\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771949852290-u00b3u.png\"]', 1, 1, NULL, '2026-02-25 00:17:33', '2026-02-25 00:30:57', 0.5, 1542, 238, 0);
INSERT INTO `hotels` VALUES (18, 12, '汉庭', 'wqeqwe', '格林豪泰', 5, 6, '重庆市市辖区万州区', '江南水岸', '05551234567', '唐经理', '18005552928', '嗡嗡嗡', '停车场,洗衣房,健身房,游泳池', 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771953286131-isz1b8.png', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1771953286543-gidv7s.png\"]', 1, 1, NULL, '2026-02-25 01:14:47', '2026-02-25 01:24:40', 0.2, 1615, 2309, 0);

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
  `assigned_room_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '商家分配的实际房间号（确认订单时填写）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `confirmed_at` timestamp NULL DEFAULT NULL COMMENT '订单确认时间（商家确认时记录）',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uk_order_no`(`order_no` ASC) USING BTREE,
  INDEX `idx_user_id`(`user_id` ASC) USING BTREE,
  INDEX `idx_hotel_id`(`hotel_id` ASC) USING BTREE,
  INDEX `idx_room_id`(`room_id` ASC) USING BTREE,
  INDEX `idx_check_in_date`(`check_in_date` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  CONSTRAINT `fk_orders_hotel_id` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_room_id` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of orders
-- ----------------------------
INSERT INTO `orders` VALUES (8, 'ORD17719523688843659', 14, 17, 20, '2026-02-25', '2026-02-27', 2, 4646.00, 3, 'Cj', '18383919236', '111', '2026-02-25 00:59:28', '2026-02-25 01:09:04', '2026-02-25 01:09:04');
INSERT INTO `orders` VALUES (9, 'ORD17720003398861241', 14, 17, 20, '2026-02-26', '2026-02-27', 1, 2323.00, 1, 'Cj', '18383919236', NULL, '2026-02-25 14:18:59', '2026-02-25 14:18:59', NULL);
INSERT INTO `orders` VALUES (10, 'ORD17720003438371386', 14, 17, 20, '2026-02-26', '2026-02-27', 1, 2323.00, 1, 'Cj', '18383919236', NULL, '2026-02-25 14:19:02', '2026-02-25 14:19:02', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 2521 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '房间日历库存表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of room_inventory
-- ----------------------------
INSERT INTO `room_inventory` VALUES (1981, 20, 17, '2026-02-24', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1982, 20, 17, '2026-02-25', 3, 2, '2026-02-25 00:30:57', '2026-02-25 01:09:04');
INSERT INTO `room_inventory` VALUES (1983, 20, 17, '2026-02-26', 3, 2, '2026-02-25 00:30:57', '2026-02-25 01:09:04');
INSERT INTO `room_inventory` VALUES (1984, 20, 17, '2026-02-27', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1985, 20, 17, '2026-02-28', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1986, 20, 17, '2026-03-01', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1987, 20, 17, '2026-03-02', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1988, 20, 17, '2026-03-03', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1989, 20, 17, '2026-03-04', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1990, 20, 17, '2026-03-05', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1991, 20, 17, '2026-03-06', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1992, 20, 17, '2026-03-07', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1993, 20, 17, '2026-03-08', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1994, 20, 17, '2026-03-09', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1995, 20, 17, '2026-03-10', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1996, 20, 17, '2026-03-11', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1997, 20, 17, '2026-03-12', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1998, 20, 17, '2026-03-13', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (1999, 20, 17, '2026-03-14', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2000, 20, 17, '2026-03-15', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2001, 20, 17, '2026-03-16', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2002, 20, 17, '2026-03-17', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2003, 20, 17, '2026-03-18', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2004, 20, 17, '2026-03-19', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2005, 20, 17, '2026-03-20', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2006, 20, 17, '2026-03-21', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2007, 20, 17, '2026-03-22', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2008, 20, 17, '2026-03-23', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2009, 20, 17, '2026-03-24', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2010, 20, 17, '2026-03-25', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2011, 20, 17, '2026-03-26', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2012, 20, 17, '2026-03-27', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2013, 20, 17, '2026-03-28', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2014, 20, 17, '2026-03-29', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2015, 20, 17, '2026-03-30', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2016, 20, 17, '2026-03-31', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2017, 20, 17, '2026-04-01', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2018, 20, 17, '2026-04-02', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2019, 20, 17, '2026-04-03', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2020, 20, 17, '2026-04-04', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2021, 20, 17, '2026-04-05', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2022, 20, 17, '2026-04-06', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2023, 20, 17, '2026-04-07', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2024, 20, 17, '2026-04-08', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2025, 20, 17, '2026-04-09', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2026, 20, 17, '2026-04-10', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2027, 20, 17, '2026-04-11', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2028, 20, 17, '2026-04-12', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2029, 20, 17, '2026-04-13', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2030, 20, 17, '2026-04-14', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2031, 20, 17, '2026-04-15', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2032, 20, 17, '2026-04-16', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2033, 20, 17, '2026-04-17', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2034, 20, 17, '2026-04-18', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2035, 20, 17, '2026-04-19', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2036, 20, 17, '2026-04-20', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2037, 20, 17, '2026-04-21', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2038, 20, 17, '2026-04-22', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2039, 20, 17, '2026-04-23', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2040, 20, 17, '2026-04-24', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2041, 20, 17, '2026-04-25', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2042, 20, 17, '2026-04-26', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2043, 20, 17, '2026-04-27', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2044, 20, 17, '2026-04-28', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2045, 20, 17, '2026-04-29', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2046, 20, 17, '2026-04-30', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2047, 20, 17, '2026-05-01', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2048, 20, 17, '2026-05-02', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2049, 20, 17, '2026-05-03', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2050, 20, 17, '2026-05-04', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2051, 20, 17, '2026-05-05', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2052, 20, 17, '2026-05-06', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2053, 20, 17, '2026-05-07', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2054, 20, 17, '2026-05-08', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2055, 20, 17, '2026-05-09', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2056, 20, 17, '2026-05-10', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2057, 20, 17, '2026-05-11', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2058, 20, 17, '2026-05-12', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2059, 20, 17, '2026-05-13', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2060, 20, 17, '2026-05-14', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2061, 20, 17, '2026-05-15', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2062, 20, 17, '2026-05-16', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2063, 20, 17, '2026-05-17', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2064, 20, 17, '2026-05-18', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2065, 20, 17, '2026-05-19', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2066, 20, 17, '2026-05-20', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2067, 20, 17, '2026-05-21', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2068, 20, 17, '2026-05-22', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2069, 20, 17, '2026-05-23', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2070, 20, 17, '2026-05-24', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2071, 20, 17, '2026-05-25', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2072, 20, 17, '2026-05-26', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2073, 20, 17, '2026-05-27', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2074, 20, 17, '2026-05-28', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2075, 20, 17, '2026-05-29', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2076, 20, 17, '2026-05-30', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2077, 20, 17, '2026-05-31', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2078, 20, 17, '2026-06-01', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2079, 20, 17, '2026-06-02', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2080, 20, 17, '2026-06-03', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2081, 20, 17, '2026-06-04', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2082, 20, 17, '2026-06-05', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2083, 20, 17, '2026-06-06', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2084, 20, 17, '2026-06-07', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2085, 20, 17, '2026-06-08', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2086, 20, 17, '2026-06-09', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2087, 20, 17, '2026-06-10', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2088, 20, 17, '2026-06-11', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2089, 20, 17, '2026-06-12', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2090, 20, 17, '2026-06-13', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2091, 20, 17, '2026-06-14', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2092, 20, 17, '2026-06-15', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2093, 20, 17, '2026-06-16', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2094, 20, 17, '2026-06-17', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2095, 20, 17, '2026-06-18', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2096, 20, 17, '2026-06-19', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2097, 20, 17, '2026-06-20', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2098, 20, 17, '2026-06-21', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2099, 20, 17, '2026-06-22', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2100, 20, 17, '2026-06-23', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2101, 20, 17, '2026-06-24', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2102, 20, 17, '2026-06-25', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2103, 20, 17, '2026-06-26', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2104, 20, 17, '2026-06-27', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2105, 20, 17, '2026-06-28', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2106, 20, 17, '2026-06-29', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2107, 20, 17, '2026-06-30', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2108, 20, 17, '2026-07-01', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2109, 20, 17, '2026-07-02', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2110, 20, 17, '2026-07-03', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2111, 20, 17, '2026-07-04', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2112, 20, 17, '2026-07-05', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2113, 20, 17, '2026-07-06', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2114, 20, 17, '2026-07-07', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2115, 20, 17, '2026-07-08', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2116, 20, 17, '2026-07-09', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2117, 20, 17, '2026-07-10', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2118, 20, 17, '2026-07-11', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2119, 20, 17, '2026-07-12', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2120, 20, 17, '2026-07-13', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2121, 20, 17, '2026-07-14', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2122, 20, 17, '2026-07-15', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2123, 20, 17, '2026-07-16', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2124, 20, 17, '2026-07-17', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2125, 20, 17, '2026-07-18', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2126, 20, 17, '2026-07-19', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2127, 20, 17, '2026-07-20', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2128, 20, 17, '2026-07-21', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2129, 20, 17, '2026-07-22', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2130, 20, 17, '2026-07-23', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2131, 20, 17, '2026-07-24', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2132, 20, 17, '2026-07-25', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2133, 20, 17, '2026-07-26', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2134, 20, 17, '2026-07-27', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2135, 20, 17, '2026-07-28', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2136, 20, 17, '2026-07-29', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2137, 20, 17, '2026-07-30', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2138, 20, 17, '2026-07-31', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2139, 20, 17, '2026-08-01', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2140, 20, 17, '2026-08-02', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2141, 20, 17, '2026-08-03', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2142, 20, 17, '2026-08-04', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2143, 20, 17, '2026-08-05', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2144, 20, 17, '2026-08-06', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2145, 20, 17, '2026-08-07', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2146, 20, 17, '2026-08-08', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2147, 20, 17, '2026-08-09', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2148, 20, 17, '2026-08-10', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2149, 20, 17, '2026-08-11', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2150, 20, 17, '2026-08-12', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2151, 20, 17, '2026-08-13', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2152, 20, 17, '2026-08-14', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2153, 20, 17, '2026-08-15', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2154, 20, 17, '2026-08-16', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2155, 20, 17, '2026-08-17', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2156, 20, 17, '2026-08-18', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2157, 20, 17, '2026-08-19', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2158, 20, 17, '2026-08-20', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2159, 20, 17, '2026-08-21', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2160, 20, 17, '2026-08-22', 3, 3, '2026-02-25 00:30:57', '2026-02-25 00:30:57');
INSERT INTO `room_inventory` VALUES (2161, 21, 18, '2026-02-24', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2162, 21, 18, '2026-02-25', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2163, 21, 18, '2026-02-26', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2164, 21, 18, '2026-02-27', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2165, 21, 18, '2026-02-28', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2166, 21, 18, '2026-03-01', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2167, 21, 18, '2026-03-02', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2168, 21, 18, '2026-03-03', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2169, 21, 18, '2026-03-04', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2170, 21, 18, '2026-03-05', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2171, 21, 18, '2026-03-06', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2172, 21, 18, '2026-03-07', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2173, 21, 18, '2026-03-08', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2174, 21, 18, '2026-03-09', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2175, 21, 18, '2026-03-10', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2176, 21, 18, '2026-03-11', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2177, 21, 18, '2026-03-12', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2178, 21, 18, '2026-03-13', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2179, 21, 18, '2026-03-14', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2180, 21, 18, '2026-03-15', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2181, 21, 18, '2026-03-16', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2182, 21, 18, '2026-03-17', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2183, 21, 18, '2026-03-18', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2184, 21, 18, '2026-03-19', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2185, 21, 18, '2026-03-20', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2186, 21, 18, '2026-03-21', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2187, 21, 18, '2026-03-22', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2188, 21, 18, '2026-03-23', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2189, 21, 18, '2026-03-24', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2190, 21, 18, '2026-03-25', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2191, 21, 18, '2026-03-26', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2192, 21, 18, '2026-03-27', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2193, 21, 18, '2026-03-28', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2194, 21, 18, '2026-03-29', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2195, 21, 18, '2026-03-30', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2196, 21, 18, '2026-03-31', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2197, 21, 18, '2026-04-01', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2198, 21, 18, '2026-04-02', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2199, 21, 18, '2026-04-03', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2200, 21, 18, '2026-04-04', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2201, 21, 18, '2026-04-05', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2202, 21, 18, '2026-04-06', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2203, 21, 18, '2026-04-07', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2204, 21, 18, '2026-04-08', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2205, 21, 18, '2026-04-09', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2206, 21, 18, '2026-04-10', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2207, 21, 18, '2026-04-11', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2208, 21, 18, '2026-04-12', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2209, 21, 18, '2026-04-13', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2210, 21, 18, '2026-04-14', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2211, 21, 18, '2026-04-15', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2212, 21, 18, '2026-04-16', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2213, 21, 18, '2026-04-17', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2214, 21, 18, '2026-04-18', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2215, 21, 18, '2026-04-19', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2216, 21, 18, '2026-04-20', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2217, 21, 18, '2026-04-21', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2218, 21, 18, '2026-04-22', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2219, 21, 18, '2026-04-23', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2220, 21, 18, '2026-04-24', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2221, 21, 18, '2026-04-25', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2222, 21, 18, '2026-04-26', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2223, 21, 18, '2026-04-27', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2224, 21, 18, '2026-04-28', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2225, 21, 18, '2026-04-29', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2226, 21, 18, '2026-04-30', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2227, 21, 18, '2026-05-01', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2228, 21, 18, '2026-05-02', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2229, 21, 18, '2026-05-03', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2230, 21, 18, '2026-05-04', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2231, 21, 18, '2026-05-05', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2232, 21, 18, '2026-05-06', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2233, 21, 18, '2026-05-07', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2234, 21, 18, '2026-05-08', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2235, 21, 18, '2026-05-09', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2236, 21, 18, '2026-05-10', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2237, 21, 18, '2026-05-11', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2238, 21, 18, '2026-05-12', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2239, 21, 18, '2026-05-13', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2240, 21, 18, '2026-05-14', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2241, 21, 18, '2026-05-15', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2242, 21, 18, '2026-05-16', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2243, 21, 18, '2026-05-17', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2244, 21, 18, '2026-05-18', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2245, 21, 18, '2026-05-19', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2246, 21, 18, '2026-05-20', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2247, 21, 18, '2026-05-21', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2248, 21, 18, '2026-05-22', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2249, 21, 18, '2026-05-23', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2250, 21, 18, '2026-05-24', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2251, 21, 18, '2026-05-25', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2252, 21, 18, '2026-05-26', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2253, 21, 18, '2026-05-27', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2254, 21, 18, '2026-05-28', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2255, 21, 18, '2026-05-29', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2256, 21, 18, '2026-05-30', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2257, 21, 18, '2026-05-31', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2258, 21, 18, '2026-06-01', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2259, 21, 18, '2026-06-02', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2260, 21, 18, '2026-06-03', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2261, 21, 18, '2026-06-04', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2262, 21, 18, '2026-06-05', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2263, 21, 18, '2026-06-06', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2264, 21, 18, '2026-06-07', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2265, 21, 18, '2026-06-08', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2266, 21, 18, '2026-06-09', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2267, 21, 18, '2026-06-10', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2268, 21, 18, '2026-06-11', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2269, 21, 18, '2026-06-12', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2270, 21, 18, '2026-06-13', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2271, 21, 18, '2026-06-14', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2272, 21, 18, '2026-06-15', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2273, 21, 18, '2026-06-16', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2274, 21, 18, '2026-06-17', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2275, 21, 18, '2026-06-18', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2276, 21, 18, '2026-06-19', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2277, 21, 18, '2026-06-20', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2278, 21, 18, '2026-06-21', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2279, 21, 18, '2026-06-22', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2280, 21, 18, '2026-06-23', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2281, 21, 18, '2026-06-24', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2282, 21, 18, '2026-06-25', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2283, 21, 18, '2026-06-26', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2284, 21, 18, '2026-06-27', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2285, 21, 18, '2026-06-28', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2286, 21, 18, '2026-06-29', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2287, 21, 18, '2026-06-30', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2288, 21, 18, '2026-07-01', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2289, 21, 18, '2026-07-02', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2290, 21, 18, '2026-07-03', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2291, 21, 18, '2026-07-04', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2292, 21, 18, '2026-07-05', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2293, 21, 18, '2026-07-06', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2294, 21, 18, '2026-07-07', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2295, 21, 18, '2026-07-08', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2296, 21, 18, '2026-07-09', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2297, 21, 18, '2026-07-10', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2298, 21, 18, '2026-07-11', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2299, 21, 18, '2026-07-12', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2300, 21, 18, '2026-07-13', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2301, 21, 18, '2026-07-14', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2302, 21, 18, '2026-07-15', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2303, 21, 18, '2026-07-16', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2304, 21, 18, '2026-07-17', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2305, 21, 18, '2026-07-18', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2306, 21, 18, '2026-07-19', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2307, 21, 18, '2026-07-20', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2308, 21, 18, '2026-07-21', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2309, 21, 18, '2026-07-22', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2310, 21, 18, '2026-07-23', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2311, 21, 18, '2026-07-24', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2312, 21, 18, '2026-07-25', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2313, 21, 18, '2026-07-26', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2314, 21, 18, '2026-07-27', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2315, 21, 18, '2026-07-28', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2316, 21, 18, '2026-07-29', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2317, 21, 18, '2026-07-30', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2318, 21, 18, '2026-07-31', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2319, 21, 18, '2026-08-01', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2320, 21, 18, '2026-08-02', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2321, 21, 18, '2026-08-03', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2322, 21, 18, '2026-08-04', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2323, 21, 18, '2026-08-05', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2324, 21, 18, '2026-08-06', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2325, 21, 18, '2026-08-07', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2326, 21, 18, '2026-08-08', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2327, 21, 18, '2026-08-09', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2328, 21, 18, '2026-08-10', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2329, 21, 18, '2026-08-11', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2330, 21, 18, '2026-08-12', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2331, 21, 18, '2026-08-13', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2332, 21, 18, '2026-08-14', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2333, 21, 18, '2026-08-15', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2334, 21, 18, '2026-08-16', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2335, 21, 18, '2026-08-17', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2336, 21, 18, '2026-08-18', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2337, 21, 18, '2026-08-19', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2338, 21, 18, '2026-08-20', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2339, 21, 18, '2026-08-21', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2340, 21, 18, '2026-08-22', 3, 3, '2026-02-25 01:16:13', '2026-02-25 01:16:13');
INSERT INTO `room_inventory` VALUES (2341, 22, 18, '2026-02-24', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2342, 22, 18, '2026-02-25', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2343, 22, 18, '2026-02-26', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2344, 22, 18, '2026-02-27', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2345, 22, 18, '2026-02-28', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2346, 22, 18, '2026-03-01', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2347, 22, 18, '2026-03-02', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2348, 22, 18, '2026-03-03', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2349, 22, 18, '2026-03-04', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2350, 22, 18, '2026-03-05', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2351, 22, 18, '2026-03-06', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2352, 22, 18, '2026-03-07', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2353, 22, 18, '2026-03-08', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2354, 22, 18, '2026-03-09', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2355, 22, 18, '2026-03-10', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2356, 22, 18, '2026-03-11', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2357, 22, 18, '2026-03-12', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2358, 22, 18, '2026-03-13', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2359, 22, 18, '2026-03-14', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2360, 22, 18, '2026-03-15', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2361, 22, 18, '2026-03-16', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2362, 22, 18, '2026-03-17', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2363, 22, 18, '2026-03-18', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2364, 22, 18, '2026-03-19', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2365, 22, 18, '2026-03-20', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2366, 22, 18, '2026-03-21', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2367, 22, 18, '2026-03-22', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2368, 22, 18, '2026-03-23', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2369, 22, 18, '2026-03-24', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2370, 22, 18, '2026-03-25', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2371, 22, 18, '2026-03-26', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2372, 22, 18, '2026-03-27', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2373, 22, 18, '2026-03-28', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2374, 22, 18, '2026-03-29', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2375, 22, 18, '2026-03-30', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2376, 22, 18, '2026-03-31', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2377, 22, 18, '2026-04-01', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2378, 22, 18, '2026-04-02', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2379, 22, 18, '2026-04-03', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2380, 22, 18, '2026-04-04', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2381, 22, 18, '2026-04-05', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2382, 22, 18, '2026-04-06', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2383, 22, 18, '2026-04-07', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2384, 22, 18, '2026-04-08', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2385, 22, 18, '2026-04-09', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2386, 22, 18, '2026-04-10', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2387, 22, 18, '2026-04-11', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2388, 22, 18, '2026-04-12', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2389, 22, 18, '2026-04-13', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2390, 22, 18, '2026-04-14', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2391, 22, 18, '2026-04-15', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2392, 22, 18, '2026-04-16', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2393, 22, 18, '2026-04-17', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2394, 22, 18, '2026-04-18', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2395, 22, 18, '2026-04-19', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2396, 22, 18, '2026-04-20', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2397, 22, 18, '2026-04-21', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2398, 22, 18, '2026-04-22', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2399, 22, 18, '2026-04-23', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2400, 22, 18, '2026-04-24', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2401, 22, 18, '2026-04-25', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2402, 22, 18, '2026-04-26', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2403, 22, 18, '2026-04-27', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2404, 22, 18, '2026-04-28', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2405, 22, 18, '2026-04-29', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2406, 22, 18, '2026-04-30', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2407, 22, 18, '2026-05-01', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2408, 22, 18, '2026-05-02', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2409, 22, 18, '2026-05-03', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2410, 22, 18, '2026-05-04', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2411, 22, 18, '2026-05-05', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2412, 22, 18, '2026-05-06', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2413, 22, 18, '2026-05-07', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2414, 22, 18, '2026-05-08', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2415, 22, 18, '2026-05-09', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2416, 22, 18, '2026-05-10', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2417, 22, 18, '2026-05-11', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2418, 22, 18, '2026-05-12', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2419, 22, 18, '2026-05-13', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2420, 22, 18, '2026-05-14', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2421, 22, 18, '2026-05-15', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2422, 22, 18, '2026-05-16', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2423, 22, 18, '2026-05-17', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2424, 22, 18, '2026-05-18', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2425, 22, 18, '2026-05-19', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2426, 22, 18, '2026-05-20', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2427, 22, 18, '2026-05-21', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2428, 22, 18, '2026-05-22', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2429, 22, 18, '2026-05-23', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2430, 22, 18, '2026-05-24', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2431, 22, 18, '2026-05-25', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2432, 22, 18, '2026-05-26', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2433, 22, 18, '2026-05-27', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2434, 22, 18, '2026-05-28', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2435, 22, 18, '2026-05-29', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2436, 22, 18, '2026-05-30', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2437, 22, 18, '2026-05-31', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2438, 22, 18, '2026-06-01', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2439, 22, 18, '2026-06-02', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2440, 22, 18, '2026-06-03', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2441, 22, 18, '2026-06-04', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2442, 22, 18, '2026-06-05', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2443, 22, 18, '2026-06-06', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2444, 22, 18, '2026-06-07', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2445, 22, 18, '2026-06-08', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2446, 22, 18, '2026-06-09', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2447, 22, 18, '2026-06-10', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2448, 22, 18, '2026-06-11', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2449, 22, 18, '2026-06-12', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2450, 22, 18, '2026-06-13', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2451, 22, 18, '2026-06-14', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2452, 22, 18, '2026-06-15', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2453, 22, 18, '2026-06-16', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2454, 22, 18, '2026-06-17', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2455, 22, 18, '2026-06-18', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2456, 22, 18, '2026-06-19', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2457, 22, 18, '2026-06-20', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2458, 22, 18, '2026-06-21', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2459, 22, 18, '2026-06-22', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2460, 22, 18, '2026-06-23', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2461, 22, 18, '2026-06-24', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2462, 22, 18, '2026-06-25', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2463, 22, 18, '2026-06-26', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2464, 22, 18, '2026-06-27', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2465, 22, 18, '2026-06-28', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2466, 22, 18, '2026-06-29', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2467, 22, 18, '2026-06-30', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2468, 22, 18, '2026-07-01', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2469, 22, 18, '2026-07-02', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2470, 22, 18, '2026-07-03', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2471, 22, 18, '2026-07-04', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2472, 22, 18, '2026-07-05', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2473, 22, 18, '2026-07-06', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2474, 22, 18, '2026-07-07', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2475, 22, 18, '2026-07-08', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2476, 22, 18, '2026-07-09', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2477, 22, 18, '2026-07-10', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2478, 22, 18, '2026-07-11', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2479, 22, 18, '2026-07-12', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2480, 22, 18, '2026-07-13', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2481, 22, 18, '2026-07-14', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2482, 22, 18, '2026-07-15', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2483, 22, 18, '2026-07-16', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2484, 22, 18, '2026-07-17', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2485, 22, 18, '2026-07-18', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2486, 22, 18, '2026-07-19', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2487, 22, 18, '2026-07-20', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2488, 22, 18, '2026-07-21', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2489, 22, 18, '2026-07-22', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2490, 22, 18, '2026-07-23', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2491, 22, 18, '2026-07-24', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2492, 22, 18, '2026-07-25', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2493, 22, 18, '2026-07-26', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2494, 22, 18, '2026-07-27', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2495, 22, 18, '2026-07-28', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2496, 22, 18, '2026-07-29', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2497, 22, 18, '2026-07-30', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2498, 22, 18, '2026-07-31', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2499, 22, 18, '2026-08-01', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2500, 22, 18, '2026-08-02', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2501, 22, 18, '2026-08-03', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2502, 22, 18, '2026-08-04', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2503, 22, 18, '2026-08-05', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2504, 22, 18, '2026-08-06', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2505, 22, 18, '2026-08-07', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2506, 22, 18, '2026-08-08', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2507, 22, 18, '2026-08-09', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2508, 22, 18, '2026-08-10', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2509, 22, 18, '2026-08-11', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2510, 22, 18, '2026-08-12', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2511, 22, 18, '2026-08-13', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2512, 22, 18, '2026-08-14', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2513, 22, 18, '2026-08-15', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2514, 22, 18, '2026-08-16', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2515, 22, 18, '2026-08-17', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2516, 22, 18, '2026-08-18', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2517, 22, 18, '2026-08-19', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2518, 22, 18, '2026-08-20', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2519, 22, 18, '2026-08-21', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');
INSERT INTO `room_inventory` VALUES (2520, 22, 18, '2026-08-22', 3, 3, '2026-02-25 01:24:40', '2026-02-25 01:24:40');

-- ----------------------------
-- Table structure for rooms
-- ----------------------------
DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '房间ID',
  `hotel_id` int NOT NULL COMMENT '所属酒店ID',
  `room_type_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '房型编号（如 RT001）',
  `room_numbers` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '房间号列表（JSON数组）',
  `room_type` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '房型',
  `room_type_en` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '英文房型',
  `bed_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '大床' COMMENT '床型：大床/双床/三床/榻榻米',
  `area` decimal(6, 2) NULL DEFAULT NULL COMMENT '面积(㎡)',
  `floor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '楼层',
  `max_occupancy` int NOT NULL DEFAULT 2 COMMENT '最多入住人数',
  `base_price` decimal(10, 2) NOT NULL COMMENT '基础价格(元/晚)',
  `total_rooms` int NOT NULL COMMENT '此类型房间总数',
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
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '房间表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of rooms
-- ----------------------------
INSERT INTO `rooms` VALUES (20, 17, 'R1122', '[\"111\",\"102\",\"103\"]', '双床房', '233232', '大床', 23.00, '10-15', 2, 2323.00, 3, '[\"空调\",\"电视\"]', '威威', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1771950655722-8gyo2e.png\"]', '2026-02-25 00:30:57', '2026-02-25 00:30:57', 0);
INSERT INTO `rooms` VALUES (21, 18, 'R1121', '[\"123\",\"134\",\"109\"]', '豪华大床房', '233232', '大床', 34.00, '10-15', 2, 234.00, 3, '[\"WiFi\",\"空调\",\"电视\",\"独立卫浴\",\"吹风机\"]', '大幅度反对法', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1771953371715-fd0czx.png\"]', '2026-02-25 01:16:13', '2026-02-25 01:38:45', 0);
INSERT INTO `rooms` VALUES (22, 18, 'R1111', '[\"101\",\"102\",\"103\"]', '双床房', '233232', '双床', 34.00, '10-15', 2, 434.00, 3, '[\"空调\",\"电视\",\"吹风机\",\"热水壶\"]', '34343', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1771953878632-0gh6l0.png\"]', '2026-02-25 01:24:40', '2026-02-25 01:24:40', 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (11, 'USER638581651', 'jiuwei', '2625659302@qq.com', '18281848376', '$2b$10$8iUmy82yOzjH.WpsB6gNQO7KDL/PBNBgR1Nv8M8NMhBFyyKbrIpb6', 2, NULL, '2026-02-23 15:27:18', '2026-02-25 15:43:08', '2026-02-25 15:43:08', 1, 0);
INSERT INTO `users` VALUES (12, 'USER824794907', 'Tc0522', '1527664608@qq.com', '18005552928', '$2b$10$TpdircK3fN6tlm0r/vgHnuEAMqImUUgHiXMBHpW4MBsHtVLcms18y', 2, 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/avatars/1771832907796-tkd6o8.png', '2026-02-23 15:47:05', '2026-02-25 15:42:50', '2026-02-25 15:42:50', 1, 0);
INSERT INTO `users` VALUES (13, 'USER423997982', 'admin', '123456@qq.com', '18005552929', '$2b$10$SYOFYifUFRBtpCqQwiB51.HD8YkpPm5e/DRR3y6K1KPL1b4otStuG', 1, 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/avatars/1771923067417-v8xybx.png', '2026-02-23 16:13:44', '2026-02-25 00:19:19', '2026-02-25 00:19:19', 1, 0);
INSERT INTO `users` VALUES (14, 'MOB163894120', 'Cj', '', '18383919236', '$2b$10$MxgiEgdjVKxGn1Gwt8.2nuUS8baLmiEYaLvSdcj1.biKmFf2DPQEO', 3, 'https://www.bing.com/th/id/OIP.ossN4kneY1dySVL2gK8YOgHaHa?w=199&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2', '2026-02-23 17:49:24', '2026-02-24 21:22:50', '2026-02-24 21:22:50', 1, 0);

SET FOREIGN_KEY_CHECKS = 1;
