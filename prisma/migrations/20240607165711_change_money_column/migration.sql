/*
  Warnings:

  - You are about to alter the column `planAmount` on the `Category` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.
  - You are about to alter the column `amount` on the `CategoryHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.
  - You are about to alter the column `budget` on the `Fund` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.
  - You are about to alter the column `amount` on the `FundBudgetHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.
  - You are about to alter the column `income` on the `MonthHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.
  - You are about to alter the column `expense` on the `MonthHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.
  - You are about to alter the column `amount` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.
  - You are about to alter the column `income` on the `YearHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.
  - You are about to alter the column `expense` on the `YearHistory` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(20,0)`.

*/
-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "planAmount" SET DATA TYPE DECIMAL(20,0);

-- AlterTable
ALTER TABLE "CategoryHistory" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,0);

-- AlterTable
ALTER TABLE "Fund" ALTER COLUMN "budget" SET DATA TYPE DECIMAL(20,0);

-- AlterTable
ALTER TABLE "FundBudgetHistory" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,0);

-- AlterTable
ALTER TABLE "MonthHistory" ALTER COLUMN "income" SET DEFAULT 0,
ALTER COLUMN "income" SET DATA TYPE DECIMAL(20,0),
ALTER COLUMN "expense" SET DEFAULT 0,
ALTER COLUMN "expense" SET DATA TYPE DECIMAL(20,0);

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "amount" SET DEFAULT 0,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(20,0);

-- AlterTable
ALTER TABLE "YearHistory" ALTER COLUMN "income" SET DEFAULT 0,
ALTER COLUMN "income" SET DATA TYPE DECIMAL(20,0),
ALTER COLUMN "expense" SET DEFAULT 0,
ALTER COLUMN "expense" SET DATA TYPE DECIMAL(20,0);
