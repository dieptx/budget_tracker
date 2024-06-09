/*
  Warnings:

  - You are about to drop the column `budget` on the `Fund` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "FundType" AS ENUM ('daily', 'emergency', 'sinking', 'investment');

-- CreateEnum
CREATE TYPE "InvestmentType" AS ENUM ('gold', 'etf', 'stock', 'mutual_fund', 'property');

-- AlterTable
ALTER TABLE "Fund" DROP COLUMN "budget",
ADD COLUMN     "currentAmount" DECIMAL(20,0) NOT NULL DEFAULT 0,
ADD COLUMN     "targetAmount" DECIMAL(20,0) NOT NULL DEFAULT 0,
ADD COLUMN     "type" "FundType" NOT NULL DEFAULT 'daily';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "investmentId" INTEGER;

-- CreateTable
CREATE TABLE "Investment" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "unitPrice" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "createdDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investmentType" "InvestmentType" NOT NULL,
    "fundId" INTEGER NOT NULL,

    CONSTRAINT "Investment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestmentHistory" (
    "id" SERIAL NOT NULL,
    "description" TEXT,
    "quantity" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "unitPrice" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "createdDate" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "investmentType" "InvestmentType" NOT NULL,
    "investmentId" INTEGER NOT NULL,

    CONSTRAINT "InvestmentHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Investment" ADD CONSTRAINT "Investment_fundId_fkey" FOREIGN KEY ("fundId") REFERENCES "Fund"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestmentHistory" ADD CONSTRAINT "InvestmentHistory_investmentId_fkey" FOREIGN KEY ("investmentId") REFERENCES "Investment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
