/*
  Warnings:

  - Added the required column `yearLevel` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN "yearLevel" TEXT NOT NULL DEFAULT '1';

-- Update existing records with year level based on student ID
UPDATE "students" SET "yearLevel" = 
  CASE 
    WHEN "studentId" LIKE '2025-%' THEN '1'
    WHEN "studentId" LIKE '2024-%' THEN '2'
    WHEN "studentId" LIKE '2023-%' THEN '3'
    WHEN "studentId" LIKE '2022-%' THEN '4'
    WHEN "studentId" LIKE '2021-%' THEN '4'
    WHEN "studentId" LIKE '2020-%' THEN '4'
    WHEN "studentId" LIKE '2019-%' THEN '4'
    WHEN "studentId" LIKE '2018-%' THEN '4'
    WHEN "studentId" LIKE '2017-%' THEN '4'
    WHEN "studentId" LIKE '2016-%' THEN '4'
    WHEN "studentId" LIKE '2014-%' THEN '4'
    ELSE '1'
  END;

-- Remove the default constraint after updating existing records
ALTER TABLE "students" ALTER COLUMN "yearLevel" DROP DEFAULT;
