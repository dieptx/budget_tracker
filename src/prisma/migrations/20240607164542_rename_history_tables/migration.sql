/*
  Warnings:

  - You are about to drop the column `categoryBudgetId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `CategoryBudget` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FundBudget` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `categoryId` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CategoryBudget" DROP CONSTRAINT "CategoryBudget_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "FundBudget" DROP CONSTRAINT "FundBudget_fundId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_categoryBudgetId_fkey";

-- AlterTable
ALTER TABLE "Fund" ADD COLUMN     "budget" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "categoryBudgetId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CategoryBudget";

-- DropTable
DROP TABLE "FundBudget";

-- CreateTable
CREATE TABLE "FundBudgetHistory" (
    "id" SERIAL NOT NULL,
    "fundId" INTEGER NOT NULL,
    "createdDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "FundBudgetHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryHistory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "categoryName" INTEGER NOT NULL,
    "createdDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(65,30) NOT NULL DEFAULT 0,

    CONSTRAINT "CategoryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FundBudgetHistory_fundId_idx" ON "FundBudgetHistory"("fundId");

-- CreateIndex
CREATE INDEX "CategoryHistory_categoryId_idx" ON "CategoryHistory"("categoryId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FundBudgetHistory" ADD CONSTRAINT "FundBudgetHistory_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryHistory" ADD CONSTRAINT "CategoryHistory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
