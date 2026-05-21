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
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('95d5c908-bd92-477d-83a7-7a553aa397a6','bb344412390a1c563e26a0c6c7e87ea5f5e76ea87567c5d8f1119da32bb66fd8','2026-05-20 07:19:20.556','20260520071918_init',NULL,NULL,'2026-05-20 07:19:18.163',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ActivityLog`
--

LOCK TABLES `ActivityLog` WRITE;
/*!40000 ALTER TABLE `ActivityLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `ActivityLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ApiToken`
--

LOCK TABLES `ApiToken` WRITE;
/*!40000 ALTER TABLE `ApiToken` DISABLE KEYS */;
/*!40000 ALTER TABLE `ApiToken` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `AuditLog`
--

LOCK TABLES `AuditLog` WRITE;
/*!40000 ALTER TABLE `AuditLog` DISABLE KEYS */;
INSERT INTO `AuditLog` VALUES (8,4,'CREATE','User','4',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 08:14:10.660'),(9,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 08:19:14.219'),(10,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 10:41:06.697'),(11,1,'UPDATE','Setting',NULL,'{\"updatedKeys\":[\"site.tagline_tamil\"]}','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 10:41:20.208'),(12,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 10:41:41.811'),(13,1,'UPDATE','Setting',NULL,'{\"updatedKeys\":[\"site.tagline_tamil\"]}','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 10:41:41.881'),(14,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 10:45:57.682'),(15,NULL,'CREATE','User','6',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 10:52:23.756'),(16,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 10:56:56.513'),(17,1,'CREATE','Content','4','{\"type\":\"PDF\",\"pageCount\":138,\"fileSizeBytes\":954404}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:00:50.336'),(18,1,'UPDATE','Content','4','{\"titleTamil\":\"Tamil notes\",\"titleEnglish\":\"tamil notes\",\"slug\":\"tamil-notes-f431ce\",\"description\":\"This is the one of the book that helps to know tamil\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"readingTimeMinutes\":100,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:01:49.516'),(19,1,'CONTENT_PUBLISH','Content','4','{\"titleTamil\":\"Tamil notes\",\"titleEnglish\":\"tamil notes\",\"slug\":\"tamil-notes-f431ce\",\"description\":\"This is the one of the book that helps to know tamil\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"status\":\"PUBLISHED\",\"readingTimeMinutes\":100,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:01:51.331'),(20,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 11:38:36.723'),(21,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 11:39:06.778'),(23,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:47:33.243'),(24,1,'DELETE','Content','2',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:49:06.441'),(25,1,'CREATE','Content','5','{\"type\":\"PDF\",\"pageCount\":88,\"fileSizeBytes\":3751069}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:50:31.882'),(26,1,'UPDATE','Content','5','{\"titleTamil\":\"பொன்னியின் செல்வன் — முதல் பாகம்\",\"titleEnglish\":\"ponniyin-selvan-vol-1\",\"slug\":\"ponniyin-selvan-vol-1-a7b500\",\"description\":\"பேரறிஞர் அண்ணா அவர்களின் “பணத்தோட்டம்” எனும் இக்கட்டுரைத் தொகுப்பு, 1946-ஆம் ஆண்டு காலகட்டத்தில், அன்றைய சென்னை மாகாணத்தின் பொருளாதாரச் சூழலை விவரிக்கிறது.\\n\\nவட இந்திய வணிக நிறுவனங்கள் மற்றும் நிதி நிறுவனங்கள், எவ்வாறு தமிழ்நாட்டின் பொருளாதாரத்தை ஆக்கிரமித்தன என்பதைப் புள்ளிவிவரங்களுடன் விளக்குகிறார். வங்கிகள், காப்பீட்டு நிறுவனங்கள், தொழில்துறையெனப் பல துறைகளிலும் வட இந்தியர்களின் ஆதிக்கம் எவ்வாறு இருந்தது என்பதையும், அதனால் தமிழ்நாட்டின் பாரம்பரிய தொழில்கள் எவ்வாறு நலிவடைந்தன என்பதையும் அண்ணா அவர்கள் தெளிவாக எடுத்துரைக்கிறார்.\\n\\nமேலும், காந்திஜியின் கதர் திட்டம் எவ்வாறு தமிழ்நாட்டின் நெசவுத் தொழிலைப் பாதித்தது என்பதையும், பம்பாயின் தொழில் வளர்ச்சியுடன் ஒப்பிடுகையில், சென்னை எவ்வாறு பின்தங்கியிருந்தது என்பதையும் அண்ணா விமர்சிக்கிறார். திராவிடநாடு தனி அரசாக இருந்தால்தான், இத்தகைய பொருளாதாரச் சுரண்டலைத் தடுக்க முடியும் என்ற கருத்தை வலியுறுத்துகிறார்.\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"readingTimeMinutes\":null,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:50:52.635'),(27,1,'CONTENT_PUBLISH','Content','5','{\"titleTamil\":\"பொன்னியின் செல்வன் — முதல் பாகம்\",\"titleEnglish\":\"ponniyin-selvan-vol-1\",\"slug\":\"ponniyin-selvan-vol-1-a7b500\",\"description\":\"பேரறிஞர் அண்ணா அவர்களின் “பணத்தோட்டம்” எனும் இக்கட்டுரைத் தொகுப்பு, 1946-ஆம் ஆண்டு காலகட்டத்தில், அன்றைய சென்னை மாகாணத்தின் பொருளாதாரச் சூழலை விவரிக்கிறது.\\n\\nவட இந்திய வணிக நிறுவனங்கள் மற்றும் நிதி நிறுவனங்கள், எவ்வாறு தமிழ்நாட்டின் பொருளாதாரத்தை ஆக்கிரமித்தன என்பதைப் புள்ளிவிவரங்களுடன் விளக்குகிறார். வங்கிகள், காப்பீட்டு நிறுவனங்கள், தொழில்துறையெனப் பல துறைகளிலும் வட இந்தியர்களின் ஆதிக்கம் எவ்வாறு இருந்தது என்பதையும், அதனால் தமிழ்நாட்டின் பாரம்பரிய தொழில்கள் எவ்வாறு நலிவடைந்தன என்பதையும் அண்ணா அவர்கள் தெளிவாக எடுத்துரைக்கிறார்.\\n\\nமேலும், காந்திஜியின் கதர் திட்டம் எவ்வாறு தமிழ்நாட்டின் நெசவுத் தொழிலைப் பாதித்தது என்பதையும், பம்பாயின் தொழில் வளர்ச்சியுடன் ஒப்பிடுகையில், சென்னை எவ்வாறு பின்தங்கியிருந்தது என்பதையும் அண்ணா விமர்சிக்கிறார். திராவிடநாடு தனி அரசாக இருந்தால்தான், இத்தகைய பொருளாதாரச் சுரண்டலைத் தடுக்க முடியும் என்ற கருத்தை வலியுறுத்துகிறார்.\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"status\":\"PUBLISHED\",\"readingTimeMinutes\":null,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 11:50:56.009'),(28,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 12:01:16.805'),(29,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-05-20 12:02:16.833'),(30,8,'CREATE','User','8',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:03:51.780'),(31,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:04:37.844'),(32,1,'DELETE','Content','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:06:37.993'),(33,1,'UPDATE','Content','4','{\"titleTamil\":\"Tamil notes\",\"titleEnglish\":\"tamil notes\",\"slug\":\"tamil-notes-f431ce\",\"description\":\"This is the one of the book that helps to know tamil\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":false,\"isFeatured\":false,\"language\":\"TA\",\"readingTimeMinutes\":100,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:07:00.735'),(34,1,'LOGOUT','Session','19',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:22:01.466'),(35,8,'LOGIN','User','8',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 12:22:16.266'),(36,8,'LOGIN','User','8',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:14:15.091'),(37,8,'LOGIN','User','8',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:44:30.049'),(38,NULL,'CREATE','User','9',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:54:59.882'),(39,NULL,'UPDATE','User','9','{\"emailVerifiedAt\":\"2026-05-20T13:55:14.956Z\"}','::1','node','2026-05-20 13:55:14.959'),(40,NULL,'LOGOUT','Session','23',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:55:25.080'),(41,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 13:55:50.352'),(42,10,'CREATE','User','10',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:33:23.431'),(43,10,'UPDATE','User','10','{\"emailVerifiedAt\":\"2026-05-20T14:33:32.906Z\"}','::1','node','2026-05-20 14:33:32.908'),(44,1,'LOGIN','User','1',NULL,'::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:36:17.725'),(45,1,'CREATE','Content','6','{\"type\":\"PDF\",\"pageCount\":88,\"fileSizeBytes\":3751069}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:38:00.812'),(46,1,'CREATE','SubscriptionPlan','2','{\"slug\":\"yearly\",\"nameTamil\":\"new\",\"nameEnglish\":\"new plan\",\"descriptionTamil\":\"\",\"descriptionEnglish\":\"low price\",\"priceInr\":\"999\",\"durationDays\":365,\"isActive\":true,\"isFeatured\":false}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:41:45.241'),(47,1,'UPDATE','Content','6','{\"titleTamil\":\"new book\",\"titleEnglish\":\"new book content\",\"slug\":\"new-book-content-353ce3\",\"description\":\"new content\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"readingTimeMinutes\":80,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:43:31.455'),(48,1,'CONTENT_PUBLISH','Content','6','{\"titleTamil\":\"new book\",\"titleEnglish\":\"new book content\",\"slug\":\"new-book-content-353ce3\",\"description\":\"new content\",\"excerpt\":null,\"bodyText\":null,\"isPremium\":true,\"isFeatured\":false,\"language\":\"TA\",\"status\":\"PUBLISHED\",\"readingTimeMinutes\":80,\"metaTitle\":null,\"metaDescription\":null}','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-05-20 14:43:33.541');
/*!40000 ALTER TABLE `AuditLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Author`
--

LOCK TABLES `Author` WRITE;
/*!40000 ALTER TABLE `Author` DISABLE KEYS */;
INSERT INTO `Author` VALUES (1,'bharathiyar','சுப்பிரமணிய பாரதியார்','Subramania Bharati','தமிழ்நாட்டின் தேசிய கவிஞர். விடுதலை, பெண்கள் உரிமை, சாதி எதிர்ப்பு என பல சமூக சீர்திருத்தக் கருத்துகளை தனது படைப்புகளில் வெளிப்படுத்தினார்.','National Poet of Tamil Nadu. His works championed freedom, women\'s rights, and anti-caste reforms.',NULL,1882,1921,NULL,1,0,'2026-05-20 07:20:19.410','2026-05-20 07:20:19.410'),(2,'kalki','கல்கி கிருஷ்ணமூர்த்தி','Kalki Krishnamurthy','தமிழின் தலைசிறந்த புதின எழுத்தாளர். \'பொன்னியின் செல்வன்\', \'சிவகாமியின் சபதம்\' போன்ற வரலாற்று நாவல்களை எழுதினார்.','One of Tamil\'s greatest historical novelists, author of \'Ponniyin Selvan\' and \'Sivagamiyin Sapatham\'.',NULL,1899,1954,NULL,1,1,'2026-05-20 07:20:19.416','2026-05-20 07:20:19.416');
/*!40000 ALTER TABLE `Author` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Bookmark`
--

LOCK TABLES `Bookmark` WRITE;
/*!40000 ALTER TABLE `Bookmark` DISABLE KEYS */;
/*!40000 ALTER TABLE `Bookmark` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Category`
--

LOCK TABLES `Category` WRITE;
/*!40000 ALTER TABLE `Category` DISABLE KEYS */;
INSERT INTO `Category` VALUES (1,'ilakkiyam','இலக்கியம்','Literature',NULL,NULL,NULL,0,1,'2026-05-20 07:20:19.371','2026-05-20 07:20:19.371'),(2,'sirukathai','சிறுகதை','Short Stories',NULL,NULL,NULL,1,1,'2026-05-20 07:20:19.375','2026-05-20 07:20:19.375'),(3,'naaval','நாவல்','Novels',NULL,NULL,NULL,2,1,'2026-05-20 07:20:19.381','2026-05-20 07:20:19.381'),(4,'kavithai','கவிதை','Poetry',NULL,NULL,NULL,3,1,'2026-05-20 07:20:19.385','2026-05-20 07:20:19.385'),(5,'kattuirai','கட்டுரை','Essays',NULL,NULL,NULL,4,1,'2026-05-20 07:20:19.389','2026-05-20 07:20:19.389');
/*!40000 ALTER TABLE `Category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Comment`
--

LOCK TABLES `Comment` WRITE;
/*!40000 ALTER TABLE `Comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `Comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ContactSubmission`
--

LOCK TABLES `ContactSubmission` WRITE;
/*!40000 ALTER TABLE `ContactSubmission` DISABLE KEYS */;
/*!40000 ALTER TABLE `ContactSubmission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Content`
--

LOCK TABLES `Content` WRITE;
/*!40000 ALTER TABLE `Content` DISABLE KEYS */;
INSERT INTO `Content` VALUES (1,'bharathi-padalgal-sample','PDF','பாரதியார் பாடல்கள் — மாதிரி','Bharathi Padalgal — Sample',NULL,'பாரதியாரின் தேர்ந்தெடுக்கப்பட்ட தேசபக்திப் பாடல்கள் (பத்து பக்க மாதிரி). Selected patriotic songs of Bharati (10-page sample).',NULL,NULL,'pdfs/cf3077ca-f0f7-48c7-8909-162f52542a99.pdf',NULL,NULL,144,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',NULL,NULL,0,0,0,0,NULL,0,0,1,'ARCHIVED','2026-05-20 07:20:19.427',NULL,0,NULL,NULL,1,NULL,'2026-05-20 12:06:37.969','2026-05-20 07:20:19.451','2026-05-20 12:06:37.974'),(2,'ponniyin-selvan-vol-1','PDF','பொன்னியின் செல்வன் — முதல் பாகம்','Ponniyin Selvan — Volume 1',NULL,'சோழ சாம்ராஜ்யத்தின் வரலாற்று நாவல். The historical epic of the Chola empire.',NULL,NULL,'pdfs/cf3077ca-f0f7-48c7-8909-162f52542a99.pdf',NULL,NULL,144,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',NULL,NULL,0,0,0,0,NULL,0,1,1,'ARCHIVED','2026-05-20 07:20:19.463',NULL,0,NULL,NULL,1,NULL,'2026-05-20 11:49:06.415','2026-05-20 07:20:19.468','2026-05-20 11:49:06.418'),(3,'tamil-ilakkiya-varalaru','BLOG','தமிழ் இலக்கிய வரலாறு — ஒரு பார்வை','A Look at the History of Tamil Literature',NULL,'சங்க காலத்திலிருந்து தற்கால இலக்கியம் வரை. From the Sangam era to modern literature.','தமிழ் இலக்கியத்தின் இரண்டாயிரம் ஆண்டு பயணம், சங்க காலத்திலிருந்து தற்கால இலக்கியம் வரை...','<p>தமிழ் இலக்கியம் இரண்டாயிரம் ஆண்டுகளுக்கும் மேலான தொடர்ச்சியான இலக்கிய மரபைக் கொண்டது. சங்க காலம் முதல் தற்கால இலக்கியம் வரை, ஒவ்வொரு காலகட்டமும் தனித்துவமான பங்களிப்பை வழங்கியுள்ளது.</p><p>This blog post traces the two-millennia journey of Tamil literature, from the Sangam era to contemporary writing.</p>',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'BILINGUAL',8,1200,0,0,0,0,NULL,0,0,0,'PUBLISHED','2026-05-20 07:20:19.474',NULL,0,NULL,NULL,1,NULL,NULL,'2026-05-20 07:20:19.478','2026-05-20 07:20:19.478'),(4,'tamil-notes-f431ce','PDF','Tamil notes','tamil notes',NULL,'This is the one of the book that helps to know tamil',NULL,NULL,'pdfs/f431ce45-27e7-4818-b968-e2b963a21410.pdf',954404,'application/pdf',138,'/api/convert?doc_id=4&page=1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',100,NULL,0,0,0,0,NULL,0,0,0,'PUBLISHED','2026-05-20 11:01:51.306',NULL,0,NULL,NULL,1,1,NULL,'2026-05-20 11:00:49.232','2026-05-20 12:07:00.723'),(5,'ponniyin-selvan-vol-1-a7b500','PDF','பொன்னியின் செல்வன் — முதல் பாகம்','ponniyin-selvan-vol-1',NULL,'பேரறிஞர் அண்ணா அவர்களின் “பணத்தோட்டம்” எனும் இக்கட்டுரைத் தொகுப்பு, 1946-ஆம் ஆண்டு காலகட்டத்தில், அன்றைய சென்னை மாகாணத்தின் பொருளாதாரச் சூழலை விவரிக்கிறது.\n\nவட இந்திய வணிக நிறுவனங்கள் மற்றும் நிதி நிறுவனங்கள், எவ்வாறு தமிழ்நாட்டின் பொருளாதாரத்தை ஆக்கிரமித்தன என்பதைப் புள்ளிவிவரங்களுடன் விளக்குகிறார். வங்கிகள், காப்பீட்டு நிறுவனங்கள், தொழில்துறையெனப் பல துறைகளிலும் வட இந்தியர்களின் ஆதிக்கம் எவ்வாறு இருந்தது என்பதையும், அதனால் தமிழ்நாட்டின் பாரம்பரிய தொழில்கள் எவ்வாறு நலிவடைந்தன என்பதையும் அண்ணா அவர்கள் தெளிவாக எடுத்துரைக்கிறார்.\n\nமேலும், காந்திஜியின் கதர் திட்டம் எவ்வாறு தமிழ்நாட்டின் நெசவுத் தொழிலைப் பாதித்தது என்பதையும், பம்பாயின் தொழில் வளர்ச்சியுடன் ஒப்பிடுகையில், சென்னை எவ்வாறு பின்தங்கியிருந்தது என்பதையும் அண்ணா விமர்சிக்கிறார். திராவிடநாடு தனி அரசாக இருந்தால்தான், இத்தகைய பொருளாதாரச் சுரண்டலைத் தடுக்க முடியும் என்ற கருத்தை வலியுறுத்துகிறார்.',NULL,NULL,'pdfs/a7b500c8-6378-42d7-b143-080ec5368c5c.pdf',3751069,'application/pdf',88,'/api/convert?doc_id=5&page=1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',NULL,NULL,0,0,0,0,NULL,0,1,0,'PUBLISHED','2026-05-20 11:50:55.985',NULL,0,NULL,NULL,1,1,NULL,'2026-05-20 11:50:30.669','2026-05-20 11:50:55.990'),(6,'new-book-content-353ce3','PDF','new book','new book content',NULL,'new content',NULL,NULL,'pdfs/353ce30b-aa5f-42ae-9ff4-5380e05a6ddd.pdf',3751069,'application/pdf',88,'/api/convert?doc_id=6&page=1',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'TA',80,NULL,0,0,0,0,NULL,0,1,0,'PUBLISHED','2026-05-20 14:43:33.514',NULL,0,NULL,NULL,1,1,NULL,'2026-05-20 14:37:59.379','2026-05-20 14:43:33.517');
/*!40000 ALTER TABLE `Content` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ContentAuthor`
--

LOCK TABLES `ContentAuthor` WRITE;
/*!40000 ALTER TABLE `ContentAuthor` DISABLE KEYS */;
INSERT INTO `ContentAuthor` VALUES (1,1,'AUTHOR',0),(2,2,'AUTHOR',0);
/*!40000 ALTER TABLE `ContentAuthor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ContentCategory`
--

LOCK TABLES `ContentCategory` WRITE;
/*!40000 ALTER TABLE `ContentCategory` DISABLE KEYS */;
INSERT INTO `ContentCategory` VALUES (1,1),(1,4),(2,1),(2,3),(3,5);
/*!40000 ALTER TABLE `ContentCategory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ContentTag`
--

LOCK TABLES `ContentTag` WRITE;
/*!40000 ALTER TABLE `ContentTag` DISABLE KEYS */;
INSERT INTO `ContentTag` VALUES (1,1);
/*!40000 ALTER TABLE `ContentTag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Coupon`
--

LOCK TABLES `Coupon` WRITE;
/*!40000 ALTER TABLE `Coupon` DISABLE KEYS */;
INSERT INTO `Coupon` VALUES (1,'WELCOME10','PERCENTAGE',10.00,1000,0,1,NULL,'2026-05-20 07:20:19.482','2026-08-18 07:20:19.482','{\"plan_slugs\":[\"monthly\"]}',1,1,'2026-05-20 07:20:19.486','2026-05-20 07:20:19.486');
/*!40000 ALTER TABLE `Coupon` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `CouponUsage`
--

LOCK TABLES `CouponUsage` WRITE;
/*!40000 ALTER TABLE `CouponUsage` DISABLE KEYS */;
/*!40000 ALTER TABLE `CouponUsage` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `EmailLog`
--

LOCK TABLES `EmailLog` WRITE;
/*!40000 ALTER TABLE `EmailLog` DISABLE KEYS */;
INSERT INTO `EmailLog` VALUES (4,4,'muralikrishna.webronic@gmail.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'console:4','SENT',NULL,'2026-05-20 08:14:10.648','2026-05-20 08:14:10.643'),(5,NULL,'commentwriter4@gmail.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'console:5','SENT',NULL,'2026-05-20 10:52:23.743','2026-05-20 10:52:23.731'),(7,8,'commentwriter4@gmail.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'<e3ce5669-2554-d12e-3f62-8b64eb5d8119@kalaimagal.com>','SENT',NULL,'2026-05-20 12:03:51.765','2026-05-20 12:03:45.434'),(8,8,'commentwriter4@gmail.com','password-reset','கடவுச்சொல்லை மீட்டமைக்க — Reset your password',NULL,'<dc0b23c4-08a5-18de-f655-87530f107a20@kalaimagal.com>','SENT',NULL,'2026-05-20 13:11:05.867','2026-05-20 13:11:02.119'),(9,NULL,'muralikrishna@webronic.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'<7be607a2-8140-740a-662f-7534056c6f10@kalaimagal.com>','SENT',NULL,'2026-05-20 13:54:59.872','2026-05-20 13:54:52.775'),(10,10,'muralikrishna@webronic.com','verify-email','உங்கள் மின்னஞ்சலை உறுதிப்படுத்துங்கள் — Verify your email',NULL,'<8fc84037-eb15-5aaa-be7a-c23498d4645e@kalaimagal.com>','SENT',NULL,'2026-05-20 14:33:23.422','2026-05-20 14:33:17.855');
/*!40000 ALTER TABLE `EmailLog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Favorite`
--

LOCK TABLES `Favorite` WRITE;
/*!40000 ALTER TABLE `Favorite` DISABLE KEYS */;
/*!40000 ALTER TABLE `Favorite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Highlight`
--

LOCK TABLES `Highlight` WRITE;
/*!40000 ALTER TABLE `Highlight` DISABLE KEYS */;
/*!40000 ALTER TABLE `Highlight` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Invoice`
--

LOCK TABLES `Invoice` WRITE;
/*!40000 ALTER TABLE `Invoice` DISABLE KEYS */;
/*!40000 ALTER TABLE `Invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `MediaAsset`
--

LOCK TABLES `MediaAsset` WRITE;
/*!40000 ALTER TABLE `MediaAsset` DISABLE KEYS */;
/*!40000 ALTER TABLE `MediaAsset` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `NewsletterSubscriber`
--

LOCK TABLES `NewsletterSubscriber` WRITE;
/*!40000 ALTER TABLE `NewsletterSubscriber` DISABLE KEYS */;
/*!40000 ALTER TABLE `NewsletterSubscriber` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Notification`
--

LOCK TABLES `Notification` WRITE;
/*!40000 ALTER TABLE `Notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `Notification` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Payment`
--

LOCK TABLES `Payment` WRITE;
/*!40000 ALTER TABLE `Payment` DISABLE KEYS */;
INSERT INTO `Payment` VALUES (1,1,NULL,1,NULL,'order_Sraa8DxpstvTZv',NULL,NULL,NULL,99.00,0.00,0.00,99.00,'INR',NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,'::1',NULL,'2026-05-20 10:41:19.626','2026-05-20 10:41:19.626'),(2,1,NULL,1,1,'order_Sraa8OchHsHUi6',NULL,NULL,NULL,99.00,9.90,0.00,89.10,'INR',NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,'::1',NULL,'2026-05-20 10:41:19.792','2026-05-20 10:41:19.792'),(4,8,NULL,1,NULL,'order_SrcKFGiakemrWC',NULL,NULL,NULL,99.00,0.00,0.00,99.00,'INR',NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,'::1',NULL,'2026-05-20 12:23:40.647','2026-05-20 12:23:40.647'),(5,8,NULL,1,NULL,'order_Srdjn4LgFy0HeG',NULL,NULL,NULL,99.00,0.00,0.00,99.00,'INR',NULL,'CREATED',NULL,NULL,NULL,NULL,NULL,'::1',NULL,'2026-05-20 13:46:33.388','2026-05-20 13:46:33.388'),(6,10,2,1,NULL,'order_SreYjtozuCVROj','pay_SreYzLsGkbAzuw','857f7cfa906d5a273dc54f02c2374a9f628ccf2c628f2e30399ed5662fec362a',NULL,99.00,0.00,0.00,99.00,'INR',NULL,'PAID',NULL,NULL,NULL,NULL,NULL,'::1','2026-05-20 14:35:16.638','2026-05-20 14:34:47.360','2026-05-20 14:35:16.664');
/*!40000 ALTER TABLE `Payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ReadingProgress`
--

LOCK TABLES `ReadingProgress` WRITE;
/*!40000 ALTER TABLE `ReadingProgress` DISABLE KEYS */;
/*!40000 ALTER TABLE `ReadingProgress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Review`
--

LOCK TABLES `Review` WRITE;
/*!40000 ALTER TABLE `Review` DISABLE KEYS */;
/*!40000 ALTER TABLE `Review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `ReviewVote`
--

LOCK TABLES `ReviewVote` WRITE;
/*!40000 ALTER TABLE `ReviewVote` DISABLE KEYS */;
/*!40000 ALTER TABLE `ReviewVote` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Series`
--

LOCK TABLES `Series` WRITE;
/*!40000 ALTER TABLE `Series` DISABLE KEYS */;
/*!40000 ALTER TABLE `Series` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Session`
--

LOCK TABLES `Session` WRITE;
/*!40000 ALTER TABLE `Session` DISABLE KEYS */;
INSERT INTO `Session` VALUES (5,4,'1cd2e08a8896678ba72f953050c74a70f85c7ad4ea2f19dce93e47cc8a183d2d','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 08:14:10.630','2026-05-20 08:14:10.634',NULL,'2026-05-20 08:14:10.634'),(6,1,'6f3e65ab2a5a36178c88eb4dbf1d0050118396d7e7a08903fa2b5bd54b76d4d2','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 08:19:14.199','2026-05-20 08:19:14.201',NULL,'2026-05-20 08:19:14.201'),(7,1,'2ff250c4c1d648764146f8905c67a0523cf766646e6d78ac9e076feb3e71291a','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 10:41:06.574','2026-05-20 10:41:06.611',NULL,'2026-05-20 10:41:06.611'),(8,1,'2c696b60cc03fb691a871a6df113b5baced54184153641a456ef2e8e245b7426','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 10:41:41.798','2026-05-20 10:41:41.800',NULL,'2026-05-20 10:41:41.800'),(9,1,'3dbb5887c8e165913e9827a8d3c6b90a12e8fe7a5154e6b14f6e4345af12c934','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 10:45:57.649','2026-05-20 10:45:57.659',NULL,'2026-05-20 10:45:57.659'),(11,1,'ac08a6908c8bf3c30e9d93e0e0324a328623c4599413dbb9788fb350f4c5c2e1','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 10:56:56.408','2026-05-20 10:56:56.410',NULL,'2026-05-20 10:56:56.410'),(12,1,'549532be47fd752a1bd28dcb59a9f47e011e247da259ffa81cbed480d7f8d9f1','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 11:38:36.646','2026-05-20 11:38:36.667',NULL,'2026-05-20 11:38:36.667'),(13,1,'b1a722e9fff27366d250ea28b4bf3075ad098508ebf57c888f16b63c8aa3dafe','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 11:39:06.758','2026-05-20 11:39:06.760',NULL,'2026-05-20 11:39:06.760'),(15,1,'1db0f2d17132cadce666aa7874aa659a1f0584cb94cafc39a7b7edcee0f58339','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 11:47:33.211','2026-05-20 11:47:33.220',NULL,'2026-05-20 11:47:33.220'),(16,1,'25392b21eca2e537985d8b8646fd35990c4bd8f5a987214f8ca277d7b6498fcf','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 12:01:16.786','2026-05-20 12:01:16.789',NULL,'2026-05-20 12:01:16.789'),(17,1,'f879b61a9bc12819b441cd88859512d1a773252019cc09a9f8d904a56e5e532f','Windows','::1','Mozilla/5.0 (Windows NT; Windows NT 10.0; en-US) WindowsPowerShell/5.1.26100.8457','2026-06-19 12:02:16.819','2026-05-20 12:02:16.821',NULL,'2026-05-20 12:02:16.821'),(18,8,'b65b23ec9e72cb3db627d4a7a4386286423d267ada8b7d0c840c65144ef9edec','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 12:03:45.421','2026-05-20 12:03:45.424',NULL,'2026-05-20 12:03:45.424'),(19,1,'317aa2fc324799eadf5e94c543080ca26879abdb2a7b2f41e57ceac5282557a2','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 12:04:37.820','2026-05-20 12:04:37.822','2026-05-20 12:22:01.456','2026-05-20 12:04:37.822'),(20,8,'c3016b920de5a7bbb289e9f118cb4a9447c7e18559b72ba1a16114041cb1b0c0','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 12:22:16.250','2026-05-20 12:22:16.252',NULL,'2026-05-20 12:22:16.252'),(21,8,'d8e6a7c6c38e0d96aebeb8c0ac344ebb5448a71500c7cf59843af2d0f78dd2d4','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 13:14:15.063','2026-05-20 13:14:15.067',NULL,'2026-05-20 13:14:15.067'),(22,8,'6ab808c00cf0506737cf48fc373994697f734a685152553132394d40a44cd354','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 13:44:30.000','2026-05-20 13:44:30.016',NULL,'2026-05-20 13:44:30.016'),(24,1,'7aedf8bfcf6764b420dca169af187402fd66523a1402fe53252aea5950be5cbf','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 13:55:50.335','2026-05-20 13:55:50.338',NULL,'2026-05-20 13:55:50.338'),(25,10,'5b48753147ea103c89cc113bf62d7527c73a88c739f5006369a3704076a84bbf','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 14:33:17.848','2026-05-20 14:33:17.849',NULL,'2026-05-20 14:33:17.849'),(26,1,'fd056926203e7b04dc85c96bfc86dc1405c1fbbed260e72e96ee04c225a65c33','Windows · Chrome','::1','Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36','2026-06-19 14:36:17.705','2026-05-20 14:36:17.707',NULL,'2026-05-20 14:36:17.707');
/*!40000 ALTER TABLE `Session` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Setting`
--

LOCK TABLES `Setting` WRITE;
/*!40000 ALTER TABLE `Setting` DISABLE KEYS */;
INSERT INTO `Setting` VALUES ('feature.email_verify_required','false','Hard-gate browsing on email verify (false = soft mode)',NULL,'2026-05-20 09:32:23.968'),('feature.maintenance_mode','false','Show maintenance page to all non-admin users',NULL,'2026-05-20 09:32:23.973'),('legal.privacy_url','\"/legal/privacy\"','Privacy policy URL',NULL,'2026-05-20 09:32:23.955'),('legal.refund_url','\"/legal/refunds\"','Refund policy URL',NULL,'2026-05-20 09:32:23.964'),('legal.terms_url','\"/legal/terms\"','Terms of service URL',NULL,'2026-05-20 09:32:23.959'),('payment.currency','\"INR\"','Display currency',NULL,'2026-05-20 09:32:23.951'),('payment.current_price_inr','99','Display price (mirrors monthly plan)',NULL,'2026-05-20 09:32:23.946'),('site.accent_color','\"#7A1F2B\"','Primary accent color (burgundy)',NULL,'2026-05-20 09:32:23.925'),('site.accent_color_alt','\"#D97F2E\"','Secondary accent color (saffron)',NULL,'2026-05-20 09:32:23.930'),('site.hero_config','{\"headline_tamil\":\"தமிழ் இலக்கியத்தின் டிஜிட்டல் வீடு\",\"headline_english\":\"The digital home of Tamil literature\",\"cta_text_tamil\":\"சந்தா செலுத்து\",\"cta_text_english\":\"Subscribe\",\"featured_content_ids\":[]}','Homepage hero configuration',NULL,'2026-05-20 09:32:23.940'),('site.logo_url','null','URL to site logo; null = use typographic logo',NULL,'2026-05-20 09:32:23.921'),('site.name','\"Kalaimagal\"','Site name (English)',NULL,'2026-05-20 09:32:23.899'),('site.name_tamil','\"கலைமகள்\"','Site name (Tamil)',NULL,'2026-05-20 09:32:23.904'),('site.social_links','{\"twitter\":null,\"instagram\":null,\"youtube\":null,\"facebook\":null}','Social media URLs',NULL,'2026-05-20 09:32:23.936'),('site.support_email','\"support@kalaimagal.com\"','Public support email address',NULL,'2026-05-20 09:32:23.917'),('site.tagline_english','\"The digital home of Tamil literature\"','Site tagline (English)',NULL,'2026-05-20 09:32:23.913'),('site.tagline_tamil','\"????? ????????????? ????????? ????\"','Site tagline (Tamil)',1,'2026-05-20 10:41:41.865');
/*!40000 ALTER TABLE `Setting` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Subscription`
--

LOCK TABLES `Subscription` WRITE;
/*!40000 ALTER TABLE `Subscription` DISABLE KEYS */;
INSERT INTO `Subscription` VALUES (2,10,1,'2026-05-20 14:35:16.638','2026-06-19 14:35:16.638','ACTIVE',NULL,NULL,0,6,'2026-05-20 14:35:16.658','2026-05-20 14:35:16.658');
/*!40000 ALTER TABLE `Subscription` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `SubscriptionPlan`
--

LOCK TABLES `SubscriptionPlan` WRITE;
/*!40000 ALTER TABLE `SubscriptionPlan` DISABLE KEYS */;
INSERT INTO `SubscriptionPlan` VALUES (1,'monthly','மாதாந்திர திட்டம்','Monthly Plan','30 நாட்கள் முழுமையான அணுகல்','Full access for 30 days',99.00,30,'[\"அனைத்து புத்தகங்களுக்கும் வரம்பற்ற அணுகல்\",\"Unlimited access to all books\",\"Premium blog articles\",\"Mobile + desktop reader\"]',1,1,0,NULL,'2026-05-20 07:20:19.366','2026-05-20 09:32:23.798'),(2,'yearly','new','new plan','','low price',999.00,365,NULL,1,0,0,NULL,'2026-05-20 14:41:45.219','2026-05-20 14:41:45.219');
/*!40000 ALTER TABLE `SubscriptionPlan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `Tag`
--

LOCK TABLES `Tag` WRITE;
/*!40000 ALTER TABLE `Tag` DISABLE KEYS */;
INSERT INTO `Tag` VALUES (1,'aarampam','ஆரம்பநிலை','Beginner',0,'2026-05-20 07:20:19.396'),(2,'meampatta','மேம்பட்ட','Advanced',0,'2026-05-20 07:20:19.401');
/*!40000 ALTER TABLE `Tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `User`
--

LOCK TABLES `User` WRITE;
/*!40000 ALTER TABLE `User` DISABLE KEYS */;
INSERT INTO `User` VALUES (1,'Admin','admin@gmail.com',NULL,'$2b$12$TInbhZm1AFN8wOEATSzxzOFAEOjAhS8QJ6q4DEpem4W9boDbDkhXu',1,'2026-05-20 07:20:19.215',NULL,NULL,NULL,'SUPER_ADMIN',NULL,NULL,'TA',NULL,1,0,NULL,'2026-05-20 14:36:17.715','2026-05-20 14:36:17.715',13,NULL,NULL,'2026-05-20 07:20:19.215',0,NULL,'2026-05-20 07:20:19.348','2026-05-20 14:36:17.717'),(4,'Muralikrishna AG','muralikrishna.webronic@gmail.com','9080177542','$2b$12$ibmSzqm1v/fTP8gthfRE/uR0oIJILyZJgv/kfbvfg6CdlNDL7tJ3m',0,NULL,'Sr3X5Rp_Z36GDbvPQIlN2zsq0lTgZvvbIbxhO9IqvQ8',NULL,NULL,'USER',NULL,NULL,'TA','{\"email\":true,\"payment\":true,\"content\":true}',1,0,NULL,NULL,NULL,0,NULL,NULL,'2026-05-20 08:14:10.600',1,NULL,'2026-05-20 08:14:10.610','2026-05-20 08:14:10.610'),(8,'Comment Writer','commentwriter4@gmail.com','7810077542','$2b$12$i1JnP9RqcNemjojAtj9VvO7ZAQFlQOc0GokZr8hSAyXTbF0WpMx8q',0,NULL,'Cy6TTlbT-4bsygenHaZ5Z_sNZBdmHiNk5nHMNa1plYw','_Qkw-V6gM8hS5j9LAFWpfsOCotFiX4yThzrNv65DdnM','2026-05-20 13:26:02.087','USER',NULL,NULL,'TA','{\"email\":true,\"payment\":true,\"content\":true}',1,0,NULL,'2026-05-20 13:44:30.030','2026-05-20 13:44:30.030',3,NULL,NULL,'2026-05-20 12:03:45.399',1,NULL,'2026-05-20 12:03:45.410','2026-05-20 13:44:30.040'),(10,'murali','muralikrishna@webronic.com','1234567890','$2b$12$h9bUDEF37cn3QH8nGOcPMeR5YvJjGVeWzs2eZMvACAQ3GT7uu6vo.',0,'2026-05-20 14:33:32.765',NULL,NULL,NULL,'USER',NULL,NULL,'TA','{\"email\":true,\"payment\":true,\"content\":true}',1,0,NULL,NULL,NULL,0,NULL,NULL,'2026-05-20 14:33:17.831',1,NULL,'2026-05-20 14:33:17.834','2026-05-20 14:33:32.774');
/*!40000 ALTER TABLE `User` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `WebhookLog`
--

LOCK TABLES `WebhookLog` WRITE;
/*!40000 ALTER TABLE `WebhookLog` DISABLE KEYS */;
/*!40000 ALTER TABLE `WebhookLog` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-21 13:18:21

SET FOREIGN_KEY_CHECKS=1;
