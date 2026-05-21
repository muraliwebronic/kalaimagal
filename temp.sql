SET FOREIGN_KEY_CHECKS=0;  
-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: etamil
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) unsigned NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('95d5c908-bd92-477d-83a7-7a553aa397a6','bb344412390a1c563e26a0c6c7e87ea5f5e76ea87567c5d8f1119da32bb66fd8','2026-05-20 07:19:20.556','20260520071918_init',NULL,NULL,'2026-05-20 07:19:18.163',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activitylog`
--

DROP TABLE IF EXISTS `activitylog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `activitylog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `contentId` int(11) DEFAULT NULL,
  `eventType` enum('PAGE_VIEW','CONTENT_VIEW','READ_START','READ_COMPLETE','DOWNLOAD','SHARE','SEARCH','CTA_CLICK') NOT NULL,
  `metadata` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`metadata`)),
  `sessionId` varchar(100) DEFAULT NULL,
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` varchar(500) DEFAULT NULL,
  `referrer` varchar(500) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `ActivityLog_createdAt_idx` (`createdAt`),
  KEY `ActivityLog_eventType_idx` (`eventType`),
  KEY `ActivityLog_userId_idx` (`userId`),
  KEY `ActivityLog_contentId_idx` (`contentId`),
  CONSTRAINT `ActivityLog_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `ActivityLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activitylog`
--

LOCK TABLES `activitylog` WRITE;
/*!40000 ALTER TABLE `activitylog` DISABLE KEYS */;
/*!40000 ALTER TABLE `activitylog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `apitoken`
--

DROP TABLE IF EXISTS `apitoken`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `apitoken` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `tokenHash` varchar(255) NOT NULL,
  `scopes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`scopes`)),
  `lastUsedAt` datetime(3) DEFAULT NULL,
  `expiresAt` datetime(3) DEFAULT NULL,
  `revokedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ApiToken_tokenHash_key` (`tokenHash`),
  KEY `ApiToken_userId_idx` (`userId`),
  CONSTRAINT `ApiToken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `apitoken`
--

LOCK TABLES `apitoken` WRITE;
/*!40000 ALTER TABLE `apitoken` DISABLE KEYS */;
/*!40000 ALTER TABLE `apitoken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auditlog`
--

DROP TABLE IF EXISTS `auditlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `auditlog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `action` enum('CREATE','UPDATE','DELETE','LOGIN','LOGOUT','PASSWORD_RESET','ROLE_CHANGE','SUBSCRIPTION_OVERRIDE','CONTENT_PUBLISH','CONTENT_UNPUBLISH','PAYMENT_REFUND','USER_BAN','USER_UNBAN') NOT NULL,
  `entityType` varchar(100) NOT NULL,
  `entityId` varchar(100) DEFAULT NULL,
  `changes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`changes`)),
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` varchar(500) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `AuditLog_userId_idx` (`userId`),
  KEY `AuditLog_entityType_entityId_idx` (`entityType`,`entityId`),
  KEY `AuditLog_action_idx` (`action`),
  KEY `AuditLog_createdAt_idx` (`createdAt`),
  CONSTRAINT `AuditLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditlog`
--

LOCK TABLES `auditlog` WRITE;
/*!40000 ALTER TABLE `auditlog` DISABLE KEYS */;
INSERT INTO `auditlog` VALUES (8,4,'CREATE','User','4',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 08:14:10.660'),(9,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 08:19:14.219'),(10,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 10:41:06.697'),(11,1,'UPDATE','Setting',NULL,'{\"updatedKeys\":[\"site.tagline_tamil\"]}','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 10:41:20.208'),(12,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 10:41:41.811'),(13,1,'UPDATE','Setting',NULL,'{\"updatedKeys\":[\"site.tagline_tamil\"]}','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 10:41:41.881'),(14,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 10:45:57.682'),(15,NULL,'CREATE','User','6',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 10:52:23.756'),(16,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 10:56:56.513'),(17,1,'CREATE','Content','4','{\"type\":\"PDF\",\"pageCount\":138,\"fileSizeBytes\":954404}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:00:50.336'),(18,1,'UPDATE','Content','4','{\"titleTamil\":\"Tamil notes\",\"titleEnglish\":\"tamil notes\",\"slug\":\"tamil-notes-f431ce\",\"description\":\"This is the one of the book that helps to know tamil\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"readingTimeMinutes\":100,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:01:49.516'),(19,1,'CONTENT_PUBLISH','Content','4','{\"titleTamil\":\"Tamil notes\",\"titleEnglish\":\"tamil notes\",\"slug\":\"tamil-notes-f431ce\",\"description\":\"This is the one of the book that helps to know tamil\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"status\":\"PUBLISHED\",\"readingTimeMinutes\":100,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:01:51.331'),(20,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 11:38:36.723'),(21,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 11:39:06.778'),(23,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:47:33.243'),(24,1,'DELETE','Content','2',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:49:06.441'),(25,1,'CREATE','Content','5','{\"type\":\"PDF\",\"pageCount\":88,\"fileSizeBytes\":3751069}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:50:31.882'),(26,1,'UPDATE','Content','5','{\"titleTamil\":\"பொன்னியின் செல்வன் — முதல் பாகம்\",\"titleEnglish\":\"ponniyin-selvan-vol-1\",\"slug\":\"ponniyin-selvan-vol-1-a7b500\",\"description\":\"பேரறிஞர் அண்ணா அவர்களின் “பணத்தோட்டம்” எனும் இக்கட்டுரைத் தொகுப்பு, 1946-ஆம் ஆண்டு காலகட்டத்தில், அன்றைய சென்னை மாகாணத்தின் பொருளாதாரச் சூழலை விவரிக்கிறது.\\n\\nவட இந்திய வணிக நிறுவனங்கள் மற்றும் நிதி நிறுவனங்கள், எவ்வாறு தமிழ்நாட்டின் பொருளாதாரத்தை ஆக்கிரமித்தன என்பதைப் புள்ளிவிவரங்களுடன் விளக்குகிறார். வங்கிகள், காப்பீட்டு நிறுவனங்கள், தொழில்துறையெனப் பல துறைகளிலும் வட இந்தியர்களின் ஆதிக்கம் எவ்வாறு இருந்தது என்பதையும், அதனால் தமிழ்நாட்டின் பாரம்பரிய தொழில்கள் எவ்வாறு நலிவடைந்தன என்பதையும் அண்ணா அவர்கள் தெளிவாக எடுத்துரைக்கிறார்.\\n\\nமேலும், காந்திஜியின் கதர் திட்டம் எவ்வாறு தமிழ்நாட்டின் நெசவுத் தொழிலைப் பாதித்தது என்பதையும், பம்பாயின் தொழில் வளர்ச்சியுடன் ஒப்பிடுகையில், சென்னை எவ்வாறு பின்தங்கியிருந்தது என்பதையும் அண்ணா விமர்சிக்கிறார். திராவிடநாடு தனி அரசாக இருந்தால்தான், இத்தகைய பொருளாதாரச் சுரண்டலைத் தடுக்க முடியும் என்ற கருத்தை வலியுறுத்துகிறார்.\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"readingTimeMinutes\":null,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:50:52.635'),(27,1,'CONTENT_PUBLISH','Content','5','{\"titleTamil\":\"பொன்னியின் செல்வன் — முதல் பாகம்\",\"titleEnglish\":\"ponniyin-selvan-vol-1\",\"slug\":\"ponniyin-selvan-vol-1-a7b500\",\"description\":\"பேரறிஞர் அண்ணா அவர்களின் “பணத்தோட்டம்” எனும் இக்கட்டுரைத் தொகுப்பு, 1946-ஆம் ஆண்டு காலகட்டத்தில், அன்றைய சென்னை மாகாணத்தின் பொருளாதாரச் சூழலை விவரிக்கிறது.\\n\\nவட இந்திய வணிக நிறுவனங்கள் மற்றும் நிதி நிறுவனங்கள், எவ்வாறு தமிழ்நாட்டின் பொருளாதாரத்தை ஆக்கிரமித்தன என்பதைப் புள்ளிவிவரங்களுடன் விளக்குகிறார். வங்கிகள், காப்பீட்டு நிறுவனங்கள், தொழில்துறையெனப் பல துறைகளிலும் வட இந்தியர்களின் ஆதிக்கம் எவ்வாறு இருந்தது என்பதையும், அதனால் தமிழ்நாட்டின் பாரம்பரிய தொழில்கள் எவ்வாறு நலிவடைந்தன என்பதையும் அண்ணா அவர்கள் தெளிவாக எடுத்துரைக்கிறார்.\\n\\nமேலும், காந்திஜியின் கதர் திட்டம் எவ்வாறு தமிழ்நாட்டின் நெசவுத் தொழிலைப் பாதித்தது என்பதையும், பம்பாயின் தொழில் வளர்ச்சியுடன் ஒப்பிடுகையில், சென்னை எவ்வாறு பின்தங்கியிருந்தது என்பதையும் அண்ணா விமர்சிக்கிறார். திராவிடநாடு தனி அரசாக இருந்தால்தான், இத்தகைய பொருளாதாரச் சுரண்டலைத் தடுக்க முடியும் என்ற கருத்தை வலியுறுத்துகிறார்.\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"status\":\"PUBLISHED\",\"readingTimeMinutes\":null,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:50:56.009'),(28,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 12:01:16.805'),(29,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 12:02:16.833'),(30,8,'CREATE','User','8',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:03:51.780'),(31,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:04:37.844'),(32,1,'DELETE','Content','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:06:37.993'),(33,1,'UPDATE','Content','4','{\"titleTamil\":\"Tamil notes\",\"titleEnglish\":\"tamil notes\",\"slug\":\"tamil-notes-f431ce\",\"description\":\"This is the one of the book that helps to know tamil\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":false,\"isFeatured\":false,\"language\":\"TA\",\"readingTimeMinutes\":100,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:07:00.735'),(34,1,'LOGOUT','Session','19',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:22:01.466'),(35,8,'LOGIN','User','8',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:22:16.266'),(36,8,'LOGIN','User','8',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:14:15.091'),(37,8,'LOGIN','User','8',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:44:30.049'),(38,NULL,'CREATE','User','9',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:54:59.882'),(39,NULL,'UPDATE','User','9','{\"emailVerifiedAt\":\"2026-05-20T13:55:14.956Z\"}','::1','node','2026-05-20 13:55:14.959'),(40,NULL,'LOGOUT','Session','23',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:55:25.080'),(41,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:55:50.352'),(42,10,'CREATE','User','10',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:33:23.431'),(43,10,'UPDATE','User','10','{\"emailVerifiedAt\":\"2026-05-20T14:33:32.906Z\"}','::1','node','2026-05-20 14:33:32.908'),(44,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:36:17.725'),(45,1,'CREATE','Content','6','{\"type\":\"PDF\",\"pageCount\":88,\"fileSizeBytes\":3751069}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:38:00.812'),(46,1,'CREATE','SubscriptionPlan','2','{\"slug\":\"yearly\",\"nameTamil\":\"new\",\"nameEnglish\":\"new plan\",\"descriptionTamil\":\"\",\"descriptionEnglish\":\"low price\",\"priceInr\":\"999\",\"durationDays\":365,\"isActive\":true,\"isFeatured\":false}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:41:45.241'),(47,1,'UPDATE','Content','6','{\"titleTamil\":\"new book\",\"titleEnglish\":\"new book content\",\"slug\":\"new-book-content-353ce3\",\"description\":\"new content\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"readingTimeMinutes\":80,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:43:31.455'),(48,1,'CONTENT_PUBLISH','Content','6','{\"titleTamil\":\"new book\",\"titleEnglish\":\"new book content\",\"slug\":\"new-book-content-353ce3\",\"description\":\"new content\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"status\":\"PUBLISHED\",\"readingTimeMinutes\":80,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:43:33.541');
/*!40000 ALTER TABLE `auditlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `author`
--

DROP TABLE IF EXISTS `author`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `author` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `nameTamil` varchar(255) NOT NULL,
  `nameEnglish` varchar(255) DEFAULT NULL,
  `bioTamil` text DEFAULT NULL,
  `bioEnglish` text DEFAULT NULL,
  `photoUrl` varchar(500) DEFAULT NULL,
  `bornYear` int(11) DEFAULT NULL,
  `diedYear` int(11) DEFAULT NULL,
  `awards` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`awards`)),
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Author_slug_key` (`slug`),
  KEY `Author_isFeatured_idx` (`isFeatured`),
  KEY `Author_sortOrder_idx` (`sortOrder`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `author`
--

LOCK TABLES `author` WRITE;
/*!40000 ALTER TABLE `author` DISABLE KEYS */;
INSERT INTO `author` VALUES (1,'bharathiyar','சுப்பிரமணிய பாரதியார்','Subramania Bharati','தமிழ்நாட்டின் தேசிய கவிஞர். விடுதலை, பெண்கள் உரிமை, சாதி எதிர்ப்பு என பல சமூக சீர்திருத்தக் கருத்துகளை தனது படைப்புகளில் வெளிப்படுத்தினார்.','National Poet of Tamil Nadu. His works championed freedom, women\'s rights, and anti-caste reforms.',NULL,1882,1921,NULL,1,0,'2026-05-20 07:20:19.410','2026-05-20 07:20:19.410'),(2,'kalki','கல்கி கிருஷ்ணமூர்த்தி','Kalki Krishnamurthy','தமிழின் தலைசிறந்த புதின எழுத்தாளர். \'பொன்னியின் செல்வன்\', \'சிவகாமியின் சபதம்\' போன்ற வரலாற்று நாவல்களை எழுதினார்.','One of Tamil\'s greatest historical novelists, author of \'Ponniyin Selvan\' and \'Sivagamiyin Sapatham\'.',NULL,1899,1954,NULL,1,1,'2026-05-20 07:20:19.416','2026-05-20 07:20:19.416');
/*!40000 ALTER TABLE `author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bookmark`
--

DROP TABLE IF EXISTS `bookmark`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `bookmark` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `pageNumber` int(11) NOT NULL,
  `note` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Bookmark_userId_idx` (`userId`),
  KEY `Bookmark_contentId_idx` (`contentId`),
  CONSTRAINT `Bookmark_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Bookmark_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bookmark`
--

LOCK TABLES `bookmark` WRITE;
/*!40000 ALTER TABLE `bookmark` DISABLE KEYS */;
/*!40000 ALTER TABLE `bookmark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `nameTamil` varchar(255) NOT NULL,
  `nameEnglish` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `parentId` int(11) DEFAULT NULL,
  `iconUrl` varchar(500) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Category_slug_key` (`slug`),
  KEY `Category_parentId_idx` (`parentId`),
  KEY `Category_isActive_idx` (`isActive`),
  KEY `Category_sortOrder_idx` (`sortOrder`),
  CONSTRAINT `Category_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'ilakkiyam','இலக்கியம்','Literature',NULL,NULL,NULL,0,1,'2026-05-20 07:20:19.371','2026-05-20 07:20:19.371'),(2,'sirukathai','சிறுகதை','Short Stories',NULL,NULL,NULL,1,1,'2026-05-20 07:20:19.375','2026-05-20 07:20:19.375'),(3,'naaval','நாவல்','Novels',NULL,NULL,NULL,2,1,'2026-05-20 07:20:19.381','2026-05-20 07:20:19.381'),(4,'kavithai','கவிதை','Poetry',NULL,NULL,NULL,3,1,'2026-05-20 07:20:19.385','2026-05-20 07:20:19.385'),(5,'kattuirai','கட்டுரை','Essays',NULL,NULL,NULL,4,1,'2026-05-20 07:20:19.389','2026-05-20 07:20:19.389');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `body` text NOT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','SPAM') NOT NULL DEFAULT 'PENDING',
  `likeCount` int(11) NOT NULL DEFAULT 0,
  `reportedCount` int(11) NOT NULL DEFAULT 0,
  `editedAt` datetime(3) DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Comment_contentId_idx` (`contentId`),
  KEY `Comment_parentId_idx` (`parentId`),
  KEY `Comment_status_idx` (`status`),
  KEY `Comment_userId_fkey` (`userId`),
  CONSTRAINT `Comment_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Comment_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `comment` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contactsubmission`
--

DROP TABLE IF EXISTS `contactsubmission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contactsubmission` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('NEW','READ','REPLIED','SPAM') NOT NULL DEFAULT 'NEW',
  `assignedToId` int(11) DEFAULT NULL,
  `internalNotes` text DEFAULT NULL,
  `ipAddress` varchar(45) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `repliedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `ContactSubmission_status_idx` (`status`),
  KEY `ContactSubmission_assignedToId_idx` (`assignedToId`),
  CONSTRAINT `ContactSubmission_assignedToId_fkey` FOREIGN KEY (`assignedToId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contactsubmission`
--

LOCK TABLES `contactsubmission` WRITE;
/*!40000 ALTER TABLE `contactsubmission` DISABLE KEYS */;
/*!40000 ALTER TABLE `contactsubmission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `content`
--

DROP TABLE IF EXISTS `content`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `content` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `type` enum('PDF','BLOG') NOT NULL,
  `titleTamil` varchar(500) NOT NULL,
  `titleEnglish` varchar(500) DEFAULT NULL,
  `subtitle` varchar(500) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `excerpt` text DEFAULT NULL,
  `bodyText` longtext DEFAULT NULL,
  `filePath` varchar(500) DEFAULT NULL,
  `fileSizeBytes` bigint(20) DEFAULT NULL,
  `fileMimeType` varchar(100) DEFAULT NULL,
  `pageCount` int(11) DEFAULT NULL,
  `coverImageUrl` varchar(500) DEFAULT NULL,
  `ogImageUrl` varchar(500) DEFAULT NULL,
  `metaTitle` varchar(255) DEFAULT NULL,
  `metaDescription` varchar(500) DEFAULT NULL,
  `isbn` varchar(50) DEFAULT NULL,
  `publicationYear` int(11) DEFAULT NULL,
  `publisher` varchar(255) DEFAULT NULL,
  `edition` varchar(100) DEFAULT NULL,
  `language` enum('TA','EN','BILINGUAL') NOT NULL DEFAULT 'TA',
  `readingTimeMinutes` int(11) DEFAULT NULL,
  `wordCount` int(11) DEFAULT NULL,
  `viewCount` int(11) NOT NULL DEFAULT 0,
  `uniqueViewCount` int(11) NOT NULL DEFAULT 0,
  `downloadCount` int(11) NOT NULL DEFAULT 0,
  `shareCount` int(11) NOT NULL DEFAULT 0,
  `averageRating` decimal(3,2) DEFAULT NULL,
  `reviewCount` int(11) NOT NULL DEFAULT 0,
  `isPremium` tinyint(1) NOT NULL DEFAULT 0,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `status` enum('DRAFT','SCHEDULED','PUBLISHED','ARCHIVED') NOT NULL DEFAULT 'DRAFT',
  `publishedAt` datetime(3) DEFAULT NULL,
  `scheduledAt` datetime(3) DEFAULT NULL,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `seriesId` int(11) DEFAULT NULL,
  `seriesOrder` int(11) DEFAULT NULL,
  `createdById` int(11) NOT NULL,
  `updatedById` int(11) DEFAULT NULL,
  `deletedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Content_slug_key` (`slug`),
  KEY `Content_slug_idx` (`slug`),
  KEY `Content_status_idx` (`status`),
  KEY `Content_type_idx` (`type`),
  KEY `Content_isPremium_idx` (`isPremium`),
  KEY `Content_publishedAt_idx` (`publishedAt`),
  KEY `Content_isFeatured_idx` (`isFeatured`),
  KEY `Content_deletedAt_idx` (`deletedAt`),
  KEY `Content_status_type_publishedAt_idx` (`status`,`type`,`publishedAt`),
  KEY `Content_seriesId_fkey` (`seriesId`),
  KEY `Content_createdById_fkey` (`createdById`),
  KEY `Content_updatedById_fkey` (`updatedById`),
  CONSTRAINT `Content_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Content_seriesId_fkey` FOREIGN KEY (`seriesId`) REFERENCES `series` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Content_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `content`
--

LOCK TABLES `content` WRITE;
/*!40000 ALTER TABLE `content` DISABLE KEYS */;
INSERT INTO `content` VALUES (1,'bharathi-padalgal-sample','PDF','பாரதியார் பாடல்கள் — மாதிரி','Bharathi Padalgal — Sample',NULL,'பாரதியாரின் தேர்ந்தெடுக்கப்பட்ட தேசபக்திப் பாடல்கள் (பத்து பக்க மாதிரி). Selected patriotic songs of Bharati (10-page sample).',NULL,NULL,'pdfs/cf3077ca-f0f7-48c7-8909-162f52542a99.pdf',NULL,NULL,144,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',NULL,NULL,0,0,0,0,NULL,0,0,1,'ARCHIVED','2026-05-20 07:20:19.427',NULL,0,NULL,NULL,1,NULL,'2026-05-20 12:06:37.969','2026-05-20 07:20:19.451','2026-05-20 12:06:37.974'),(2,'ponniyin-selvan-vol-1','PDF','பொன்னியின் செல்வன் — முதல் பாகம்','Ponniyin Selvan — Volume 1',NULL,'சோழ சாம்ராஜ்யத்தின் வரலாற்று நாவல். The historical epic of the Chola empire.',NULL,NULL,'pdfs/cf3077ca-f0f7-48c7-8909-162f52542a99.pdf',NULL,NULL,144,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',NULL,NULL,0,0,0,0,NULL,0,1,1,'ARCHIVED','2026-05-20 07:20:19.463',NULL,0,NULL,NULL,1,NULL,'2026-05-20 11:49:06.415','2026-05-20 07:20:19.468','2026-05-20 11:49:06.418'),(3,'tamil-ilakkiya-varalaru','BLOG','தமிழ் இலக்கிய வரலாறு — ஒரு பார்வை','A Look at the History of Tamil Literature',NULL,'சங்க காலத்திலிருந்து தற்கால இலக்கியம் வரை. From the Sangam era to modern literature.','தமிழ் இலக்கியத்தின் இரண்டாயிரம் ஆண்டு பயணம், சங்க காலத்திலிருந்து தற்கால இலக்கியம் வரை...','<p>தமிழ் இலக்கியம் இரண்டாயிரம் ஆண்டுகளுக்கும் மேலான தொடர்ச்சியான இலக்கிய மரபைக் கொண்டது. சங்க காலம் முதல் தற்கால இலக்கியம் வரை, ஒவ்வொரு காலகட்டமும் தனித்துவமான பங்களிப்பை வழங்கியுள்ளது.</p><p>This blog post traces the two-millennia journey of Tamil literature, from the Sangam era to contemporary writing.</p>',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'BILINGUAL',8,1200,0,0,0,0,NULL,0,0,0,'PUBLISHED','2026-05-20 07:20:19.474',NULL,0,NULL,NULL,1,NULL,NULL,'2026-05-20 07:20:19.478','2026-05-20 07:20:19.478'),(4,'tamil-notes-f431ce','PDF','Tamil notes','tamil notes',NULL,'This is the one of the book that helps to know tamil',NULL,NULL,'pdfs/f431ce45-27e7-4818-b968-e2b963a21410.pdf',954404,'application/pdf',138,'/api/convert?doc_id=4&page=1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',100,NULL,0,0,0,0,NULL,0,0,0,'PUBLISHED','2026-05-20 11:01:51.306',NULL,0,NULL,NULL,1,1,NULL,'2026-05-20 11:00:49.232','2026-05-20 12:07:00.723'),(5,'ponniyin-selvan-vol-1-a7b500','PDF','பொன்னியின் செல்வன் — முதல் பாகம்','ponniyin-selvan-vol-1',NULL,'பேரறிஞர் அண்ணா அவர்களின் “பணத்தோட்டம்” எனும் இக்கட்டுரைத் தொகுப்பு, 1946-ஆம் ஆண்டு காலகட்டத்தில், அன்றைய சென்னை மாகாணத்தின் பொருளாதாரச் சூழலை விவரிக்கிறது.\n\nவட இந்திய வணிக நிறுவனங்கள் மற்றும் நிதி நிறுவனங்கள், எவ்வாறு தமிழ்நாட்டின் பொருளாதாரத்தை ஆக்கிரமித்தன என்பதைப் புள்ளிவிவரங்களுடன் விளக்குகிறார். வங்கிகள், காப்பீட்டு நிறுவனங்கள், தொழில்துறையெனப் பல துறைகளிலும் வட இந்தியர்களின் ஆதிக்கம் எவ்வாறு இருந்தது என்பதையும், அதனால் தமிழ்நாட்டின் பாரம்பரிய தொழில்கள் எவ்வாறு நலிவடைந்தன என்பதையும் அண்ணா அவர்கள் தெளிவாக எடுத்துரைக்கிறார்.\n\nமேலும், காந்திஜியின் கதர் திட்டம் எவ்வாறு தமிழ்நாட்டின் நெசவுத் தொழிலைப் பாதித்தது என்பதையும், பம்பாயின் தொழில் வளர்ச்சியுடன் ஒப்பிடுகையில், சென்னை எவ்வாறு பின்தங்கியிருந்தது என்பதையும் அண்ணா விமர்சிக்கிறார். திராவிடநாடு தனி அரசாக இருந்தால்தான், இத்தகைய பொருளாதாரச் சுரண்டலைத் தடுக்க முடியும் என்ற கருத்தை வலியுறுத்துகிறார்.',NULL,NULL,'pdfs/a7b500c8-6378-42d7-b143-080ec5368c5c.pdf',3751069,'application/pdf',88,'/api/convert?doc_id=5&page=1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',NULL,NULL,0,0,0,0,NULL,0,1,0,'PUBLISHED','2026-05-20 11:50:55.985',NULL,0,NULL,NULL,1,1,NULL,'2026-05-20 11:50:30.669','2026-05-20 11:50:55.990'),(6,'new-book-content-353ce3','PDF','new book','new book content',NULL,'new content',NULL,NULL,'pdfs/353ce30b-aa5f-42ae-9ff4-5380e05a6ddd.pdf',3751069,'application/pdf',88,'/api/convert?doc_id=6&page=1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',80,NULL,0,0,0,0,NULL,0,1,0,'PUBLISHED','2026-05-20 14:43:33.514',NULL,0,NULL,NULL,1,1,NULL,'2026-05-20 14:37:59.379','2026-05-20 14:43:33.517');
/*!40000 ALTER TABLE `content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contentauthor`
--

DROP TABLE IF EXISTS `contentauthor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contentauthor` (
  `contentId` int(11) NOT NULL,
  `authorId` int(11) NOT NULL,
  `role` enum('AUTHOR','TRANSLATOR','EDITOR','ILLUSTRATOR') NOT NULL DEFAULT 'AUTHOR',
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`contentId`,`authorId`,`role`),
  KEY `ContentAuthor_authorId_idx` (`authorId`),
  CONSTRAINT `ContentAuthor_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `author` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `ContentAuthor_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentauthor`
--

LOCK TABLES `contentauthor` WRITE;
/*!40000 ALTER TABLE `contentauthor` DISABLE KEYS */;
INSERT INTO `contentauthor` VALUES (1,1,'AUTHOR',0),(2,2,'AUTHOR',0);
/*!40000 ALTER TABLE `contentauthor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contentcategory`
--

DROP TABLE IF EXISTS `contentcategory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contentcategory` (
  `contentId` int(11) NOT NULL,
  `categoryId` int(11) NOT NULL,
  PRIMARY KEY (`contentId`,`categoryId`),
  KEY `ContentCategory_categoryId_idx` (`categoryId`),
  CONSTRAINT `ContentCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ContentCategory_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contentcategory`
--

LOCK TABLES `contentcategory` WRITE;
/*!40000 ALTER TABLE `contentcategory` DISABLE KEYS */;
INSERT INTO `contentcategory` VALUES (1,1),(1,4),(2,1),(2,3),(3,5);
/*!40000 ALTER TABLE `contentcategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contenttag`
--

DROP TABLE IF EXISTS `contenttag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `contenttag` (
  `contentId` int(11) NOT NULL,
  `tagId` int(11) NOT NULL,
  PRIMARY KEY (`contentId`,`tagId`),
  KEY `ContentTag_tagId_idx` (`tagId`),
  CONSTRAINT `ContentTag_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ContentTag_tagId_fkey` FOREIGN KEY (`tagId`) REFERENCES `tag` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contenttag`
--

LOCK TABLES `contenttag` WRITE;
/*!40000 ALTER TABLE `contenttag` DISABLE KEYS */;
INSERT INTO `contenttag` VALUES (1,1);
/*!40000 ALTER TABLE `contenttag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon`
--

DROP TABLE IF EXISTS `coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `coupon` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `type` enum('PERCENTAGE','FIXED') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `maxUses` int(11) DEFAULT NULL,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `perUserLimit` int(11) NOT NULL DEFAULT 1,
  `minAmount` decimal(10,2) DEFAULT NULL,
  `validFrom` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `validUntil` datetime(3) DEFAULT NULL,
  `appliesTo` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`appliesTo`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdById` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Coupon_code_key` (`code`),
  KEY `Coupon_code_idx` (`code`),
  KEY `Coupon_isActive_idx` (`isActive`),
  KEY `Coupon_validUntil_idx` (`validUntil`),
  KEY `Coupon_createdById_fkey` (`createdById`),
  CONSTRAINT `Coupon_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon`
--

LOCK TABLES `coupon` WRITE;
/*!40000 ALTER TABLE `coupon` DISABLE KEYS */;
INSERT INTO `coupon` VALUES (1,'WELCOME10','PERCENTAGE',10.00,1000,0,1,NULL,'2026-05-20 07:20:19.482','2026-08-18 07:20:19.482','{\"plan_slugs\":[\"monthly\"]}',1,1,'2026-05-20 07:20:19.486','2026-05-20 07:20:19.486');
/*!40000 ALTER TABLE `coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `couponusage`
--

DROP TABLE IF EXISTS `couponusage`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `couponusage` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `couponId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `paymentId` int(11) NOT NULL,
  `discountApplied` decimal(10,2) NOT NULL,
  `usedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `CouponUsage_couponId_idx` (`couponId`),
  KEY `CouponUsage_userId_idx` (`userId`),
  KEY `CouponUsage_paymentId_fkey` (`paymentId`),
  CONSTRAINT `CouponUsage_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CouponUsage_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `CouponUsage_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `couponusage`
--

LOCK TABLES `couponusage` WRITE;
/*!40000 ALTER TABLE `couponusage` DISABLE KEYS */;
/*!40000 ALTER TABLE `couponusage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emaillog`
--

DROP TABLE IF EXISTS `emaillog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `emaillog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) DEFAULT NULL,
  `toEmail` varchar(255) NOT NULL,
  `emailType` varchar(100) NOT NULL,
  `subject` varchar(500) NOT NULL,
  `templateId` varchar(100) DEFAULT NULL,
  `providerMessageId` varchar(255) DEFAULT NULL,
  `status` enum('QUEUED','SENT','FAILED','BOUNCED') NOT NULL DEFAULT 'QUEUED',
  `errorMessage` text DEFAULT NULL,
  `sentAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `EmailLog_userId_idx` (`userId`),
  KEY `EmailLog_status_idx` (`status`),
  KEY `EmailLog_sentAt_idx` (`sentAt`),
  CONSTRAINT `EmailLog_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emaillog`
--

LOCK TABLES `emaillog` WRITE;
/*!40000 ALTER TABLE `emaillog` DISABLE KEYS */;
INSERT INTO `emaillog` VALUES (4,4,'muralikrishna.webronic@gmail.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'console:4','SENT',NULL,'2026-05-20 08:14:10.648','2026-05-20 08:14:10.643'),(5,NULL,'commentwriter4@gmail.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'console:5','SENT',NULL,'2026-05-20 10:52:23.743','2026-05-20 10:52:23.731'),(7,8,'commentwriter4@gmail.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'<e3ce5669-2554-d12e-3f62-8b64eb5d8119@kalaimagal.com>','SENT',NULL,'2026-05-20 12:03:51.765','2026-05-20 12:03:45.434'),(8,8,'commentwriter4@gmail.com','password-reset','கடவுச்சொல்லை மீட்டமைக்க — Reset your password',NULL,'<dc0b23c4-08a5-18de-f655-87530f107a20@kalaimagal.com>','SENT',NULL,'2026-05-20 13:11:05.867','2026-05-20 13:11:02.119'),(9,NULL,'muralikrishna@webronic.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'<7be607a2-8140-740a-662f-7534056c6f10@kalaimagal.com>','SENT',NULL,'2026-05-20 13:54:59.872','2026-05-20 13:54:52.775'),(10,10,'muralikrishna@webronic.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'<8fc84037-eb15-5aaa-be7a-c23498d4645e@kalaimagal.com>','SENT',NULL,'2026-05-20 14:33:23.422','2026-05-20 14:33:17.855');
/*!40000 ALTER TABLE `emaillog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favorite`
--

DROP TABLE IF EXISTS `favorite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favorite` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Favorite_userId_contentId_key` (`userId`,`contentId`),
  KEY `Favorite_contentId_idx` (`contentId`),
  CONSTRAINT `Favorite_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Favorite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favorite`
--

LOCK TABLES `favorite` WRITE;
/*!40000 ALTER TABLE `favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `highlight`
--

DROP TABLE IF EXISTS `highlight`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `highlight` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `pageNumber` int(11) NOT NULL,
  `text` text NOT NULL,
  `color` enum('YELLOW','GREEN','BLUE','PINK') NOT NULL DEFAULT 'YELLOW',
  `note` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Highlight_userId_idx` (`userId`),
  KEY `Highlight_contentId_idx` (`contentId`),
  CONSTRAINT `Highlight_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Highlight_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `highlight`
--

LOCK TABLES `highlight` WRITE;
/*!40000 ALTER TABLE `highlight` DISABLE KEYS */;
/*!40000 ALTER TABLE `highlight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `invoice` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoiceNumber` varchar(50) NOT NULL,
  `paymentId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `billingName` varchar(255) NOT NULL,
  `billingEmail` varchar(255) NOT NULL,
  `billingPhone` varchar(20) DEFAULT NULL,
  `billingAddress` text DEFAULT NULL,
  `gstNumber` varchar(50) DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `gstAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `totalAmount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'INR',
  `issuedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `pdfUrl` varchar(500) DEFAULT NULL,
  `sentAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Invoice_invoiceNumber_key` (`invoiceNumber`),
  UNIQUE KEY `Invoice_paymentId_key` (`paymentId`),
  KEY `Invoice_userId_idx` (`userId`),
  CONSTRAINT `Invoice_paymentId_fkey` FOREIGN KEY (`paymentId`) REFERENCES `payment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Invoice_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `mediaasset`
--

DROP TABLE IF EXISTS `mediaasset`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `mediaasset` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `uploadedById` int(11) NOT NULL,
  `originalFilename` varchar(500) NOT NULL,
  `storedPath` varchar(500) NOT NULL,
  `mimeType` varchar(100) NOT NULL,
  `sizeBytes` bigint(20) NOT NULL,
  `width` int(11) DEFAULT NULL,
  `height` int(11) DEFAULT NULL,
  `alt` varchar(500) DEFAULT NULL,
  `usedInCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `MediaAsset_uploadedById_idx` (`uploadedById`),
  KEY `MediaAsset_mimeType_idx` (`mimeType`),
  CONSTRAINT `MediaAsset_uploadedById_fkey` FOREIGN KEY (`uploadedById`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `mediaasset`
--

LOCK TABLES `mediaasset` WRITE;
/*!40000 ALTER TABLE `mediaasset` DISABLE KEYS */;
/*!40000 ALTER TABLE `mediaasset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newslettersubscriber`
--

DROP TABLE IF EXISTS `newslettersubscriber`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `newslettersubscriber` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `source` varchar(100) DEFAULT NULL,
  `subscribedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `unsubscribedAt` datetime(3) DEFAULT NULL,
  `unsubscribeToken` varchar(255) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `NewsletterSubscriber_email_key` (`email`),
  UNIQUE KEY `NewsletterSubscriber_unsubscribeToken_key` (`unsubscribeToken`),
  UNIQUE KEY `NewsletterSubscriber_userId_key` (`userId`),
  KEY `NewsletterSubscriber_unsubscribedAt_idx` (`unsubscribedAt`),
  CONSTRAINT `NewsletterSubscriber_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newslettersubscriber`
--

LOCK TABLES `newslettersubscriber` WRITE;
/*!40000 ALTER TABLE `newslettersubscriber` DISABLE KEYS */;
/*!40000 ALTER TABLE `newslettersubscriber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `type` enum('SYSTEM','PAYMENT','CONTENT','SOCIAL') NOT NULL,
  `title` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `linkUrl` varchar(500) DEFAULT NULL,
  `readAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  KEY `Notification_userId_readAt_idx` (`userId`,`readAt`),
  KEY `Notification_type_idx` (`type`),
  CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `subscriptionId` int(11) DEFAULT NULL,
  `planId` int(11) DEFAULT NULL,
  `couponId` int(11) DEFAULT NULL,
  `razorpayOrderId` varchar(100) DEFAULT NULL,
  `razorpayPaymentId` varchar(100) DEFAULT NULL,
  `razorpaySignature` varchar(255) DEFAULT NULL,
  `razorpayRefundId` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `discountAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `taxAmount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `netAmount` decimal(10,2) NOT NULL,
  `currency` varchar(10) NOT NULL DEFAULT 'INR',
  `paymentMethod` enum('CARD','UPI','NETBANKING','WALLET','EMI') DEFAULT NULL,
  `status` enum('CREATED','ATTEMPTED','PAID','FAILED','REFUNDED','PARTIAL_REFUND') NOT NULL DEFAULT 'CREATED',
  `failureReason` varchar(500) DEFAULT NULL,
  `refundedAmount` decimal(10,2) DEFAULT NULL,
  `refundedAt` datetime(3) DEFAULT NULL,
  `invoiceNumber` varchar(50) DEFAULT NULL,
  `receiptUrl` varchar(500) DEFAULT NULL,
  `ipAddress` varchar(45) DEFAULT NULL,
  `paidAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Payment_razorpayPaymentId_key` (`razorpayPaymentId`),
  UNIQUE KEY `Payment_invoiceNumber_key` (`invoiceNumber`),
  KEY `Payment_razorpayPaymentId_idx` (`razorpayPaymentId`),
  KEY `Payment_razorpayOrderId_idx` (`razorpayOrderId`),
  KEY `Payment_userId_idx` (`userId`),
  KEY `Payment_status_idx` (`status`),
  KEY `Payment_createdAt_idx` (`createdAt`),
  KEY `Payment_subscriptionId_fkey` (`subscriptionId`),
  KEY `Payment_planId_fkey` (`planId`),
  KEY `Payment_couponId_fkey` (`couponId`),
  CONSTRAINT `Payment_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Payment_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `subscriptionplan` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Payment_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `subscription` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Payment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,1,NULL,1,NULL,'order_Sraa8DxpstvTZv',NULL,NULL,NULL,99.00,0.00,0.00,99.00,'INR',NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,'::1',NULL,'2026-05-20 10:41:19.626','2026-05-20 10:41:19.626'),(2,1,NULL,1,1,'order_Sraa8OchHsHUi6',NULL,NULL,NULL,99.00,9.90,0.00,89.10,'INR',NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,'::1',NULL,'2026-05-20 10:41:19.792','2026-05-20 10:41:19.792'),(4,8,NULL,1,NULL,'order_SrcKFGiakemrWC',NULL,NULL,NULL,99.00,0.00,0.00,99.00,'INR',NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,'::1',NULL,'2026-05-20 12:23:40.647','2026-05-20 12:23:40.647'),(5,8,NULL,1,NULL,'order_Srdjn4LgFy0HeG',NULL,NULL,NULL,99.00,0.00,0.00,99.00,'INR',NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,'::1',NULL,'2026-05-20 13:46:33.388','2026-05-20 13:46:33.388'),(6,10,2,1,NULL,'order_SreYjtozuCVROj','pay_SreYzLsGkbAzuw','857f7cfa906d5a273dc54f02c2374a9f628ccf2c628f2e30399ed5662fec362a',NULL,99.00,0.00,0.00,99.00,'INR',NULL,'PAID',NULL,NULL,NULL,NULL,NULL,'::1','2026-05-20 14:35:16.638','2026-05-20 14:34:47.360','2026-05-20 14:35:16.664');
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `readingprogress`
--

DROP TABLE IF EXISTS `readingprogress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `readingprogress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `lastPage` int(11) NOT NULL DEFAULT 1,
  `totalPages` int(11) DEFAULT NULL,
  `percentComplete` decimal(5,2) NOT NULL DEFAULT 0.00,
  `completedAt` datetime(3) DEFAULT NULL,
  `lastReadAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `ReadingProgress_userId_contentId_key` (`userId`,`contentId`),
  KEY `ReadingProgress_contentId_idx` (`contentId`),
  CONSTRAINT `ReadingProgress_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ReadingProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `readingprogress`
--

LOCK TABLES `readingprogress` WRITE;
/*!40000 ALTER TABLE `readingprogress` DISABLE KEYS */;
/*!40000 ALTER TABLE `readingprogress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `contentId` int(11) NOT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `body` text DEFAULT NULL,
  `status` enum('PENDING','APPROVED','REJECTED','FLAGGED') NOT NULL DEFAULT 'PENDING',
  `helpfulCount` int(11) NOT NULL DEFAULT 0,
  `reportedCount` int(11) NOT NULL DEFAULT 0,
  `moderatedById` int(11) DEFAULT NULL,
  `moderatedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Review_userId_contentId_key` (`userId`,`contentId`),
  KEY `Review_contentId_idx` (`contentId`),
  KEY `Review_status_idx` (`status`),
  KEY `Review_moderatedById_fkey` (`moderatedById`),
  CONSTRAINT `Review_contentId_fkey` FOREIGN KEY (`contentId`) REFERENCES `content` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Review_moderatedById_fkey` FOREIGN KEY (`moderatedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `Review_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviewvote`
--

DROP TABLE IF EXISTS `reviewvote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reviewvote` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reviewId` int(11) NOT NULL,
  `userId` int(11) NOT NULL,
  `isHelpful` tinyint(1) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `ReviewVote_reviewId_userId_key` (`reviewId`,`userId`),
  KEY `ReviewVote_userId_fkey` (`userId`),
  CONSTRAINT `ReviewVote_reviewId_fkey` FOREIGN KEY (`reviewId`) REFERENCES `review` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `ReviewVote_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviewvote`
--

LOCK TABLES `reviewvote` WRITE;
/*!40000 ALTER TABLE `reviewvote` DISABLE KEYS */;
/*!40000 ALTER TABLE `reviewvote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `series`
--

DROP TABLE IF EXISTS `series`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `series` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `nameTamil` varchar(255) NOT NULL,
  `nameEnglish` varchar(255) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `coverImageUrl` varchar(500) DEFAULT NULL,
  `isCompleted` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `Series_slug_key` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `series`
--

LOCK TABLES `series` WRITE;
/*!40000 ALTER TABLE `series` DISABLE KEYS */;
/*!40000 ALTER TABLE `series` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `session`
--

DROP TABLE IF EXISTS `session`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `session` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `tokenHash` varchar(255) NOT NULL,
  `deviceInfo` varchar(500) DEFAULT NULL,
  `ipAddress` varchar(45) DEFAULT NULL,
  `userAgent` varchar(500) DEFAULT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `lastUsedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `revokedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Session_tokenHash_key` (`tokenHash`),
  KEY `Session_tokenHash_idx` (`tokenHash`),
  KEY `Session_expiresAt_idx` (`expiresAt`),
  KEY `Session_userId_idx` (`userId`),
  CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `session`
--

LOCK TABLES `session` WRITE;
/*!40000 ALTER TABLE `session` DISABLE KEYS */;
INSERT INTO `session` VALUES (5,4,'1cd2e08a8896678ba72f953050c74a70f85c7ad4ea2f19dce93e47cc8a183d2d','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 08:14:10.630','2026-05-20 08:14:10.634',NULL,'2026-05-20 08:14:10.634'),(6,1,'6f3e65ab2a5a36178c88eb4dbf1d0050118396d7e7a08903fa2b5bd54b76d4d2','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 08:19:14.199','2026-05-20 08:19:14.201',NULL,'2026-05-20 08:19:14.201'),(7,1,'2ff250c4c1d648764146f8905c67a0523cf766646e6d78ac9e076feb3e71291a','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 10:41:06.574','2026-05-20 10:41:06.611',NULL,'2026-05-20 10:41:06.611'),(8,1,'2c696b60cc03fb691a871a6df113b5baced54184153641a456ef2e8e245b7426','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 10:41:41.798','2026-05-20 10:41:41.800',NULL,'2026-05-20 10:41:41.800'),(9,1,'3dbb5887c8e165913e9827a8d3c6b90a12e8fe7a5154e6b14f6e4345af12c934','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 10:45:57.649','2026-05-20 10:45:57.659',NULL,'2026-05-20 10:45:57.659'),(11,1,'ac08a6908c8bf3c30e9d93e0e0324a328623c4599413dbb9788fb350f4c5c2e1','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 10:56:56.408','2026-05-20 10:56:56.410',NULL,'2026-05-20 10:56:56.410'),(12,1,'549532be47fd752a1bd28dcb59a9f47e011e247da259ffa81cbed480d7f8d9f1','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 11:38:36.646','2026-05-20 11:38:36.667',NULL,'2026-05-20 11:38:36.667'),(13,1,'b1a722e9fff27366d250ea28b4bf3075ad098508ebf57c888f16b63c8aa3dafe','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 11:39:06.758','2026-05-20 11:39:06.760',NULL,'2026-05-20 11:39:06.760'),(15,1,'1db0f2d17132cadce666aa7874aa659a1f0584cb94cafc39a7b7edcee0f58339','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 11:47:33.211','2026-05-20 11:47:33.220',NULL,'2026-05-20 11:47:33.220'),(16,1,'25392b21eca2e537985d8b8646fd35990c4bd8f5a987214f8ca277d7b6498fcf','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 12:01:16.786','2026-05-20 12:01:16.789',NULL,'2026-05-20 12:01:16.789'),(17,1,'f879b61a9bc12819b441cd88859512d1a773252019cc09a9f8d904a56e5e532f','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 12:02:16.819','2026-05-20 12:02:16.821',NULL,'2026-05-20 12:02:16.821'),(18,8,'b65b23ec9e72cb3db627d4a7a4386286423d267ada8b7d0c840c65144ef9edec','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 12:03:45.421','2026-05-20 12:03:45.424',NULL,'2026-05-20 12:03:45.424'),(19,1,'317aa2fc324799eadf5e94c543080ca26879abdb2a7b2f41e57ceac5282557a2','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 12:04:37.820','2026-05-20 12:04:37.822','2026-05-20 12:22:01.456','2026-05-20 12:04:37.822'),(20,8,'c3016b920de5a7bbb289e9f118cb4a9447c7e18559b72ba1a16114041cb1b0c0','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 12:22:16.250','2026-05-20 12:22:16.252',NULL,'2026-05-20 12:22:16.252'),(21,8,'d8e6a7c6c38e0d96aebeb8c0ac344ebb5448a71500c7cf59843af2d0f78dd2d4','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 13:14:15.063','2026-05-20 13:14:15.067',NULL,'2026-05-20 13:14:15.067'),(22,8,'6ab808c00cf0506737cf48fc373994697f734a685152553132394d40a44cd354','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 13:44:30.000','2026-05-20 13:44:30.016',NULL,'2026-05-20 13:44:30.016'),(24,1,'7aedf8bfcf6764b420dca169af187402fd66523a1402fe53252aea5950be5cbf','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 13:55:50.335','2026-05-20 13:55:50.338',NULL,'2026-05-20 13:55:50.338'),(25,10,'5b48753147ea103c89cc113bf62d7527c73a88c739f5006369a3704076a84bbf','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 14:33:17.848','2026-05-20 14:33:17.849',NULL,'2026-05-20 14:33:17.849'),(26,1,'fd056926203e7b04dc85c96bfc86dc1405c1fbbed260e72e96ee04c225a65c33','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 14:36:17.705','2026-05-20 14:36:17.707',NULL,'2026-05-20 14:36:17.707');
/*!40000 ALTER TABLE `session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `setting`
--

DROP TABLE IF EXISTS `setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `setting` (
  `key` varchar(150) NOT NULL,
  `value` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`value`)),
  `description` varchar(500) DEFAULT NULL,
  `updatedById` int(11) DEFAULT NULL,
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`key`),
  KEY `Setting_updatedById_fkey` (`updatedById`),
  CONSTRAINT `Setting_updatedById_fkey` FOREIGN KEY (`updatedById`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `setting`
--

LOCK TABLES `setting` WRITE;
/*!40000 ALTER TABLE `setting` DISABLE KEYS */;
INSERT INTO `setting` VALUES ('feature.email_verify_required','false','Hard-gate browsing on email verify (false = soft mode)',NULL,'2026-05-20 09:32:23.968'),('feature.maintenance_mode','false','Show maintenance page to all non-admin users',NULL,'2026-05-20 09:32:23.973'),('legal.privacy_url','\"/legal/privacy\"','Privacy policy URL',NULL,'2026-05-20 09:32:23.955'),('legal.refund_url','\"/legal/refunds\"','Refund policy URL',NULL,'2026-05-20 09:32:23.964'),('legal.terms_url','\"/legal/terms\"','Terms of service URL',NULL,'2026-05-20 09:32:23.959'),('payment.currency','\"INR\"','Display currency',NULL,'2026-05-20 09:32:23.951'),('payment.current_price_inr','99','Display price (mirrors monthly plan)',NULL,'2026-05-20 09:32:23.946'),('site.accent_color','\"#7A1F2B\"','Primary accent color (burgundy)',NULL,'2026-05-20 09:32:23.925'),('site.accent_color_alt','\"#D97F2E\"','Secondary accent color (saffron)',NULL,'2026-05-20 09:32:23.930'),('site.hero_config','{\"headline_tamil\":\"தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு\",\"headline_english\":\"The digital home of Tamil literature\",\"cta_text_tamil\":\"சந்தா செலுத்து\",\"cta_text_english\":\"Subscribe\",\"featured_content_ids\":[]}','Homepage hero configuration',NULL,'2026-05-20 09:32:23.940'),('site.logo_url','null','URL to site logo; null = use typographic logo',NULL,'2026-05-20 09:32:23.921'),('site.name','\"Kalaimagal\"','Site name (English)',NULL,'2026-05-20 09:32:23.899'),('site.name_tamil','\"கலைமகள்\"','Site name (Tamil)',NULL,'2026-05-20 09:32:23.904'),('site.social_links','{\"twitter\":null,\"instagram\":null,\"youtube\":null,\"facebook\":null}','Social media URLs',NULL,'2026-05-20 09:32:23.936'),('site.support_email','\"support@kalaimagal.com\"','Public support email address',NULL,'2026-05-20 09:32:23.917'),('site.tagline_english','\"The digital home of Tamil literature\"','Site tagline (English)',NULL,'2026-05-20 09:32:23.913'),('site.tagline_tamil','\"????? ????????????? ????????? ????\"','Site tagline (Tamil)',1,'2026-05-20 10:41:41.865');
/*!40000 ALTER TABLE `setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscription`
--

DROP TABLE IF EXISTS `subscription`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscription` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `planId` int(11) NOT NULL,
  `startedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `expiresAt` datetime(3) NOT NULL,
  `status` enum('ACTIVE','EXPIRED','CANCELLED','PAUSED') NOT NULL DEFAULT 'ACTIVE',
  `cancelledAt` datetime(3) DEFAULT NULL,
  `cancellationReason` varchar(500) DEFAULT NULL,
  `autoRenew` tinyint(1) NOT NULL DEFAULT 0,
  `lastPaymentId` int(11) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Subscription_userId_idx` (`userId`),
  KEY `Subscription_status_idx` (`status`),
  KEY `Subscription_expiresAt_idx` (`expiresAt`),
  KEY `Subscription_planId_fkey` (`planId`),
  CONSTRAINT `Subscription_planId_fkey` FOREIGN KEY (`planId`) REFERENCES `subscriptionplan` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `Subscription_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscription`
--

LOCK TABLES `subscription` WRITE;
/*!40000 ALTER TABLE `subscription` DISABLE KEYS */;
INSERT INTO `subscription` VALUES (2,10,1,'2026-05-20 14:35:16.638','2026-06-19 14:35:16.638','ACTIVE',NULL,NULL,0,6,'2026-05-20 14:35:16.658','2026-05-20 14:35:16.658');
/*!40000 ALTER TABLE `subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subscriptionplan`
--

DROP TABLE IF EXISTS `subscriptionplan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `subscriptionplan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(100) NOT NULL,
  `nameTamil` varchar(255) NOT NULL,
  `nameEnglish` varchar(255) NOT NULL,
  `descriptionTamil` text DEFAULT NULL,
  `descriptionEnglish` text DEFAULT NULL,
  `priceInr` decimal(10,2) NOT NULL,
  `durationDays` int(11) NOT NULL,
  `features` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`features`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `sortOrder` int(11) NOT NULL DEFAULT 0,
  `razorpayPlanId` varchar(100) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `SubscriptionPlan_slug_key` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subscriptionplan`
--

LOCK TABLES `subscriptionplan` WRITE;
/*!40000 ALTER TABLE `subscriptionplan` DISABLE KEYS */;
INSERT INTO `subscriptionplan` VALUES (1,'monthly','மாதாந்திர திட்டம்','Monthly Plan','30 நாட்கள் முழுமையான அணுகல்','Full access for 30 days',99.00,30,'[\"அனைத்து புத்தகங்களுக்கும் வரம்பற்ற அணுகல்\",\"Unlimited access to all books\",\"Premium blog articles\",\"Mobile + desktop reader\"]',1,1,0,NULL,'2026-05-20 07:20:19.366','2026-05-20 09:32:23.798'),(2,'yearly','new','new plan','','low price',999.00,365,NULL,1,0,0,NULL,'2026-05-20 14:41:45.219','2026-05-20 14:41:45.219');
/*!40000 ALTER TABLE `subscriptionplan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tag` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `nameTamil` varchar(255) NOT NULL,
  `nameEnglish` varchar(255) DEFAULT NULL,
  `useCount` int(11) NOT NULL DEFAULT 0,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `Tag_slug_key` (`slug`),
  KEY `Tag_useCount_idx` (`useCount`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (1,'aarampam','ஆரம்பநிலை','Beginner',0,'2026-05-20 07:20:19.396'),(2,'meampatta','மேம்பட்ட','Advanced',0,'2026-05-20 07:20:19.401');
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `passwordHash` varchar(255) NOT NULL,
  `forcePasswordChangeOnNextLogin` tinyint(1) NOT NULL DEFAULT 0,
  `emailVerifiedAt` datetime(3) DEFAULT NULL,
  `emailVerificationToken` varchar(255) DEFAULT NULL,
  `passwordResetToken` varchar(255) DEFAULT NULL,
  `passwordResetExpiresAt` datetime(3) DEFAULT NULL,
  `role` enum('USER','EDITOR','ADMIN','SUPER_ADMIN') NOT NULL DEFAULT 'USER',
  `avatarUrl` varchar(500) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `preferredLanguage` enum('TA','EN','BILINGUAL') NOT NULL DEFAULT 'TA',
  `notificationPreferences` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`notificationPreferences`)),
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `isBanned` tinyint(1) NOT NULL DEFAULT 0,
  `banReason` text DEFAULT NULL,
  `lastLoginAt` datetime(3) DEFAULT NULL,
  `lastActiveAt` datetime(3) DEFAULT NULL,
  `loginCount` int(11) NOT NULL DEFAULT 0,
  `referralCode` varchar(50) DEFAULT NULL,
  `referredByUserId` int(11) DEFAULT NULL,
  `termsAcceptedAt` datetime(3) DEFAULT NULL,
  `marketingConsent` tinyint(1) NOT NULL DEFAULT 0,
  `deletedAt` datetime(3) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `User_email_key` (`email`),
  UNIQUE KEY `User_phone_key` (`phone`),
  UNIQUE KEY `User_emailVerificationToken_key` (`emailVerificationToken`),
  UNIQUE KEY `User_passwordResetToken_key` (`passwordResetToken`),
  UNIQUE KEY `User_referralCode_key` (`referralCode`),
  KEY `User_email_idx` (`email`),
  KEY `User_phone_idx` (`phone`),
  KEY `User_role_idx` (`role`),
  KEY `User_isActive_idx` (`isActive`),
  KEY `User_lastActiveAt_idx` (`lastActiveAt`),
  KEY `User_deletedAt_idx` (`deletedAt`),
  KEY `User_referredByUserId_fkey` (`referredByUserId`),
  CONSTRAINT `User_referredByUserId_fkey` FOREIGN KEY (`referredByUserId`) REFERENCES `user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Admin','admin@gmail.com',NULL,'$2b$12$TInbhZm1AFN8wOEATSzxzOFAEOjAhS8QJ6q4DEpem4W9boDbDkhXu',1,'2026-05-20 07:20:19.215',NULL,NULL,NULL,'SUPER_ADMIN',NULL,NULL,'TA',NULL,1,0,NULL,'2026-05-20 14:36:17.715','2026-05-20 14:36:17.715',13,NULL,NULL,'2026-05-20 07:20:19.215',0,NULL,'2026-05-20 07:20:19.348','2026-05-20 14:36:17.717'),(4,'Muralikrishna AG','muralikrishna.webronic@gmail.com','9080177542','$2b$12$ibmSzqm1v/fTP8gthfRE/uR0oIJILyZJgv/kfbvfg6CdlNDL7tJ3m',0,NULL,'Sr3X5Rp_Z36GDbvPQIlN2zsq0lTgZvvbIbxhO9IqvQ8',NULL,NULL,'USER',NULL,NULL,'TA','{\"email\":true,\"payment\":true,\"content\":true}',1,0,NULL,NULL,NULL,0,NULL,NULL,'2026-05-20 08:14:10.600',1,NULL,'2026-05-20 08:14:10.610','2026-05-20 08:14:10.610'),(8,'Comment Writer','commentwriter4@gmail.com','7810077542','$2b$12$i1JnP9RqcNemjojAtj9VvO7ZAQFlQOc0GokZr8hSAyXTbF0WpMx8q',0,NULL,'Cy6TTlbT-4bsygenHaZ5Z_sNZBdmHiNk5nHMNa1plYw','_Qkw-V6gM8hS5j9LAFWpfsOCotFiX4yThzrNv65DdnM','2026-05-20 13:26:02.087','USER',NULL,NULL,'TA','{\"email\":true,\"payment\":true,\"content\":true}',1,0,NULL,'2026-05-20 13:44:30.030','2026-05-20 13:44:30.030',3,NULL,NULL,'2026-05-20 12:03:45.399',1,NULL,'2026-05-20 12:03:45.410','2026-05-20 13:44:30.040'),(10,'murali','muralikrishna@webronic.com','1234567890','$2b$12$h9bUDEF37cn3QH8nGOcPMeR5YvJjGVeWzs2eZMvACAQ3GT7uu6vo.',0,'2026-05-20 14:33:32.765',NULL,NULL,NULL,'USER',NULL,NULL,'TA','{\"email\":true,\"payment\":true,\"content\":true}',1,0,NULL,NULL,NULL,0,NULL,NULL,'2026-05-20 14:33:17.831',1,NULL,'2026-05-20 14:33:17.834','2026-05-20 14:33:32.774');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `webhooklog`
--

DROP TABLE IF EXISTS `webhooklog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `webhooklog` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `source` enum('RAZORPAY') NOT NULL,
  `eventType` varchar(100) NOT NULL,
  `eventId` varchar(150) DEFAULT NULL,
  `payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payload`)),
  `signature` varchar(500) DEFAULT NULL,
  `status` enum('RECEIVED','PROCESSED','FAILED','DUPLICATE') NOT NULL DEFAULT 'RECEIVED',
  `errorMessage` text DEFAULT NULL,
  `receivedAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `processedAt` datetime(3) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `WebhookLog_source_eventId_key` (`source`,`eventId`),
  KEY `WebhookLog_status_idx` (`status`),
  KEY `WebhookLog_receivedAt_idx` (`receivedAt`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `webhooklog`
--

LOCK TABLES `webhooklog` WRITE;
/*!40000 ALTER TABLE `webhooklog` DISABLE KEYS */;
/*!40000 ALTER TABLE `webhooklog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-21 13:12:12
SET FOREIGN_KEY_CHECKS=1; 
