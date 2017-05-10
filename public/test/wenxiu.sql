/*
Navicat MySQL Data Transfer

Source Server         : 127.0.0.1
Source Server Version : 50635
Source Host           : localhost:3306
Source Database       : wenxiu

Target Server Type    : MYSQL
Target Server Version : 50635
File Encoding         : 65001

Date: 2017-02-09 13:46:21
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for ad
-- ----------------------------
DROP TABLE IF EXISTS `ad`;
CREATE TABLE `ad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `url` varchar(255) DEFAULT NULL COMMENT '链接地址',
  `image` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `time` datetime DEFAULT NULL,
  `status` enum('ON','OFF') DEFAULT 'OFF' COMMENT 'ON 上线 OFF 下线',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for log
-- ----------------------------
DROP TABLE IF EXISTS `log`;
CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '登录用户ID',
  `lasttime` datetime DEFAULT NULL COMMENT '最后登录时间',
  `lastip` varchar(255) DEFAULT NULL COMMENT '最后登录IP',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `number` varchar(20) DEFAULT NULL COMMENT '编号',
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `age` varchar(11) DEFAULT NULL COMMENT '年龄',
  `sex` enum('2','1') DEFAULT NULL COMMENT '性别（1，男，2女）',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱',
  `phone` varchar(255) DEFAULT NULL COMMENT '手机号码',
  `qq` varchar(255) DEFAULT NULL COMMENT 'qq号码',
  `date` date DEFAULT NULL COMMENT '出生日期',
  `address` longtext COMMENT '居住地址',
  `photos` longtext COMMENT '照片',
  `introduce` longtext COMMENT '履历',
  `time` datetime DEFAULT NULL COMMENT '注册时间',
  `type` enum('REGISTER','STUDENT','STAFF') DEFAULT 'STUDENT' COMMENT '类型（REGISTER， 注册，STUDENT，学生，STAFF，员工）',
  `level` enum('3','2','1') DEFAULT '1' COMMENT '级别（1，初级本站认证，2，医院认证，3，高级认证）',
  `status` enum('ADOPTA','REFUSE','REVIEW') DEFAULT 'REVIEW' COMMENT 'adopt 审核通过  review审核中 refuse 拒绝通过',
  `remarks` longtext COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '姓名',
  `sex` enum('1','2') DEFAULT NULL COMMENT '1男 2 女',
  `qq` varchar(255) DEFAULT NULL COMMENT 'qq号码',
  `email` varchar(255) DEFAULT NULL COMMENT '邮箱号码',
  `phone` varchar(255) DEFAULT NULL COMMENT '电话号码',
  `content` longtext COMMENT '留言内容',
  `ip` varchar(255) DEFAULT NULL COMMENT 'ip地址',
  `time` datetime DEFAULT NULL COMMENT '留言时间',
  `status` enum('ON','OFF') DEFAULT 'OFF' COMMENT 'ON已查看 OFF未查看',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for page
-- ----------------------------
DROP TABLE IF EXISTS `page`;
CREATE TABLE `page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '别名 英文',
  `cname` varchar(255) DEFAULT NULL COMMENT '中文名字',
  `content` longtext COMMENT '文章正文',
  `status` enum('ON','OFF') DEFAULT 'OFF' COMMENT 'ON 上线 OFF 下线',
  `time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `NAME` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for pictures
-- ----------------------------
DROP TABLE IF EXISTS `pictures`;
CREATE TABLE `pictures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `URL` (`url`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for post
-- ----------------------------
DROP TABLE IF EXISTS `post`;
CREATE TABLE `post` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `title` varchar(255) DEFAULT NULL COMMENT '标题',
  `content` longtext COMMENT '内容',
  `time` datetime DEFAULT NULL COMMENT '发表时间',
  `author` varchar(255) DEFAULT NULL COMMENT '作者',
  `source` varchar(255) DEFAULT NULL COMMENT '来源',
  `times` int(11) DEFAULT NULL COMMENT '阅读次数',
  `status` enum('OFF','ON') DEFAULT 'ON' COMMENT 'ON 上线  OFF 下线',
  `typeid` varchar(255) DEFAULT '1' COMMENT '所属分类ID',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for types
-- ----------------------------
DROP TABLE IF EXISTS `types`;
CREATE TABLE `types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '类型名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_NAME` (`name`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `level` enum('3','2','1') NOT NULL DEFAULT '3' COMMENT '1 管理员 2 操作员 3 查看员',
  `fromuser` varchar(255) DEFAULT NULL COMMENT '谁添加的',
  `status` enum('ON','OFF') DEFAULT 'ON' COMMENT 'ON 正常 OFF禁用',
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `NAME` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

INSERT INTO users (name, password, level, fromuser, time) VALUES('superwenxiu', '25f9e794323b453885f5181f1b624d0b', '1', 'system', '2017-01-01 00:00:00');

