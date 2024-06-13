'use client';

import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { Fund, FundType, UserSettings } from '@prisma/client';
import { CardStackIcon } from '@radix-ui/react-icons';
import { useQuery } from '@tanstack/react-query';
import { PenLine } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import UpdateFundDialog from '@/app/(dashboard)/_components/UpdateFundDialog';

interface Props {
  userSettings: UserSettings;
}

function FundsStats({ userSettings }: Props) {
  const statsQuery = useQuery<Fund[]>({
    queryKey: ['overview', 'stats', 'categories'],
    queryFn: () => fetch(`/api/funds`).then((res) => res.json()),
  });

  const formatter = useMemo(() => {
    return GetFormatterForCurrency(userSettings.currency);
  }, [userSettings.currency]);

  return (
    <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
      {statsQuery.data?.map((fund) => (
        <SkeletonWrapper key={fund.id} isLoading={statsQuery.isFetching}>
          <FundCard fund={fund} formatter={formatter} />
        </SkeletonWrapper>
      ))}
    </div>
  );
}

export default FundsStats;

function FundCard({
  fund,
  formatter,
}: {
  fund: Fund;
  formatter: Intl.NumberFormat;
}) {
  const percentage = fund.targetAmount
    ? (+fund.currentAmount * 100) / +fund.targetAmount
    : 0;

  return (
    <Card className='h-80'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col items-center'>
          {fund.name}
          <UpdateFundDialog
            fund={fund}
            successCallback={() => {}}
            trigger={
              <Button variant='ghost' size='icon'>
                <PenLine className='h-4 w-4' />
              </Button>
            }
          />
        </CardTitle>
      </CardHeader>

      <div className='flex items-center justify-between gap-2'>
        <ScrollArea className='h-60 w-full px-4'>
          <div className='flex w-full flex-col gap-4 p-4'>
            <div key={fund.name} className='flex flex-col gap-2'>
              <div className='flex items-center justify-between'>
                <span className='flex items-center text-gray-400 text-xs'>
                  Thực tế: {formatter.format(+fund.currentAmount)}
                  <span className='ml-2 text-xs text-muted-foreground'>
                    ({percentage.toFixed(0)}%)
                  </span>
                </span>
              </div>

              <Progress value={percentage} indicator={'bg-green-500'} />
              <span className='text-sm text-gray-400'>
                {formatter.format(+fund.targetAmount)} 🏁
              </span>
            </div>
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
