import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { GetFormatterForCurrency } from '@/lib/helpers';
import prisma from '@/lib/prisma';
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import FundsStats from './_components/FundStats';
export default async function Funds() {
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
  return (
    <div className='container'>
      <FundsStats userSettings={userSettings} />
    </div>
  );
}
