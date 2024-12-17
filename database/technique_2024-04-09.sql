-- MySQL dump 10.13  Distrib 8.2.0, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: technique
-- ------------------------------------------------------
-- Server version	8.2.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `basket`
--

DROP TABLE IF EXISTS `basket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `basket` (
  `product_id` int NOT NULL,
  `quantity` int NOT NULL,
  `user_id` int NOT NULL,
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `basket_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `basket_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `basket`
--

/*!40000 ALTER TABLE `basket` DISABLE KEYS */;
INSERT INTO `basket` VALUES (3,1,2),(11,3,2);
/*!40000 ALTER TABLE `basket` ENABLE KEYS */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `order_id` int NOT NULL,
  `product_id` int NOT NULL,
  `product_title` varchar(255) DEFAULT NULL,
  `product_image` varchar(255) DEFAULT NULL,
  `product_price` int NOT NULL,
  `quantity` int NOT NULL,
  `user_id` int NOT NULL,
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,8,'Xiaomi Smart Pen','http://localhost:3001/images/8.png',113,2,2),(2,7,'Mi Router 4C (White)','http://localhost:3001/images/7.png',20,1,2),(2,5,'Xiaomi Gaming Monitor G27i','http://localhost:3001/images/5.png',170,1,2),(1,10,'Xiaomi Watch S1 Pro','http://localhost:3001/images/10.png',284,1,3),(1,1,'Xiaomi Book 14','http://localhost:3001/images/1711101168604-1.png',886,1,3),(3,11,'Xiaomi Watch S1','http://localhost:3001/images/11.png',198,1,2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

--
-- Table structure for table `product_comments`
--

DROP TABLE IF EXISTS `product_comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_comments` (
  `product_id` int NOT NULL,
  `comment_id` int NOT NULL,
  `comment` varchar(1000) NOT NULL,
  `user_id` int NOT NULL,
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `product_comments_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_comments`
--

/*!40000 ALTER TABLE `product_comments` DISABLE KEYS */;
INSERT INTO `product_comments` VALUES (2,2,'Very good',1),(3,3,'Bad',1),(1,4,'Gooooood',1),(1,6,'Nooooo',3),(8,8,'Favorite',2),(1,10,'I like it',2),(3,11,'Like',2);
/*!40000 ALTER TABLE `product_comments` ENABLE KEYS */;

--
-- Table structure for table `product_rating`
--

DROP TABLE IF EXISTS `product_rating`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_rating` (
  `product_id` int NOT NULL,
  `rate` int NOT NULL,
  `user_id` int NOT NULL,
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `product_rating_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`),
  CONSTRAINT `product_rating_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_rating`
--

