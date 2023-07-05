-- AlterTable
ALTER TABLE `Community` ADD COLUMN `feedId` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `CommunityFeed` (
    `communityId` VARCHAR(191) NOT NULL,
    `feedId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`communityId`, `feedId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
