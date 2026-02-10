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

 Date: 10/02/2026 10:16:53
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
  `booked_by` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '预订者（姓名或用户ID）',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `is_deleted` int NULL DEFAULT 0 COMMENT '是否删除：0代表未删除，1代表已删除',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_hotel_id`(`hotel_id` ASC) USING BTREE,
  INDEX `idx_room_type`(`room_type` ASC) USING BTREE,
  INDEX `idx_status`(`status` ASC) USING BTREE,
  INDEX `idx_base_price`(`base_price` ASC) USING BTREE,
  CONSTRAINT `fk_rooms_hotel_id` FOREIGN KEY (`hotel_id`) REFERENCES `hotels` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = '房间表' ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of rooms
-- ----------------------------
INSERT INTO `rooms` VALUES (2, 4, '2808', '行政豪华大床房', 'Executive Deluxe King Room', '大床', 45.50, '28层', 2, 888.00, 15, 12, '[\"WiFi\",\"空调\",\"电视\",\"独立卫浴\",\"吹风机\",\"热水壶\",\"冰箱\",\"保险箱\",\"浴缸\",\"阳台\",\"书桌\",\"沙发\"]', '位于酒店高层的行政豪华大床房，配备落地窗，可俯瞰城市全景。房间宽敞明亮，配有独立办公区域和舒适的休息空间，是商务出行的理想选择。', '[\"https://example.com/images/room1.jpg\",\"https://example.com/images/room2.jpg\",\"https://example.com/images/room3.jpg\"]', 0, '2026-02-09 21:56:33', '2026-02-09 21:56:33', 0);

SET FOREIGN_KEY_CHECKS = 1;
