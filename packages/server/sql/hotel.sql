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

 Date: 24/02/2026 23:32:56
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
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '酒店表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of hotels
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '订单表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of orders
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 1981 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '房间日历库存表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of room_inventory
-- ----------------------------

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
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '房间表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of rooms
-- ----------------------------

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
INSERT INTO `users` VALUES (11, 'USER638581651', 'jiuwei', '2625659302@qq.com', '18281848376', '$2b$10$8iUmy82yOzjH.WpsB6gNQO7KDL/PBNBgR1Nv8M8NMhBFyyKbrIpb6', 2, NULL, '2026-02-23 15:27:18', '2026-02-24 20:46:10', '2026-02-24 20:46:10', 1, 0);
INSERT INTO `users` VALUES (12, 'USER824794907', 'Tc0522', '1527664608@qq.com', '18005552928', '$2b$10$TpdircK3fN6tlm0r/vgHnuEAMqImUUgHiXMBHpW4MBsHtVLcms18y', 2, 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/avatars/1771832907796-tkd6o8.png', '2026-02-23 15:47:05', '2026-02-24 16:18:16', '2026-02-24 16:18:16', 1, 0);
INSERT INTO `users` VALUES (13, 'USER423997982', 'admin', '123456@qq.com', '18005552929', '$2b$10$SYOFYifUFRBtpCqQwiB51.HD8YkpPm5e/DRR3y6K1KPL1b4otStuG', 1, 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/avatars/1771923067417-v8xybx.png', '2026-02-23 16:13:44', '2026-02-24 21:27:49', '2026-02-24 21:27:49', 1, 0);
INSERT INTO `users` VALUES (14, 'MOB163894120', 'Cj', '', '18383919236', '$2b$10$MxgiEgdjVKxGn1Gwt8.2nuUS8baLmiEYaLvSdcj1.biKmFf2DPQEO', 3, 'https://www.bing.com/th/id/OIP.ossN4kneY1dySVL2gK8YOgHaHa?w=199&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2', '2026-02-23 17:49:24', '2026-02-24 21:22:50', '2026-02-24 21:22:50', 1, 0);

SET FOREIGN_KEY_CHECKS = 1;
