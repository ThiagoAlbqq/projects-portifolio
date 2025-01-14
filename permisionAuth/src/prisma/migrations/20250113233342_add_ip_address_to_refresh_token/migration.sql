/*
  Warnings:

  - Added the required column `ipAddress` to the `UserSessions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserSessions" ADD COLUMN     "ipAddress" TEXT NOT NULL;
