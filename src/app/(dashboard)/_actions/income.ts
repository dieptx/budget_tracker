'use server';

import { GetFormatterForCurrency } from '@/lib/helpers';
import prisma from '@/lib/prisma';
import {
  CreateIncomeSchema,
  CreateIncomeSchemaType,
  DistributeIncomeSchema,
  DistributeIncomeSchemaType,
} from '@/schema/income';

import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export async function createIncome(form: CreateIncomeSchemaType) {
  const parsedBody = CreateIncomeSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { amount, date, description, year, month } = parsedBody.data;

  // Create income
  await prisma.income.create({
    data: {
      amount,
      date,
      description,
      year,
      month,
    },
  });
}

export async function getUnallocatedIncome(month: number, year: number) {
  // Get the total monthly income from the Income table.
  const totalIncomeRecord = await prisma.income.findFirst({
    where: {
      month,
      year,
    },
  });

  if (!totalIncomeRecord) {
    throw new Error(`Can not find income for ${month}/${year}`);
  }

  const totalIncome = totalIncomeRecord.amount;

  // Calculate the total amount of money allocated to the funds
  const totalDistributed = await prisma.transaction.aggregate({
    where: {
      type: 'income',
      date: {
        gte: new Date(year, month - 1, 1),
        lt: new Date(year, month, 1),
      },
      fundId: {
        not: null,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const distributedAmount = totalDistributed._sum.amount || 0;

  // Compare the total income and the total amount of money allocated
  if (totalIncome.equals(distributedAmount)) {
    console.log('[LOG] The income has been fully allocated');
    return 0;
  } else {
    console.log('[LOG] The income has not been fully allocated');
    const unallocatedIncome = totalIncome.minus(distributedAmount);
    console.log(`The remaining amount not yet allocated: ${unallocatedIncome}`);
    return unallocatedIncome;
  }
}

export async function distributeIncome(form: DistributeIncomeSchemaType) {
  const parsedBody = DistributeIncomeSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error(parsedBody.error.message);
  }
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  // Allocate funds into the funds
  const {
    amount,
    fund: { id },
  } = parsedBody.data;
  const fund = await prisma.fund.findUnique({
    where: { id },
  });

  if (!fund) {
    throw new Error('Không tìm thấy các quỹ cần thiết');
  }
  if (fund.currentAmount.equals(fund.targetAmount)) {
    throw new Error(
      `Quỹ ${fund.name} đã đủ số tiền mục tiêu là ${fund.targetAmount}, hãy phân bổ sang quỹ khác`
    );
  }
  if (fund.currentAmount.add(amount) > fund.targetAmount) {
    const remainAmount = fund.targetAmount.minus(fund.currentAmount);
    throw new Error(
      `Quỹ ${fund.name} chỉ cần thêm ${GetFormatterForCurrency(
        `${remainAmount}`
      )}, hãy phân bổ ${GetFormatterForCurrency(
        `${amount - +remainAmount}`
      )} sang quỹ khác`
    );
  }

  const allocateCategory = await prisma.category.findFirst({
    where: { name: 'phanbo' },
  });

  if (!allocateCategory) {
    throw new Error(
      'Không có danh mục để phân bổ, hãy tạo danh mục có tên "phanbo" trước và thử lại'
    );
  }

  // Create transactions in the Transaction table
  await prisma.transaction.createMany({
    data: [
      {
        userId: user.id,
        amount,
        type: 'income',
        fundId: id,
        description: 'Phân bổ quỹ',
        date: new Date(),
        categoryId: allocateCategory.id,
      },
    ],
  });

  // Update the actualAmount of the funds
  await prisma.fund.updateMany({
    where: {
      OR: [{ id: id }],
    },
    data: {
      currentAmount: {
        increment: amount,
      },
    },
  });
}
