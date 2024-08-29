/*
  Warnings:

  - You are about to drop the column `mainEmotion` on the `diary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Diary` DROP COLUMN `mainEmotion`,
    ADD COLUMN `sentiment` JSON NULL;
