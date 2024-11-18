-- CreateTable
CREATE TABLE `Election` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date_time_start` DATETIME(3) NULL,
    `date_time_end` DATETIME(3) NULL,
    `title` VARCHAR(191) NULL,
    `content` VARCHAR(191) NULL,
    `type_id` INTEGER NOT NULL,
    `statut` VARCHAR(191) NULL DEFAULT 'waiting',
    `type` VARCHAR(191) NULL DEFAULT 'public',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `type_election_id_fkey`(`type_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `content` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidat` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `birth_date` DATETIME(3) NULL,
    `email` VARCHAR(191) NULL,
    `bio` VARCHAR(191) NULL,
    `election_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Candidat_email_key`(`email`),
    INDEX `election_candidat_id_fkey`(`election_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Votant` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NULL,
    `last_name` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `categorie_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Votant_email_key`(`email`),
    INDEX `categorie_votant_id_fkey`(`categorie_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Categorie` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NULL,
    `content` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BulletinVote` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(191) NULL,
    `code` VARCHAR(191) NULL,
    `url_vote` VARCHAR(191) NULL,
    `start_valid` DATETIME(3) NULL,
    `end_valid` DATETIME(3) NULL,
    `election_id` INTEGER NOT NULL,
    `candidat_id` INTEGER NOT NULL,
    `votant_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `election_bulletin_id_fkey`(`election_id`),
    INDEX `candidat_bulletin_id_fkey`(`candidat_id`),
    INDEX `votant_bulletin_id_fkey`(`votant_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Election` ADD CONSTRAINT `Election_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `Type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidat` ADD CONSTRAINT `Candidat_election_id_fkey` FOREIGN KEY (`election_id`) REFERENCES `Election`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Votant` ADD CONSTRAINT `Votant_categorie_id_fkey` FOREIGN KEY (`categorie_id`) REFERENCES `Categorie`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BulletinVote` ADD CONSTRAINT `BulletinVote_election_id_fkey` FOREIGN KEY (`election_id`) REFERENCES `Election`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BulletinVote` ADD CONSTRAINT `BulletinVote_candidat_id_fkey` FOREIGN KEY (`candidat_id`) REFERENCES `Candidat`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BulletinVote` ADD CONSTRAINT `BulletinVote_votant_id_fkey` FOREIGN KEY (`votant_id`) REFERENCES `Votant`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