/*!40000 ALTER TABLE `product_rating` DISABLE KEYS */;
INSERT INTO `product_rating` VALUES (2,5,1),(3,1,1),(1,4,2),(6,3,1),(4,5,1),(2,4,2),(2,1,3),(5,5,2),(3,4,2),(6,5,2),(1,4,1),(7,5,2),(12,2,1);
/*!40000 ALTER TABLE `product_rating` ENABLE KEYS */;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(255) NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `feildOfApplication` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `subcategory` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `quantity` int unsigned NOT NULL,
  `price` int unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Xiaomi Book 14','2880x1800, IPS, Intel Core i5-12500H, ядра: 4 + 8 х 2.5 ГГц, RAM 16 ГБ, SSD 512 ГБ, Intel Iris Xe Graphics , Windows 11 Home','1711101168604-1.png','life-style','office','laptop',9,886),(2,'RedmiBook 15','Full HD (1920x1080), TN+film, Intel Core i5-11320H, ядра: 4 х 2.5 ГГц, RAM 8 ГБ, SSD 512 ГБ, Intel Iris Xe Graphics , Windows 11 Home','2.jpg','life-style','office','laptop',17,681),(3,'Xiaomi Pad 6','2880x1800, IPS, 8x3.2 ГГц, 8 ГБ, 8840 мА*ч, Android 13.x','3.jpg','life-style','office','tablet',10,454),(4,'Xiaomi Pad 5','2560x1600, IPS, 8x2.96 ГГц, 6 ГБ, 8720 мА*ч, Android 11.x','4.png','life-style','office','tablet',13,367),(5,'Xiaomi Gaming Monitor G27i','1920x1080 (FullHD)@165 Гц, IPS, LED, 1 мс, 1000:1, 250 Кд/м², 178°/178°, DisplayPort 1.2, HDMI 2.0, AMD FreeSync Premium','5.png','life-style','office','monitor',18,170),(6,'Mi 23.8\'\' Desktop Monitor 1C','1920x1080 (FullHD)@60 Гц, IPS, LED, 1000:1, 250 Кд/м², 178°/178°, HDMI, VGA (D-Sub) ','6.png','life-style','office','monitor',17,125),(7,'Mi Router 4C (White)','2 LAN, 100 Мбит/с, 4 (802.11n), Wi-Fi 300 Мбит/с, IPv6','7.png','life-style','office','router',12,20),(8,'Xiaomi Smart Pen','active, 4096 sensitivity levels, up to 150 hours','8.png','life-style','office','other',4,113),(9,'Xiaomi Watch 2 Pro','1.43\", AMOLED, 466x466, Bluetooth, Wi-Fi, для Android, iOS','9.jpg','life-style','wearable','watch',6,295),(10,'Xiaomi Watch S1 Pro','1.47\", AMOLED, 480x480, Bluetooth, NFC, для Android 6.0 и выше, iOS 11 и выше','10.png','life-style','wearable','watch',6,284),(11,'Xiaomi Watch S1','1.43\", AMOLED, 466x466, Bluetooth, Wi-Fi, для Android 6.0 и выше, iOS 10 и выше','11.png','life-style','wearable','watch',5,198),(12,'Xiaomi Watch S1 Active','1.43\", AMOLED, 466x466, Bluetooth, NFC, Wi-Fi, для Android 6.0 и выше, iOS 10 и выше','12.png','life-style','wearable','watch',8,168),(13,'Redmi Buds 5','2.0, внутриканальные, 16Ω, Bluetooth, 5.3','13.png','life-style','wearable','headphones',20,37),(14,'Redmi Buds 5 Pro','2.0, внутриканальные, 16Ω, Bluetooth, 5.3 ','14.jpg','life-style','wearable','headphones',18,68),(15,'Xiaomi Buds 3 Star Wars Edition','2.0, внутриканальные, 20 Гц - 20000 Гц, Bluetooth, 5.2','15.png','life-style','wearable','headphones',15,119),(16,'Xiaomi Electric Glass Kettle','1.7 Liters Large Capacity, 5 Minutes Boil with 2200W high power output, LED light display, Heating indicator, Wi-Fi IEEE 802.11b/g/n 2,4 ГГц','16.png','smart-home','kitchen appliance','kettle',20,135),(17,'Xiaomi TV A Pro 55','Quad-core A55 CPU, Mali G52 GPU, large 2GB + 16GB memory','17.png','life-style','office','monitor',35,514),(18,'Router','Des','1712642949956-18.png','life-style','office','router',10,20);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Marine','m@gmail.com','$2a$10$R9pwt3Suqk8AbXWtGcvkzuI082sg4qDavOESLmC1.FK0.Ec8sgAqa','admin'),(2,'Rita','r@gmail.com','$2a$10$zExBOEL.VI6Sh65e83PNZOELDXv6kKJ8GVjsh.v9enFevV27iKCNS','user'),(3,'Lina','l@gmail.com','$2a$10$Kese5E1r7hO9jmY4PK31xOSCKov5yDXmyGSS3JAp.VF7nkPJjfV3K','user'),(4,'Vera','v@gmail.com','$2a$10$Sr/RXaZAiV.Hr/uQkHKZM.z0k.gA1NJaz6Ey0Ep7gi5olRhV2Vcr2','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

--
-- Dumping routines for database 'technique'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-09 13:45:40
