-- AlterTable
ALTER TABLE `Diary` DROP COLUMN `sentimentScores`,
    ADD COLUMN `negative` DOUBLE NOT NULL,
    ADD COLUMN `neutral` DOUBLE NOT NULL,
    ADD COLUMN `positive` DOUBLE NOT NULL;
