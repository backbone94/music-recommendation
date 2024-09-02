/*
  Warnings:

  - You are about to drop the `advice` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `advice`;

-- CreateTable
CREATE TABLE `WeeklyAdvice` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `advice` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
