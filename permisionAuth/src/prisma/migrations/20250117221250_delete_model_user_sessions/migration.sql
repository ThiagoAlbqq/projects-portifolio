/*
  Warnings:

  - You are about to drop the `UserSessions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserSessions" DROP CONSTRAINT "UserSessions_userId_fkey";

-- DropTable
DROP TABLE "UserSessions";
