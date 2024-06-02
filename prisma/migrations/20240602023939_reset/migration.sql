/*
  Warnings:

  - You are about to drop the column `ImageKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Account` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "ImageKey",
DROP COLUMN "image",
ADD COLUMN     "profileImage" TEXT,
ADD COLUMN     "profileImageKey" TEXT,
ALTER COLUMN "username" SET NOT NULL;

-- DropTable
DROP TABLE "Account";
