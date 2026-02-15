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

 Date: 15/02/2026 20:00:00
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
  `check_in_time` datetime NOT NULL COMMENT '入住时间',
  `check_out_time` datetime NOT NULL COMMENT '退房时间',
  `cover_image` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '酒店首页图片URL',
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL COMMENT '酒店图片列表（JSON数组）',
  `status` tinyint NULL DEFAULT 1 COMMENT '状态：1-营业中，0-已下架，2-待审批，3-审批拒绝',
  `rejection_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '拒绝原因（仅当status=3时有值）',
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
INSERT INTO `hotels` VALUES (4, 0, '上海外滩华尔道夫酒店', 'Waldorf Astoria Shanghai on the Bund', '华尔道夫', 5, 260, '上海', '上海市黄浦区中山东一路2号', '021-63229988', '张经理', '13800138000', '位于外滩黄浦江畔的奢华酒店，拥有绝佳江景和历史建筑。酒店提供米其林星级餐厅、豪华水疗中心和顶层酒吧。', '免费WiFi,健身房,游泳池,水疗中心,商务中心,餐厅,酒吧,停车场,礼宾服务', '2026-02-10 14:00:00', '2026-02-12 12:00:00', 'https://example.com/images/waldorf-shanghai-cover.jpg', '[\"https://example.com/images/waldorf-1.jpg\",\"https://example.com/images/waldorf-2.jpg\",\"https://example.com/images/waldorf-3.jpg\"]', 2, '2026-02-09 20:50:00', '2026-02-09 20:50:00', 0);
INSERT INTO `hotels` VALUES (5, 0, '好利来酒店', 'haolilai hotel', '好利来连锁', 3, 45, '河北省秦皇岛市北戴河区', '江南水岸', '05551234567', '唐经理', '18005552928', '请问请问', '停车场,游泳池,健身房', '2000-01-01 14:00:00', '2000-01-01 12:00:00', 'https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1770713883279-k0al35.png', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/hotels/1770713889494-8kepb1.png\"]', 2, '2026-02-10 16:58:10', '2026-02-13 15:47:14', 0);

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
  `status` int NOT NULL DEFAULT 1 COMMENT '状态：1空闲，2-已预订，3-已入住',
  `booked_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '预订者（用户ID）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除：0代表未删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_hotel_id`(`hotel_id` ASC) USING BTREE,
  INDEX `idx_room_type`(`room_type` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_base_price`(`base_price` ASC) USING BTREE,
  CONSTRAINT `fk_rooms_hotel_id` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '房间表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of rooms
-- ----------------------------
INSERT INTO `rooms` VALUES (3, 4, '2808', '行政豪华大床房', 'Executive Deluxe King Room', '大床', 45.50, '28层', 2, 888.00, 15, 15, '[]', '位于酒店高层的行政豪华大床房，配备落地窗，可俯瞰城市全景。房间宽敞明亮，配有独立办公区域和舒适的休息空间，是商务出行的理想选择。', '\"[\\\"https://example.com/images/room1.jpg\\\",\\\"https://example.com/images/room2.jpg\\\",\\\"https://example.com/images/room3.jpg\\\"]\"', 1, '1', '2026-02-10 10:23:08', '2026-02-11 19:42:00', 1);
INSERT INTO `rooms` VALUES (4, 4, '3001', '总统套房', 'Presidential Suite', '特大床', 120.00, '30层', 4, 3888.00, 15, 12, '[\"WiFi\",\"空调\",\"电视\",\"独立卫浴\",\"吹风机\",\"热水壶\",\"冰箱\",\"保险箱\",\"浴缸\",\"阳台\",\"书桌\",\"沙发\"]', '位于酒店高层的行政豪华大床房，配备落地窗，可俯瞰城市全景。房间宽敞明亮，配有独立办公区域和舒适的休息空间，是商务出行的理想选择。', '[\"https://example.com/images/room1.jpg\",\"https://example.com/images/room2.jpg\",\"https://example.com/images/room3.jpg\"]', 1, '1', '2026-02-10 10:41:44', '2026-02-11 18:18:52', 1);
INSERT INTO `rooms` VALUES (5, 4, '101', '豪华大床房', 'trtrt', '大床', 23.00, '10-15', 2, 123.00, 23, 23, '[\"空调\",\"吹风机\",\"独立卫浴\",\"电视\"]', '232323', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1770796265465-9af5cs.png\"]', 1, '0', '2026-02-11 15:51:06', '2026-02-11 19:23:27', 0);
INSERT INTO `rooms` VALUES (6, 4, '102', '双床房', 'sdsdsd', '双床', 34.00, '10-12', 2, 234.00, 23, 12, '[\"电视\",\"WiFi\",\"热水壶\",\"冰箱\"]', '二二二', '[\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1770810188347-7ss4me.png\"]', 1, '0', '2026-02-11 19:43:08', '2026-02-11 19:43:08', 0);
INSERT INTO `rooms` VALUES (7, 5, '102', '双床房', '233232', '双床', 23.00, '10-15', 2, 2323.00, 23, 9, '[]', '232323', '\"[\\\"https://hotel-xiecheng.oss-cn-beijing.aliyuncs.com/rooms/1770972516076-lkpe67.png\\\"]\"', 1, '0', '2026-02-13 16:48:36', '2026-02-13 16:48:59', 0);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '用户信息表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (3, 'USER982533880', '张三丰', 'zhangsan_new@hotel.com', '13900139001', '$2b$10$1UhoHBBGHp6j/1eZREXtSe2SvQ8ZD8n02fFnCVPIvpTj7yTXQ7aAe', 2, 'https://example.com/new-avatar.jpg', '2026-02-14 21:49:44', '2026-02-14 22:23:55', '2026-02-15 19:56:08', 1, 0);

SET FOREIGN_KEY_CHECKS = 1;
