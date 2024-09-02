/*
  Warnings:

  - Added the required column `advice` to the `Diary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Diary` ADD COLUMN `advice` VARCHAR(191) NOT NULL;
