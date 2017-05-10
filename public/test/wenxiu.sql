-- MySQL dump 10.13  Distrib 5.7.17, for macos10.12 (x86_64)
--
-- Host: localhost    Database: wenxiu
-- ------------------------------------------------------
-- Server version	5.7.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ad`
--

DROP TABLE IF EXISTS `ad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ad` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '名称',
  `url` varchar(255) DEFAULT NULL COMMENT '链接地址',
  `image` varchar(255) DEFAULT NULL COMMENT '图片地址',
  `time` datetime DEFAULT NULL,
  `status` enum('ON','OFF') DEFAULT 'OFF' COMMENT 'ON 上线 OFF 下线',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ad`
--

LOCK TABLES `ad` WRITE;
/*!40000 ALTER TABLE `ad` DISABLE KEYS */;
INSERT INTO `ad` VALUES (1,'123','123123','FhfqXi7o-OmpkjlPvOoF17ckkcQ8','2017-05-10 20:27:11','ON'),(2,'123','123','FhfqXi7o-OmpkjlPvOoF17ckkcQ8','2017-05-10 20:47:10','OFF'),(4,'123','12312','FlGCSyQDiuPl1CYDiIdXWm6aTLbD','2017-05-10 20:50:10','OFF'),(5,'sadf','sadf','FhfqXi7o-OmpkjlPvOoF17ckkcQ8','2017-05-10 21:25:11','OFF'),(6,'123','12312','FlGCSyQDiuPl1CYDiIdXWm6aTLbD','2017-05-10 21:25:00','OFF'),(7,'asdf','sadf','FlGCSyQDiuPl1CYDiIdXWm6aTLbD','2017-05-10 21:29:58','OFF');
/*!40000 ALTER TABLE `ad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uid` int(11) NOT NULL COMMENT '登录用户ID',
  `lasttime` datetime DEFAULT NULL COMMENT '最后登录时间',
  `lastip` varchar(255) DEFAULT NULL COMMENT '最后登录IP',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES (1,1,'2017-05-10 20:12:42','::1'),(2,2,'2017-05-10 20:17:34','::1'),(3,1,'2017-05-10 20:18:09','::1'),(4,1,'2017-05-10 20:22:43','::1'),(5,1,'2017-05-10 21:41:48','::1'),(6,1,'2017-05-10 22:00:19','::1');
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `level` enum('3','2','1') DEFAULT '1' COMMENT '级别（1，初级本站认证，2，中级医院认证，3，高级认证）',
  `status` enum('ADOPTA','REFUSE','REVIEW') DEFAULT 'REVIEW' COMMENT 'adopt 审核通过  review审核中 refuse 拒绝通过',
  `remarks` longtext COMMENT '备注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'WX1705100808190850','123','11','1','1231@qq.com','123','123','2017-05-25','asdad','FlGCSyQDiuPl1CYDiIdXWm6aTLbD','123','2017-05-10 22:27:00','STUDENT','1','ADOPTA',NULL),(2,'WX1705100809830659','123123','181','2','123123@qq.com','123','123','2017-05-12','123123','FlGCSyQDiuPl1CYDiIdXWm6aTLbD','123','2017-05-10 22:32:31','STUDENT','1','ADOPTA',NULL);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `message`
--

LOCK TABLES `message` WRITE;
/*!40000 ALTER TABLE `message` DISABLE KEYS */;
/*!40000 ALTER TABLE `message` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page`
--

DROP TABLE IF EXISTS `page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `page` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '别名 英文',
  `cname` varchar(255) DEFAULT NULL COMMENT '中文名字',
  `content` longtext COMMENT '文章正文',
  `status` enum('ON','OFF') DEFAULT 'OFF' COMMENT 'ON 上线 OFF 下线',
  `time` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `NAME` (`name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page`
--

LOCK TABLES `page` WRITE;
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
INSERT INTO `page` VALUES (1,'about','关于我们','<p><img src=\"http://ojnlldqnx.bkt.clouddn.com/FkDC5d0EF7fC9v9cW-nteH_hF_Lg\"/></p>','ON','2017-05-10 20:15:45');
/*!40000 ALTER TABLE `page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pictures`
--

DROP TABLE IF EXISTS `pictures`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `pictures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(255) DEFAULT NULL,
  `time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `URL` (`url`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pictures`
--

LOCK TABLES `pictures` WRITE;
/*!40000 ALTER TABLE `pictures` DISABLE KEYS */;
INSERT INTO `pictures` VALUES (1,'FkDC5d0EF7fC9v9cW-nteH_hF_Lg','2017-05-10 20:15:24'),(2,'FhfqXi7o-OmpkjlPvOoF17ckkcQ8','2017-05-10 20:26:13'),(13,'FlGCSyQDiuPl1CYDiIdXWm6aTLbD','2017-05-10 20:49:00');
/*!40000 ALTER TABLE `pictures` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post`
--

DROP TABLE IF EXISTS `post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
  `cover` varchar(100) DEFAULT NULL COMMENT '封面图',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post`
--

LOCK TABLES `post` WRITE;
/*!40000 ALTER TABLE `post` DISABLE KEYS */;
INSERT INTO `post` VALUES (1,'123123','<p>1123123</p>','2017-05-10 22:05:29','superwenxiu','',NULL,'ON','1,','FhfqXi7o-OmpkjlPvOoF17ckkcQ8'),(2,'123123','<p>123123</p>','2017-05-10 21:46:54','superwenxiu','123',NULL,'ON','','');
/*!40000 ALTER TABLE `post` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `types`
--

DROP TABLE IF EXISTS `types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL COMMENT '类型名称',
  PRIMARY KEY (`id`),
  UNIQUE KEY `INDEX_NAME` (`name`) USING HASH
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `types`
--

LOCK TABLES `types` WRITE;
/*!40000 ALTER TABLE `types` DISABLE KEYS */;
INSERT INTO `types` VALUES (1,'企业新闻');
/*!40000 ALTER TABLE `types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'superwenxiu','25f9e794323b453885f5181f1b624d0b','1','system','ON','2017-01-01 00:00:00'),(2,'admin','21232f297a57a5a743894a0e4a801fc3','2','superwenxiu','ON','2017-05-10 20:17:18');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-05-10 22:37:30
