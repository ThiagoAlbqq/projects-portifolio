/*
  Warnings:

  - A unique constraint covering the columns `[userId,ipAddress]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_userId_ipAddress_key" ON "RefreshToken"("userId", "ipAddress");
