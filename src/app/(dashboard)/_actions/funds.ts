'use server';

import prisma from '@/lib/prisma';
import { UpdateFundSchema, UpdateFundSchemaType } from '@/schema/funds';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

export async function updateFund(form: UpdateFundSchemaType) {
  const parsedBody = UpdateFundSchema.safeParse(form);
  if (!parsedBody.success) {
    throw new Error('Bad request');
  }

  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const { currentAmount, targetAmount, description, name, id } =
    parsedBody.data;

  const result = await prisma.fund.update({
    where: {
      id,
    },
    data: {
      currentAmount,
      targetAmount,
      description,
      name,
    },
  });

  try {
    await prisma.fundBudgetHistory.create({
      data: {
        fundId: form.id,
        amount: form.targetAmount,
      },
    });
  } catch (error) {
    console.log('🚀 ~ [LOG] Can not create category history ~ error:', error);
  }

  return result;
}
