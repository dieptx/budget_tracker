import CreateTransactionDialog from '@/app/(dashboard)/_components/CreateTransactionDialog';
import History from '@/app/(dashboard)/_components/History';
import Overview from '@/app/(dashboard)/_components/Overview';
import { Button } from '@/components/ui/button';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react';
import CreateIncomeDialog from './_components/CreateIncomeDialog';
import { getUnallocatedIncome } from './_actions/income';
import DistributeIncomeDialog from './_components/DistributeIncomeDialog';

async function page() {
  const user = await currentUser();
  if (!user) {
    redirect('/sign-in');
  }

  const userSettings = await prisma.userSettings.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!userSettings) {
    redirect('/wizard');
  }

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const unallocatedAmount = await getUnallocatedIncome(
    currentMonth,
    currentYear
  );

  return (
    <div className='h-full bg-background'>
      <div className='border-b bg-card'>
        <div className='container flex flex-wrap items-center justify-between gap-6 py-8'>
          <p className='text-3xl font-bold'>Hello, {user.firstName}! 👋</p>

          <div className='flex items-center gap-3'>
            <CreateIncomeDialog
              trigger={
                <Button
                  variant={'outline'}
                  className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white'
                >
                  Tiền về 🤑
                </Button>
              }
            />
            {unallocatedAmount ? (
              <DistributeIncomeDialog
                trigger={
                  <Button
                    variant={'outline'}
                    className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white'
                  >
                    Phân bổ quỹ 🍀
                  </Button>
                }
              />
            ) : null}
            <CreateTransactionDialog
              trigger={
                <Button
                  // variant={'outline'}
                  className='border-emerald-500 bg-emerald-950 text-white hover:bg-emerald-700 hover:text-white'
                >
                  Thu nhập 😤
                </Button>
              }
              type='income'
            />
            <CreateTransactionDialog
              trigger={
                <Button
                  variant={'outline'}
                  className='border-rose-500 bg-rose-950 text-white hover:bg-rose-700 hover:text-white'
                >
                  Lại phải chi 😤
                </Button>
              }
              type='expense'
            />
          </div>
        </div>
      </div>
      <Overview userSettings={userSettings} />
      <History userSettings={userSettings} />
    </div>
  );
}

export default page;
