/*
  Warnings:

  - You are about to drop the column `lastLoginDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationDate` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[auth0Id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `lastLoginDate`,
    DROP COLUMN `password`,
    DROP COLUMN `registrationDate`,
    ADD COLUMN `auth0Id` VARCHAR(191) NOT NULL DEFAULT '',
    MODIFY `username` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_auth0Id_key` ON `User`(`auth0Id`);
