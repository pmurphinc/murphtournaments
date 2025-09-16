/*
  Warnings:

  - A unique constraint covering the columns `[embarkId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "Region" AS ENUM ('NA', 'EU', 'APAC');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('PC', 'Xbox', 'PlayStation');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "embarkId" TEXT,
ADD COLUMN     "platform" "Platform",
ADD COLUMN     "region" "Region",
ADD COLUMN     "timezone" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_embarkId_key" ON "User"("embarkId");
