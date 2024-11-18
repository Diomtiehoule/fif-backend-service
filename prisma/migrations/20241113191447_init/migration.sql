-- AlterTable
ALTER TABLE `bulletinvote` ADD COLUMN `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `candidat` ADD COLUMN `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `election` ADD COLUMN `is_active` BOOLEAN NULL DEFAULT true,
    ALTER COLUMN `type` DROP DEFAULT;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `is_active` BOOLEAN NULL DEFAULT true;

-- AlterTable
ALTER TABLE `votant` ADD COLUMN `is_active` BOOLEAN NULL DEFAULT true;
