-- AlterTable
ALTER TABLE `Diary` DROP COLUMN `sentiment`,
    ADD COLUMN `mainSentiment` VARCHAR(191) NOT NULL,
    ADD COLUMN `sentimentScores` JSON NOT NULL;
