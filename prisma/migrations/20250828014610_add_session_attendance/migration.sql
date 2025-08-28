/*
  Warnings:

  - A unique constraint covering the columns `[studentId,sessionType,sessionDate]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sessionType` to the `attendance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('MORNING_IN', 'MORNING_OUT', 'AFTERNOON_IN', 'AFTERNOON_OUT');

-- AlterTable
ALTER TABLE "attendance" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "sessionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "sessionType" "SessionType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "attendance_studentId_sessionType_sessionDate_key" ON "attendance"("studentId", "sessionType", "sessionDate");
