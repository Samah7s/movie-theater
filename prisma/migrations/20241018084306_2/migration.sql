/*
  Warnings:

  - Added the required column `refresh_token` to the `Staff` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refresh_token` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `staff` ADD COLUMN `refresh_token` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `refresh_token` VARCHAR(191) NOT NULL;
