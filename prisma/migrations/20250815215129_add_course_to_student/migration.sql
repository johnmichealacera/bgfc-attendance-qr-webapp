/*
  Warnings:

  - Added the required column `course` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN "course" TEXT NOT NULL DEFAULT 'BEED';

-- Update existing records with course information based on the provided student list
-- This is a temporary default, the actual course data will be populated by the seed files
UPDATE "students" SET "course" = 'BEED' WHERE "course" = 'BEED';

-- Remove the default constraint after updating existing records
ALTER TABLE "students" ALTER COLUMN "course" DROP DEFAULT;
