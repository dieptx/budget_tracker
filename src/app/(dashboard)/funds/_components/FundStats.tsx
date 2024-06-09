'use client';

import { GetCategoriesStatsResponseType } from '@/app/(dashboard)/api/stats/categories/route';
import SkeletonWrapper from '@/components/SkeletonWrapper';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DateToUTCDate, GetFormatterForCurrency } from '@/lib/helpers';
import { Fund, UserSettings } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';

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
          <FundCard
            title={fund.name}
            formatter={formatter}
            actualAmount={+fund.currentAmount}
            targetAmount={+fund.targetAmount}
          />
        </SkeletonWrapper>
      ))}
    </div>
  );
}

export default FundsStats;

function FundCard({
  formatter,
  targetAmount = 0,
  actualAmount = 0,
  title,
}: {
  formatter: Intl.NumberFormat;
  title: String;
  targetAmount: number;
  actualAmount: number;
}) {
  const formatFn = React.useCallback(
    (value: number) => {
      return formatter.format(value);
    },
    [formatter]
  );

  const data = [
    { icon: '🏁', name: 'Mục tiêu', targetAmount, type: 'target' },
    { icon: '💹', name: 'Thực tế', actualAmount, type: 'actual' },
  ];

  return (
    <Card className='h-80'>
      <CardHeader>
        <CardTitle className='grid grid-flow-row justify-between gap-2 text-muted-foreground md:grid-flow-col'>
          {title}
        </CardTitle>
      </CardHeader>

      <div className='flex items-center justify-between gap-2'>
        {data.length > 0 && (
          <ScrollArea className='h-60 w-full px-4'>
            <div className='flex w-full flex-col gap-4 p-4'>
              {data.map((item) => {
                const amount = +(item.actualAmount || 0);
                const percentage = targetAmount
                  ? (amount * 100) / targetAmount
                  : 0;

                return (
                  <div key={item.name} className='flex flex-col gap-2'>
                    <div className='flex items-center justify-between'>
                      <span className='flex items-center text-gray-400'>
                        {item.icon} {item.name}
                        <span className='ml-2 text-xs text-muted-foreground'>
                          ({percentage.toFixed(0)}%)
                        </span>
                      </span>

                      <span className='text-sm text-gray-400'>
                        {formatter.format(amount)}
                      </span>
                    </div>

                    <Progress
                      value={percentage}
                      indicator={
                        item.type === 'target' ? 'bg-emerald-500' : 'bg-red-500'
                      }
                    />
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
}
