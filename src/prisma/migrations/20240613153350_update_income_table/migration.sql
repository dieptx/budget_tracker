/*
  Warnings:

  - Added the required column `month` to the `Income` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Income` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Income" ADD COLUMN     "month" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER NOT NULL;
